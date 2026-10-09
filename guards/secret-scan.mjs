#!/usr/bin/env node
// vibe-coding-zero-to-ship guard: secret scanner.
// Zero dependencies. Self-contained on purpose: install-guards.mjs copies this
// single file into a project's Git hooks folder.
//
// Usage:
//   node secret-scan.mjs [dir]             scan files Git would commit (or all files if not a Git repo)
//   node secret-scan.mjs [dir] --staged    scan only staged changes (used by the pre-commit hook)
//   node secret-scan.mjs [dir] --history   also scan every past commit
//
// Exit codes: 0 = no blocking findings, 1 = blocking findings, 2 = usage/runtime error.
// To accept a known false positive, put "vibe-guard: allow" on the same line.

import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const MAX_FILE_BYTES = 1024 * 1024;
const ALLOW_MARK = "vibe-guard: allow";

// [id, label, regex, severity]. severity "block" fails the scan; "note" only informs.
const PATTERNS = [
  ["private-key", "Private key block", /-----BEGIN (?:RSA |EC |DSA |OPENSSH |PGP |ENCRYPTED )?PRIVATE KEY-----/g, "block"],
  ["anthropic", "Anthropic API key", /\bsk-ant-[A-Za-z0-9_-]{20,}/g, "block"],
  ["openai", "OpenAI-style API key (sk-...)", /\bsk-(?:proj-|svcacct-|admin-)?[A-Za-z0-9_-]{20,}/g, "block"],
  ["github", "GitHub token", /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b|\bgithub_pat_[A-Za-z0-9_]{40,}\b/g, "block"],
  ["aws", "AWS access key ID", /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g, "block"],
  ["google", "Google API key", /\bAIza[0-9A-Za-z_-]{35}\b/g, "block"],
  ["stripe-live", "Stripe live secret key", /\b(?:sk|rk)_live_[0-9A-Za-z]{20,}\b/g, "block"],
  ["stripe-test", "Stripe test secret key", /\bsk_test_[0-9A-Za-z]{20,}\b/g, "block"],
  ["slack", "Slack token", /\bxox[abprs]-[0-9A-Za-z-]{10,}\b/g, "block"],
  ["aliyun", "Alibaba Cloud AccessKey ID", /\bLTAI[0-9A-Za-z]{12,24}\b/g, "block"],
  ["tencent", "Tencent Cloud SecretId", /\bAKID[0-9A-Za-z]{32}\b/g, "block"],
  ["db-url", "Database URL with a password", /\b(?:postgres(?:ql)?|mysql|mariadb|mongodb(?:\+srv)?|redis|amqp):\/\/[^\s:@/'"]+:[^\s@/'"]{3,}@[^\s'"]+/g, "block"],
  ["assignment", "Hard-coded secret-looking value", /\b[A-Za-z0-9_]*(?:api[_-]?key|secret|password|passwd|access[_-]?token|auth[_-]?token|private[_-]?key)[A-Za-z0-9_]*\s*[:=]\s*["'`]([^"'`\s]{12,})["'`]/gi, "block"]
];

const JWT = /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g;

const PLACEHOLDER = /(your[_-]?|example|placeholder|changeme|change[_-]me|dummy|sample|xxxx|\*\*\*\*|<[^>]*>|\$\{|process\.env|import\.meta\.env|os\.environ|getenv|REPLACE|TODO|fake|test[_-]?(?:key|secret|token|password))/i;

const RISKY_FILENAMES = [
  [/(^|\/)\.env(\.[^/]*)?$/, (name) => !/\.env\.(example|sample|template|dist)$/i.test(name), ".env file (environment secrets)"],
  [/\.(pem|key|p12|pfx|keystore|jks)$/i, () => true, "Private key or certificate file"],
  [/(^|\/)id_(rsa|dsa|ecdsa|ed25519)$/, () => true, "SSH private key"],
  [/(^|\/)(credentials|service[-_]?account[^/]*)\.json$/i, () => true, "Cloud credentials file"]
];

function decodeJwtPayload(token) {
  try {
    const part = token.split(".")[1];
    return JSON.parse(Buffer.from(part.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8"));
  } catch {
    return null;
  }
}

function mask(value) {
  if (value.length <= 10) return value.slice(0, 2) + "…";
  return value.slice(0, 6) + "…" + value.slice(-2);
}

/** Scan a text blob. Returns findings: {id,label,severity,line,preview}. */
export function scanText(text, { source = "" } = {}) {
  const findings = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (line.includes(ALLOW_MARK)) return;
    for (const [id, label, regex, severity] of PATTERNS) {
      regex.lastIndex = 0;
      let match;
      while ((match = regex.exec(line))) {
        const value = match[1] || match[0];
        if (PLACEHOLDER.test(value)) continue;
        if (id === "assignment" && /^[a-z]+(\.[a-z]+)+$/i.test(value)) continue; // dotted identifiers
        findings.push({ id, label, severity, line: index + 1, preview: mask(match[0]), source });
      }
    }
    JWT.lastIndex = 0;
    let jwt;
    while ((jwt = JWT.exec(line))) {
      const payload = decodeJwtPayload(jwt[0]);
      const role = payload && payload.role;
      if (role === "service_role" || role === "supabase_admin") {
        findings.push({ id: "service-jwt", label: "Service-role key (full database access)", severity: "block", line: index + 1, preview: mask(jwt[0]), source });
      } else if (role === "anon" || role === "authenticated") {
        findings.push({ id: "public-jwt", label: "Public (anon) database key - safe only if access rules work", severity: "note", line: index + 1, preview: mask(jwt[0]), source });
      } else {
        findings.push({ id: "jwt", label: "JWT token - check it is not a long-lived credential", severity: "note", line: index + 1, preview: mask(jwt[0]), source });
      }
    }
  });
  return findings;
}

export function scanFileName(relPath) {
  const name = relPath.split(path.sep).join("/");
  for (const [regex, extra, label] of RISKY_FILENAMES) {
    if (regex.test(name) && extra(name)) return { id: "risky-file", label, severity: "block", line: 0, preview: "", source: name };
  }
  return null;
}

function git(dir, args, opts = {}) {
  return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", maxBuffer: 256 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"], ...opts });
}

function isGitRepo(dir) {
  try {
    return git(dir, ["rev-parse", "--is-inside-work-tree"]).trim() === "true";
  } catch {
    return false;
  }
}

function looksBinary(buf) {
  return buf.subarray(0, 8000).includes(0);
}

function walk(dir, base = dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) walk(full, base, out);
    else out.push(path.relative(base, full));
  }
  return out;
}

function scanWorkingFiles(dir, gitMode) {
  const files = gitMode
    ? git(dir, ["ls-files", "-co", "--exclude-standard", "-z"]).split("\0").filter(Boolean)
    : walk(dir);
  const findings = [];
  for (const rel of files) {
    const nameFinding = scanFileName(rel);
    if (nameFinding) findings.push(nameFinding);
    const full = path.join(dir, rel);
    if (!existsSync(full)) continue;
    const st = statSync(full);
    if (!st.isFile() || st.size > MAX_FILE_BYTES) continue;
    const buf = readFileSync(full);
    if (looksBinary(buf)) continue;
    findings.push(...scanText(buf.toString("utf8"), { source: rel }));
  }
  return findings;
}

function scanStaged(dir) {
  const names = git(dir, ["diff", "--cached", "--name-only", "--diff-filter=ACMR", "-z"]).split("\0").filter(Boolean);
  const findings = [];
  for (const rel of names) {
    const nameFinding = scanFileName(rel);
    if (nameFinding) findings.push(nameFinding);
    let buf;
    try {
      buf = execFileSync("git", ["-C", dir, "show", ":" + rel], { maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] });
    } catch {
      continue;
    }
    if (buf.length > MAX_FILE_BYTES || looksBinary(buf)) continue;
    findings.push(...scanText(buf.toString("utf8"), { source: rel }));
  }
  return findings;
}

function scanHistory(dir) {
  let log;
  try {
    log = git(dir, ["log", "--all", "-p", "--no-color", "-U0", "--no-ext-diff", "--format=commit %h"]);
  } catch {
    return [];
  }
  const findings = [];
  let commit = "";
  let file = "";
  for (const line of log.split("\n")) {
    if (line.startsWith("commit ")) commit = line.slice(7).trim();
    else if (line.startsWith("+++ b/")) {
      file = line.slice(6);
      const nameFinding = scanFileName(file);
      if (nameFinding) findings.push({ ...nameFinding, source: `${file} (commit ${commit})` });
    } else if (line.startsWith("+") && !line.startsWith("+++")) {
      for (const f of scanText(line.slice(1))) findings.push({ ...f, line: 0, source: `${file} (commit ${commit})` });
    }
  }
  return findings;
}

function dedupe(findings) {
  const seen = new Set();
  return findings.filter((f) => {
    const key = [f.id, f.source, f.line, f.preview].join("|");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function report(findings, { title }) {
  const blocking = findings.filter((f) => f.severity === "block");
  const notes = findings.filter((f) => f.severity !== "block");
  const lines = [];
  if (blocking.length) {
    lines.push(`✖ ${title}: ${blocking.length} possible secret(s) found.`);
    for (const f of blocking) lines.push(`  - ${f.label}: ${f.source}${f.line ? ":" + f.line : ""} ${f.preview}`);
    lines.push("");
    lines.push("What to do:");
    lines.push("  1. Move the value into an environment variable or the host's secret settings.");
    lines.push("  2. Make sure .env and key files are in .gitignore (and run `git rm --cached <file>` if already tracked).");
    lines.push("  3. If it was ever committed or shared, rotate it at the provider. Deleting it is not enough.");
    lines.push(`  4. Only if it is truly not a secret, add "${ALLOW_MARK}" on that line.`);
  } else {
    lines.push(`✔ ${title}: no secrets found.`);
  }
  if (notes.length) {
    lines.push("");
    lines.push("Notes (not blocking):");
    for (const f of notes) lines.push(`  - ${f.label}: ${f.source}${f.line ? ":" + f.line : ""}`);
  }
  return lines.join("\n");
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const positional = argv.filter((a) => !a.startsWith("--"));
  if (flags.has("--help")) {
    console.log("Usage: node secret-scan.mjs [dir] [--staged] [--history]");
    return 0;
  }
  const dir = path.resolve(positional[0] || ".");
  if (!existsSync(dir)) {
    console.error("Directory not found: " + dir);
    return 2;
  }
  const gitMode = isGitRepo(dir);
  let findings;
  let title;
  if (flags.has("--staged")) {
    if (!gitMode) {
      console.error("--staged needs a Git repository.");
      return 2;
    }
    findings = scanStaged(dir);
    title = "Staged changes";
  } else {
    findings = scanWorkingFiles(dir, gitMode);
    title = gitMode ? "Files Git would commit" : "Project files";
    if (flags.has("--history")) {
      if (gitMode) {
        findings.push(...scanHistory(dir));
        title += " + Git history";
      } else {
        console.error("Note: not a Git repository, so there is no history to scan.");
      }
    }
  }
  findings = dedupe(findings);
  console.log(report(findings, { title }));
  return findings.some((f) => f.severity === "block") ? 1 : 0;
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  try {
    process.exitCode = main(process.argv.slice(2));
  } catch (error) {
    console.error("secret-scan failed: " + error.message);
    process.exitCode = 2;
  }
}
