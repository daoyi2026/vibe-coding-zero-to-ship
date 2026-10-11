#!/usr/bin/env node
// vibe-coding-zero-to-ship guard installer.
// Adds safe .gitignore entries and a Git pre-commit hook that blocks commits
// containing secrets. Zero dependencies. Safe to re-run.
//
// Usage: node install-guards.mjs [project-dir] [--init] [--force]
//   --init   run `git init` first if the folder is not a Git repository yet
//   --force  replace an existing pre-commit hook that was not installed by this tool
//            (the old hook is kept as pre-commit.backup-<timestamp>)

import { execFileSync } from "node:child_process";
import { chmodSync, copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const MARK = "vibe-coding-zero-to-ship guard";

const GITIGNORE_BLOCK = [
  `# --- added by ${MARK} ---`,
  "# secrets",
  ".env",
  ".env.*",
  "!.env.example",
  "*.pem",
  "*.key",
  "*.p12",
  "# local data and logs (may contain real people's information)",
  "*.sqlite",
  "*.sqlite3",
  "*.db",
  "*.log",
  "# dependencies and system files",
  "node_modules/",
  ".DS_Store",
  `# --- end ${MARK} ---`
];

const HOOK = `#!/bin/sh
# ${MARK}: blocks commits that contain secrets.
# Installed by install-guards.mjs. To accept a false positive, add "vibe-guard: allow" on that line.
HOOK_DIR="$(cd "$(dirname "$0")" && pwd)"
if ! command -v node >/dev/null 2>&1; then
  echo "WARNING: Node.js not found, so the secret check was skipped for this commit." >&2
  exit 0
fi
node "$HOOK_DIR/vibe-secret-scan.mjs" "$(git rev-parse --show-toplevel)" --staged
status=$?
if [ "$status" -eq 1 ]; then
  echo "" >&2
  echo "Commit blocked by the secret guard. Fix the items above, then commit again." >&2
  exit 1
fi
if [ "$status" -ne 0 ]; then
  echo "WARNING: the secret check could not run (exit $status). Commit allowed." >&2
fi
LOCAL_HOOK="$HOOK_DIR/pre-commit.local"
if [ -x "$LOCAL_HOOK" ]; then
  exec "$LOCAL_HOOK" "$@"
fi
exit 0
`;

function git(dir, args) {
  return execFileSync("git", ["-C", dir, ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();
}

function main(argv) {
  const flags = new Set(argv.filter((a) => a.startsWith("--")));
  const dir = path.resolve(argv.find((a) => !a.startsWith("--")) || ".");
  if (flags.has("--help")) {
    console.log("Usage: node install-guards.mjs [project-dir] [--init] [--force]");
    return 0;
  }
  if (!existsSync(dir)) {
    console.error("Folder not found: " + dir);
    return 2;
  }

  let isRepo = true;
  try {
    git(dir, ["rev-parse", "--is-inside-work-tree"]);
  } catch {
    isRepo = false;
  }
  if (!isRepo) {
    if (!flags.has("--init")) {
      console.error("This folder is not a Git repository yet. Re-run with --init to create one.");
      return 2;
    }
    git(dir, ["init"]);
    console.log("✔ Created a Git repository (version history).");
  }
  const top = git(dir, ["rev-parse", "--show-toplevel"]);

  // 1. .gitignore
  const ignorePath = path.join(top, ".gitignore");
  const existing = existsSync(ignorePath) ? readFileSync(ignorePath, "utf8") : "";
  if (existing.includes(`added by ${MARK}`)) {
    console.log("✔ .gitignore already has the safe defaults.");
  } else {
    const prefix = existing && !existing.endsWith("\n") ? "\n" : "";
    writeFileSync(ignorePath, existing + prefix + (existing ? "\n" : "") + GITIGNORE_BLOCK.join("\n") + "\n");
    console.log("✔ Added safe defaults to .gitignore (.env, key files, local databases, logs).");
  }

  // 2. Files that are already tracked but should not be.
  const tracked = git(top, ["ls-files"]).split("\n").filter(Boolean);
  const leaked = tracked.filter(
    (f) => /(^|\/)\.env(\.[^/]*)?$/.test(f) && !/\.env\.(example|sample|template)$/.test(f) || /\.(pem|key|p12)$/.test(f)
  );
  if (leaked.length) {
    console.log("");
    console.log("⚠ These secret files are already tracked by Git:");
    for (const f of leaked) console.log("   - " + f);
    console.log("  Stop tracking them with: git rm --cached <file>");
    console.log("  If they were ever pushed or shared, rotate the secrets inside them.");
  }

  // 3. Pre-commit hook (respects core.hooksPath).
  const hooksDir = path.resolve(top, git(top, ["rev-parse", "--git-path", "hooks"]));
  mkdirSync(hooksDir, { recursive: true });
  const hookPath = path.join(hooksDir, "pre-commit");
  if (existsSync(hookPath) && !readFileSync(hookPath, "utf8").includes(MARK)) {
    if (!flags.has("--force")) {
      console.error("");
      console.error("A different pre-commit hook already exists at " + hookPath + ". Nothing was replaced.");
      console.error("Re-run with --force to install the guard; the existing hook is kept as pre-commit.local and still runs.");
      return 3;
    }
    const localPath = path.join(hooksDir, "pre-commit.local");
    const target = existsSync(localPath) ? path.join(hooksDir, `pre-commit.backup-${Date.now()}`) : localPath;
    renameSync(hookPath, target);
    console.log("✔ Kept your existing hook as " + path.basename(target) + ".");
  }
  copyFileSync(path.join(here, "secret-scan.mjs"), path.join(hooksDir, "vibe-secret-scan.mjs"));
  writeFileSync(hookPath, HOOK);
  chmodSync(hookPath, 0o755);
  console.log("✔ Installed a pre-commit check: commits containing API keys, passwords or key files are blocked.");
  console.log("");
  console.log("Note: Git hooks live only on this computer. They are not copied by `git clone`,");
  console.log("so re-run this script on any other computer that works on the project.");
  return 0;
}

try {
  process.exitCode = main(process.argv.slice(2));
} catch (error) {
  console.error("install-guards failed: " + (error.stderr ? String(error.stderr).trim() : error.message));
  process.exitCode = 2;
}
