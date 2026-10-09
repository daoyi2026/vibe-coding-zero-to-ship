// Tests for guards/*.mjs. Run: node --test tests/guards.test.mjs
// All key-shaped values are assembled at runtime so this file never contains
// anything that looks like a real credential.

import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawn } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { scanText } from "../guards/secret-scan.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guard = (name) => path.join(root, "guards", name);

const b64url = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
const jwt = (payload) => [b64url({ alg: "HS256", typ: "JWT" }), b64url(payload), "s".repeat(43)].join(".");

const KEYS = {
  openai: ["sk", "proj", "Q7".repeat(24)].join("-"),
  aws: "AK" + "IA" + "Z3XQ7WJ2LM4KP9RT",
  google: "AI" + "za" + "Sy" + "B".repeat(33),
  stripe: ["sk", "live", "4eC39HqLyjWDarjtT1zdp7dc"].join("_"),
  aliyun: "LT" + "AI" + "5tQ9hX2mN7kP3wR8",
  dbUrl: "postgres" + "://admin:" + "S3cr3tPw" + "@db.internal:5432/app",
  service: jwt({ iss: "supabase", ref: "abcdefghijklmnopqrst", role: "service" + "_role" }),
  anon: jwt({ iss: "supabase", ref: "abcdefghijklmnopqrst", role: "anon" })
};

const tmp = () => mkdtempSync(path.join(tmpdir(), "vibe-guard-test-"));
const gitIn = (dir, ...args) =>
  execFileSync("git", ["-C", dir, "-c", "user.name=Test", "-c", "user.email=test@example.com", "-c", "commit.gpgsign=false", ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"]
  });
const run = (script, args, opts = {}) => {
  try {
    return { code: 0, out: execFileSync(process.execPath, [guard(script), ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...opts }) };
  } catch (error) {
    return { code: error.status, out: String(error.stdout) + String(error.stderr) };
  }
};

test("detects common provider keys", () => {
  for (const [name, value] of Object.entries(KEYS)) {
    if (name === "anon") continue;
    const findings = scanText(`const value = "${value}";`).filter((f) => f.severity === "block");
    assert.ok(findings.length > 0, `expected ${name} to be detected`);
  }
});

test("hard-coded password assignment is detected, placeholders are not", () => {
  const assignment = "DB_PASSWORD = " + '"' + "h7Gk2pQ9" + "zX4vL1m" + '"';
  assert.ok(scanText(assignment).some((f) => f.severity === "block"));
  for (const safe of [
    `API_KEY = "your_api_key_here"`,
    `apiKey: process.env.OPENAI_API_KEY`,
    `password: "<your password>"`,
    `const secret = import.meta.env.VITE_SECRET;`,
    `token = "\${TOKEN_FROM_ENV}"`
  ]) {
    assert.equal(scanText(safe).filter((f) => f.severity === "block").length, 0, `false positive on: ${safe}`);
  }
});

test("allow marker suppresses a line", () => {
  assert.equal(scanText(`key = "${KEYS.aws}" // vibe-guard: allow`).length, 0);
});

test("public anon key is a note, service-role key blocks", () => {
  const anon = scanText(`k="${KEYS.anon}"`);
  assert.equal(anon.length, 1);
  assert.equal(anon[0].severity, "note");
  const service = scanText(`k="${KEYS.service}"`);
  assert.equal(service[0].severity, "block");
});

