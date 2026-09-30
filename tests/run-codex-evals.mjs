#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(here, "..");
const evalCsv = path.join(here, "evals.csv");

function parseCsv(text) {
  const rows = [];
  let field = "";
  let row = [];
  let quoted = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    const next = text[i + 1];
    if (ch === '"' && quoted && next === '"') {
      field += '"';
      i += 1;
    } else if (ch === '"') {
      quoted = !quoted;
    } else if (ch === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((ch === "\n" || ch === "\r") && !quoted) {
      if (ch === "\r" && next === "\n") i += 1;
      row.push(field);
      field = "";
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
    } else {
      field += ch;
    }
  }

  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }

  const [header, ...body] = rows;
  return body.map((values) =>
    Object.fromEntries(header.map((key, index) => [key, values[index] ?? ""]))
  );
}

function copySkill(targetDir) {
  mkdirSync(targetDir, { recursive: true });
  cpSync(path.join(repoRoot, "SKILL.md"), path.join(targetDir, "SKILL.md"));
  for (const dir of ["references", "workflows", "checklists", "templates"]) {
    cpSync(path.join(repoRoot, dir), path.join(targetDir, dir), { recursive: true });
  }
}

function parseJsonl(text) {
  const events = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      events.push(JSON.parse(line));
    } catch {
      // Keep the run useful if a future CLI adds a non-JSON diagnostic line.
    }
  }
  return events;
}

function detectSkillRead(events) {
  const haystack = JSON.stringify(events);
  const evidence = [
    ".codex/skills/vibe-coding-zero-to-ship",
    "vibe-coding-zero-to-ship/SKILL.md",
    "Vibe Coding: Zero to Ship",
    "references/beginner-mode.md",
    "references/data-basics.md",
    "workflows/idea-to-mvp.md"
  ].filter((needle) => haystack.includes(needle));
  return { triggered: evidence.length > 0, evidence };
}

function runCase(testCase, root, codexHome) {
  const caseDir = path.join(root, "case-" + testCase.id);
  const skillDir = path.join(caseDir, ".codex", "skills", "vibe-coding-zero-to-ship");
  const artifactDir = path.join(root, "artifacts");
  const tracePath = path.join(artifactDir, testCase.id + ".jsonl");
  const stderrPath = path.join(artifactDir, testCase.id + ".stderr.txt");

  mkdirSync(caseDir, { recursive: true });
  mkdirSync(artifactDir, { recursive: true });
  copySkill(skillDir);
  writeFileSync(path.join(caseDir, "README.md"), "# Isolated skill evaluation scratch project\n", "utf8");

  const args = [
    "-c", 'sandbox_mode="read-only"',
    "-c", "web_search=false",
    "exec", "--json", testCase.prompt
  ];

  const res = spawnSync("codex", args, {
    cwd: caseDir,
    env: { ...process.env, CODEX_HOME: codexHome },
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024
  });

  writeFileSync(tracePath, res.stdout ?? "", "utf8");
  writeFileSync(stderrPath, res.stderr ?? "", "utf8");

  const events = parseJsonl(res.stdout ?? "");
  const detection = detectSkillRead(events);
  const expected = testCase.should_trigger === "true";

  return {
    id: testCase.id,
    prompt: testCase.prompt,
    expected,
    detected: detection.triggered,
    pass: detection.triggered === expected,
    evidence: detection.evidence,
    exitCode: res.status ?? 1,
    tracePath,
    stderrPath
  };
}

function main() {
  if (!existsSync(evalCsv)) throw new Error("Missing " + evalCsv);

  const codexProbe = spawnSync("codex", ["--version"], { encoding: "utf8" });
  if (codexProbe.status !== 0) {
    throw new Error("Codex CLI was not found on PATH. Install/update Codex before running this eval.");
  }

  const cases = parseCsv(readFileSync(evalCsv, "utf8"));
  const selectedIds = new Set(process.argv.slice(2));
  const selected = selectedIds.size
    ? cases.filter((testCase) => selectedIds.has(testCase.id))
    : cases;

  const root = mkdtempSync(path.join(tmpdir(), "vibe-zero-to-ship-eval-"));
  const codexHome = path.join(root, "codex-home");
  mkdirSync(codexHome, { recursive: true });

  console.log("Codex: " + codexProbe.stdout.trim());
  console.log("Isolated root: " + root);
  console.log("Active projects and ~/.codex are not modified.");
  console.log("CODEX_HOME is temporary. Authentication must be available through a supported non-file mechanism, such as an existing keychain session or CODEX_ACCESS_TOKEN.");

  const results = [];

  try {
    for (const testCase of selected) {
      const result = runCase(testCase, root, codexHome);
      results.push(result);
      console.log(
        (result.pass ? "PASS" : "FAIL") +
          " " + result.id +
          " expected=" + result.expected +
          " detected=" + result.detected +
          " exit=" + result.exitCode
      );
    }

    const summary = {
      codexVersion: codexProbe.stdout.trim(),
      total: results.length,
      passed: results.filter((r) => r.pass).length,
      failed: results.filter((r) => !r.pass).length,
      results: results.map((r) => ({
        id: r.id,
        expected: r.expected,
        detected: r.detected,
        pass: r.pass,
        exitCode: r.exitCode,
        evidence: r.evidence
      }))
    };

    const summaryPath = path.join(root, "summary.json");
    writeFileSync(summaryPath, JSON.stringify(summary, null, 2), "utf8");
    console.log("Summary: " + summaryPath);

    if (results.some((r) => r.exitCode !== 0)) {
      console.log("One or more Codex runs exited non-zero. Inspect per-case stderr; authentication or project trust may need attention.");
    }

    process.exitCode = summary.failed > 0 ? 1 : 0;
  } finally {
    if (process.env.KEEP_EVAL_ARTIFACTS !== "1") {
      process.on("exit", () => {
        try {
          rmSync(root, { recursive: true, force: true });
        } catch {}
      });
    } else {
      console.log("KEEP_EVAL_ARTIFACTS=1: preserving " + root);
    }
  }
}

main();
