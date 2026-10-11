#!/usr/bin/env node
// vibe-coding-zero-to-ship guard: live site self-check.
// Looks at a deployed site the way a stranger or bot would, and reports what is exposed.
// Zero dependencies (Node 18+). Only run it against sites the user owns or is allowed to test.
//
// Usage: node live-check.mjs <url> [--supabase-url <url>]
//   --supabase-url  the project's Supabase API address, if it uses a custom domain
//                   (*.supabase.co addresses are found automatically)
//
// Exit codes: 0 = no FAIL findings, 1 = at least one FAIL, 2 = could not run.

import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanText } from "./secret-scan.mjs";

const TIMEOUT_MS = 10000;
const MAX_SCRIPTS = 40;
const MAX_BODY = 8 * 1024 * 1024;
const MAX_TABLES = 60;

const findings = [];
const add = (level, title, detail = "") => findings.push({ level, title, detail });

async function get(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { redirect: "follow", ...init, signal: controller.signal });
    const buf = Buffer.from(await res.arrayBuffer());
    return { status: res.status, headers: res.headers, url: res.url, text: buf.subarray(0, MAX_BODY).toString("utf8") };
  } catch (error) {
    return { status: 0, headers: new Headers(), url, text: "", error: error.name === "AbortError" ? "timeout" : error.message };
  } finally {
    clearTimeout(timer);
  }
}

const isLocal = (u) => ["localhost", "127.0.0.1", "[::1]", "::1"].includes(new URL(u).hostname);