test("CLI scans working files and flags .env by name", () => {
  const dir = tmp();
  try {
    writeFileSync(path.join(dir, "app.js"), `export const k = "${KEYS.stripe}";\n`);
    writeFileSync(path.join(dir, ".env"), "NAME=demo\n");
    const res = run("secret-scan.mjs", [dir]);
    assert.equal(res.code, 1);
    assert.match(res.out, /Stripe live secret key/);
    assert.match(res.out, /\.env file/);

    const clean = tmp();
    writeFileSync(path.join(clean, "app.js"), "console.log('hello');\n");
    writeFileSync(path.join(clean, ".env.example"), "OPENAI_API_KEY=your_key_here\n");
    assert.equal(run("secret-scan.mjs", [clean]).code, 0);
    rmSync(clean, { recursive: true, force: true });
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("--history finds a secret that was deleted in a later commit", () => {
  const dir = tmp();
  try {
    gitIn(dir, "init", "-q");
    writeFileSync(path.join(dir, "config.js"), `module.exports = { key: "${KEYS.google}" };\n`);
    gitIn(dir, "add", ".");
    gitIn(dir, "commit", "-q", "-m", "add config", "--no-verify");
    writeFileSync(path.join(dir, "config.js"), "module.exports = { key: process.env.KEY };\n");
    gitIn(dir, "commit", "-q", "-am", "remove key", "--no-verify");

    assert.equal(run("secret-scan.mjs", [dir]).code, 0, "current files are clean");
    const res = run("secret-scan.mjs", [dir, "--history"]);
    assert.equal(res.code, 1, "history still holds the key");
    assert.match(res.out, /Google API key/);
    assert.match(res.out, /commit/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("install-guards adds .gitignore defaults and a hook that blocks secret commits", () => {
  const dir = tmp();
  try {
    const install = run("install-guards.mjs", [dir, "--init"]);
    assert.equal(install.code, 0, install.out);
    const ignore = readFileSync(path.join(dir, ".gitignore"), "utf8");
    assert.match(ignore, /^\.env$/m);
    assert.match(ignore, /^!\.env\.example$/m);

    // re-running is idempotent
    assert.equal(run("install-guards.mjs", [dir]).code, 0);
    assert.equal(readFileSync(path.join(dir, ".gitignore"), "utf8"), ignore);

    writeFileSync(path.join(dir, "server.js"), `const key = "${KEYS.openai}";\n`);
    gitIn(dir, "add", "server.js");
    assert.throws(() => gitIn(dir, "commit", "-q", "-m", "leak"), /Commit blocked|secret/i);

    writeFileSync(path.join(dir, "server.js"), "const key = process.env.OPENAI_API_KEY;\n");
    gitIn(dir, "add", "server.js");
    gitIn(dir, "commit", "-q", "-m", "clean");
    assert.match(gitIn(dir, "log", "--oneline"), /clean/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("install-guards keeps an existing hook unless --force, then chains it", () => {
  const dir = tmp();
  try {
    gitIn(dir, "init", "-q");
    const hook = path.join(dir, ".git", "hooks", "pre-commit");
    writeFileSync(hook, "#!/bin/sh\nexit 0\n", { mode: 0o755 });
    assert.equal(run("install-guards.mjs", [dir]).code, 3);
    assert.equal(readFileSync(hook, "utf8"), "#!/bin/sh\nexit 0\n");
    assert.equal(run("install-guards.mjs", [dir, "--force"]).code, 0);
    assert.ok(existsSync(path.join(dir, ".git", "hooks", "pre-commit.local")));
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("install-guards warns about already-tracked .env files", () => {
  const dir = tmp();
  try {
    gitIn(dir, "init", "-q");
    writeFileSync(path.join(dir, ".env"), "A=1\n");
    gitIn(dir, "add", ".env");
    gitIn(dir, "commit", "-q", "-m", "oops", "--no-verify");
    const res = run("install-guards.mjs", [dir]);
    assert.match(res.out, /already tracked/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

function serve(routes) {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const url = new URL(req.url, "http://x");
      const route = routes[url.pathname] ?? routes["*"];
      if (!route) {
        res.writeHead(404).end("not found");
        return;
      }
      const [status, type, body] = typeof route === "function" ? route(req) : route;
      res.writeHead(status, { "content-type": type }).end(body);
    });
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

function runAsync(script, args) {
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [guard(script), ...args]);
    let out = "";
    child.stdout.on("data", (d) => (out += d));
    child.stderr.on("data", (d) => (out += d));
    child.on("close", (code) => resolve({ code, out }));
  });
}

test("live-check finds exposed .env, secrets in the bundle and an open database table", async () => {
  const html = `<html><body><div id="app"></div><script src="/assets/app.js"></script></body></html>`;
  const server = await serve({
    "/": [200, "text/html", html],
    "/assets/app.js": [200, "text/javascript", `const sb = createClient(URL, "${KEYS.anon}"); const ai = "${KEYS.openai}";`],
    "/.env": [200, "text/plain", "OPENAI_API_KEY=abc\nDATABASE_URL=x\n"],
    "/sb/rest/v1/": [200, "application/json", JSON.stringify({ paths: { "/": {}, "/notes": {}, "/empty": {}, "/rpc/do_thing": {} } })],
    "/sb/rest/v1/notes": [200, "application/json", JSON.stringify([{ id: 1, body: "private" }])],
    "/sb/rest/v1/empty": [200, "application/json", "[]"],
    "*": [200, "text/html", html] // single-page-app fallback
  });
  try {
    const base = `http://127.0.0.1:${server.address().port}`;
    const res = await runAsync("live-check.mjs", [base + "/", "--supabase-url", base + "/sb"]);
    assert.equal(res.code, 1, res.out);
    assert.match(res.out, /Environment file is publicly downloadable: \/\.env/);
    assert.match(res.out, /Secret in code sent to every visitor/);
    assert.match(res.out, /readable by anyone with the public key: notes/);
    assert.match(res.out, /no rows: empty/);
    assert.doesNotMatch(res.out, /\.git\/config/, "SPA fallback must not be reported as an exposed file");
  } finally {
    server.close();
  }
});

test("live-check passes a clean static site", async () => {
  const server = await serve({
    "/": [200, "text/html", `<html><script src="/main.js"></script></html>`],
    "/main.js": [200, "text/javascript", "console.log('hi')"]
  });
  try {
    const res = await runAsync("live-check.mjs", [`http://127.0.0.1:${server.address().port}/`]);
    assert.equal(res.code, 0, res.out);
    assert.match(res.out, /0 fail/);
  } finally {
    server.close();
  }
});

test("live-check flags debug pages and unauthenticated admin APIs", async () => {
  const server = await serve({
    "/": [200, "text/html", "<html>home</html>"],
    "/api/users": [200, "application/json", JSON.stringify([{ name: "A", phone: "13800000000" }])],
    "*": [500, "text/html", "Traceback (most recent call last):\n  File \"app.py\", line 3"]
  });
  try {
    const res = await runAsync("live-check.mjs", [`http://127.0.0.1:${server.address().port}/`]);
    assert.equal(res.code, 1, res.out);
    assert.match(res.out, /Python error trace/);
    assert.match(res.out, /\/api\/users opens without asking anyone to sign in/);
  } finally {
    server.close();
  }
});