// Paths a bot tries first. `looks` confirms real content, so single-page apps that
// answer every path with index.html are not reported as leaks.
const EXPOSED_PATHS = [
  ["/.env", (t) => /^\s*[A-Z][A-Z0-9_]*\s*=/m.test(t), "FAIL", "Environment file is publicly downloadable"],
  ["/.env.local", (t) => /^\s*[A-Z][A-Z0-9_]*\s*=/m.test(t), "FAIL", "Environment file is publicly downloadable"],
  ["/.env.production", (t) => /^\s*[A-Z][A-Z0-9_]*\s*=/m.test(t), "FAIL", "Environment file is publicly downloadable"],
  ["/.git/config", (t) => /\[core\]/.test(t), "FAIL", "Git folder is public (the whole source and history can be downloaded)"],
  ["/.git/HEAD", (t) => /^ref: refs\//.test(t), "FAIL", "Git folder is public (the whole source and history can be downloaded)"],
  ["/config.json", (t) => /(secret|password|api[_-]?key|token)\s*"\s*:/i.test(t), "FAIL", "Config file with secret-looking fields is public"],
  ["/database.sqlite", (t) => t.startsWith("SQLite format 3"), "FAIL", "Database file is publicly downloadable"],
  ["/db.sqlite", (t) => t.startsWith("SQLite format 3"), "FAIL", "Database file is publicly downloadable"],
  ["/data.json", (t) => /"(phone|email|password|name)"\s*:/i.test(t), "WARN", "Data file with personal-looking fields is public"],
  ["/backup.zip", (t) => t.startsWith("PK"), "FAIL", "Backup archive is publicly downloadable"],
  ["/.DS_Store", (t) => t.includes("Bud1"), "WARN", "Folder listing file (.DS_Store) is public"],
  ["/phpinfo.php", (t) => /phpinfo\(\)|PHP Version/i.test(t), "FAIL", "phpinfo page exposes server details"]
];

const DEBUG_SIGNS = [
  [/Traceback \(most recent call last\)/, "Python error trace shown to visitors"],
  [/You're seeing this error because you have <code>DEBUG = True/, "Django debug mode is on"],
  [/Werkzeug Debugger|The debugger caught an exception/i, "Flask/Werkzeug debugger is on (can allow remote code execution)"],
  [/at [\w.<>]+ \((?:\/|[A-Z]:\\)[^)]+:\d+:\d+\)/, "Server error stack trace shown to visitors"],
  [/Whoops! There was an error|Illuminate\\/, "Laravel debug page is on"]
];

const ADMIN_PATHS = ["/admin", "/admin.html", "/dashboard", "/api/admin", "/api/users"];

function scriptSources(html, base) {
  const out = new Set();
  for (const m of html.matchAll(/<script[^>]+src=["']([^"']+)["']/gi)) {
    try {
      const u = new URL(m[1], base);
      if (u.origin === new URL(base).origin) out.add(u.href);
    } catch {}
  }
  for (const m of html.matchAll(/<link[^>]+href=["']([^"']+\.m?js)["']/gi)) {
    try {
      const u = new URL(m[1], base);
      if (u.origin === new URL(base).origin) out.add(u.href);
    } catch {}
  }
  return [...out].slice(0, MAX_SCRIPTS);
}

function decodeJwt(token) {
  try {
    return JSON.parse(Buffer.from(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  } catch {
    return null;
  }
}

async function checkSupabase(bundleText, extraUrl) {
  const urls = new Set(bundleText.match(/https:\/\/[a-z0-9]{10,}\.supabase\.co/g) || []);
  if (extraUrl) urls.add(extraUrl.replace(/\/+$/, ""));
  const anonKeys = (bundleText.match(/eyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g) || []).filter(
    (k) => (decodeJwt(k) || {}).role === "anon"
  );
  if (!urls.size || !anonKeys.length) return;
  const key = anonKeys[0];
  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  for (const base of urls) {
    const spec = await get(`${base}/rest/v1/`, { headers });
    if (spec.status !== 200) {
      add("INFO", `Supabase project found (${base}); its table list is not public`, "Still run the second-account test in verify-it-works.md.");
      continue;
    }
    let tables = [];
    try {
      tables = Object.keys(JSON.parse(spec.text).paths || {})
        .filter((p) => /^\/[^/{]+$/.test(p) && !p.startsWith("/rpc"))
        .map((p) => p.slice(1));
    } catch {}
    const open = [];
    const openEmpty = [];
    for (const table of tables.slice(0, MAX_TABLES)) {
      const res = await get(`${base}/rest/v1/${encodeURIComponent(table)}?select=*&limit=1`, { headers });
      if (res.status !== 200) continue;
      try {
        const rows = JSON.parse(res.text);
        if (Array.isArray(rows) && rows.length) open.push(table);
        else openEmpty.push(table);
      } catch {}
    }
    if (open.length) {
      add("FAIL", `Database tables readable by anyone with the public key: ${open.join(", ")}`,
        "Any visitor can read these rows. Enable row-level security with policies that limit rows to their owner, unless the data is meant to be public.");
    }
    if (openEmpty.length) {
      add("WARN", `Tables that answered the public key with no rows: ${openEmpty.join(", ")}`,
        "Either empty or filtered by rules. Confirm with the second-account test that other people's rows stay hidden.");
    }
    if (!open.length && !openEmpty.length) add("PASS", `Supabase (${base}): no table returned rows to the public key`);
  }
}

async function checkFirebase(bundleText) {
  const dbs = new Set(bundleText.match(/https:\/\/[a-z0-9-]+(?:-default-rtdb)?\.(?:firebaseio\.com|[a-z0-9-]+\.firebasedatabase\.app)/g) || []);
  for (const db of dbs) {
    const res = await get(`${db}/.json?shallow=true`);
    if (res.status === 200 && res.text.trim() !== "null") {
      add("FAIL", `Firebase Realtime Database is readable by anyone: ${db}`, "Tighten the database rules so data requires sign-in and ownership.");
    }
  }
}

async function main(argv) {
  const target = argv.find((a) => !a.startsWith("--"));
  const sbIndex = argv.indexOf("--supabase-url");
  const supabaseUrl = sbIndex >= 0 ? argv[sbIndex + 1] : null;
  if (!target || argv.includes("--help")) {
    console.log("Usage: node live-check.mjs <url> [--supabase-url <url>]");
    return target ? 0 : 2;
  }
  let base;
  try {
    base = new URL(/^https?:\/\//.test(target) ? target : "https://" + target);
  } catch {
    console.error("Not a valid address: " + target);
    return 2;
  }

  console.log(`Checking ${base.href}. Only run this against sites you own or may test.\n`);
  const home = await get(base.href);
  if (!home.status) {
    console.error(`Could not reach ${base.href} (${home.error}).`);
    return 2;
  }
  add(home.status < 400 ? "PASS" : "WARN", `Home page answered with status ${home.status}`);

  // HTTPS
  if (base.protocol === "http:" && !isLocal(base.href)) {
    add("FAIL", "Site is served over plain HTTP", "Passwords and personal data can be read in transit. Use HTTPS (managed hosts do this automatically).");
  } else if (base.protocol === "https:") {
    const plain = await get(base.href.replace(/^https:/, "http:"), { redirect: "manual" });
    const loc = plain.headers.get("location") || "";
    if (plain.status && !(plain.status >= 300 && plain.status < 400 && loc.startsWith("https:"))) {
      add("WARN", "The http:// address does not redirect to https://", "Turn on 'force HTTPS' in the host's settings.");
    } else if (plain.status) add("PASS", "http:// redirects to https://");
  }

  // Baseline for "not found", to see through single-page-app fallbacks.
  const missing = await get(new URL(`/vibe-check-${Date.now()}-does-not-exist`, base).href);
  const sameAsMissing = (r) => missing.status === 200 && r.text === missing.text;

  for (const [re, label] of DEBUG_SIGNS) {
    if (re.test(missing.text) || re.test(home.text)) add("FAIL", label, "Turn off debug mode and show visitors a plain error page.");
  }

  for (const [p, looks, level, label] of EXPOSED_PATHS) {
    const r = await get(new URL(p, base).href);
    if (r.status === 200 && !sameAsMissing(r) && looks(r.text)) add(level, `${label}: ${p}`, "Remove it from the published files or block it in the host's settings.");
  }

  for (const p of ADMIN_PATHS) {
    const r = await get(new URL(p, base).href);
    if (r.status === 200 && !sameAsMissing(r) && !/<input[^>]+type=["']?password/i.test(r.text) && !/log ?in|sign ?in|登录/i.test(r.text)) {
      add("WARN", `${p} opens without asking anyone to sign in`, "If this is an admin page or private API, it must require real authentication.");
    }
  }

  // Front-end code: secrets and backend exposure.
  const scripts = scriptSources(home.text, home.url || base.href);
  let bundle = home.text;
  for (const src of scripts) {
    const r = await get(src);
    if (r.status !== 200) continue;
    bundle += "\n" + r.text;
    const map = r.text.match(/\/\/[#@] sourceMappingURL=([^\s]+)/);
    if (map && !map[1].startsWith("data:")) {
      const mr = await get(new URL(map[1], src).href);
      if (mr.status === 200 && mr.text.includes('"sources"')) add("WARN", `Source map is public: ${new URL(map[1], src).pathname}`, "Your original source code can be read. Fine for open-source; otherwise disable source maps in production.");
    }
  }
  const secretHits = scanText(bundle).filter((f) => f.severity === "block");
  for (const f of secretHits) add("FAIL", `Secret in code sent to every visitor: ${f.label} ${f.preview}`, "Rotate it now, then move the call to the server so the key never reaches the browser.");
  if (!secretHits.length) add("PASS", `No secrets found in the page or ${scripts.length} script file(s)`);

  await checkSupabase(bundle, supabaseUrl);
  await checkFirebase(bundle);

  // Report
  const order = { FAIL: 0, WARN: 1, INFO: 2, PASS: 3 };
  findings.sort((a, b) => order[a.level] - order[b.level]);
  const icon = { FAIL: "✖ FAIL", WARN: "! WARN", INFO: "i INFO", PASS: "✔ PASS" };
  for (const f of findings) {
    console.log(`${icon[f.level]}  ${f.title}`);
    if (f.detail && f.level !== "PASS") console.log(`        ${f.detail}`);
  }
  const fails = findings.filter((f) => f.level === "FAIL").length;
  const warns = findings.filter((f) => f.level === "WARN").length;
  console.log(`\n${fails} fail, ${warns} warning(s). This check sees what outsiders see; it does not replace the second-account test.`);
  return fails ? 1 : 0;
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  main(process.argv.slice(2)).then(
    (code) => (process.exitCode = code),
    (error) => {
      console.error("live-check failed: " + error.message);
      process.exitCode = 2;
    }
  );
}
