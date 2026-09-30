#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");
const errors = [];
const warnings = [];

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

function rel(full) {
  return path.relative(root, full).split(path.sep).join("/");
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return fields;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
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
  return rows;
}

const files = walk(root);
const skillFiles = files.filter((file) => path.basename(file).toLowerCase() === "skill.md");

if (skillFiles.length !== 1) {
  fail("Expected exactly one SKILL.md/skill.md; found " + skillFiles.length);
}

const skillPath = path.join(root, "SKILL.md");
if (!existsSync(skillPath)) {
  fail("Root SKILL.md is missing.");
} else {
  const text = readFileSync(skillPath, "utf8");
  const frontmatter = parseFrontmatter(text);

  if (!frontmatter) {
    fail("SKILL.md must start with YAML frontmatter.");
  } else {
    if (!frontmatter.name) fail("SKILL.md frontmatter is missing name.");
    if (!frontmatter.description) fail("SKILL.md frontmatter is missing description.");
    if (frontmatter.name && frontmatter.name !== "vibe-coding-zero-to-ship") {
      fail("Unexpected skill name: " + frontmatter.name);
    }
    if (frontmatter.description && frontmatter.description.length > 1024) {
      fail("Skill description exceeds the 1024-character platform limit.");
    }
    if (frontmatter.description && frontmatter.description.length > 400) {
      warn("Skill description is over 400 characters; shorter metadata usually routes better.");
    }
  }

  if (Buffer.byteLength(text, "utf8") > 256 * 1024) {
    fail("SKILL.md exceeds 256 KiB.");
  }

  const matches = text.matchAll(/\x60((?:references|workflows|checklists|templates)\/[^\x60]+)\x60/g);
  const refs = new Set();
  for (const match of matches) refs.add(match[1]);
  for (const ref of refs) {
    if (!existsSync(path.join(root, ref))) fail("SKILL.md references missing file: " + ref);
  }
}

for (const file of files) {
  const relative = rel(file);
  const size = statSync(file).size;
  if (relative !== "SKILL.md" && size > 1024 * 1024) fail(relative + " exceeds 1 MiB.");
  if (size === 0) fail(relative + " is empty.");
}

if (files.length > 100) {
  warn("Repository has more than 100 files; some plugin import paths have tighter limits.");
}

const evalPath = path.join(root, "tests", "evals.csv");
if (!existsSync(evalPath)) {
  fail("tests/evals.csv is missing.");
} else {
  const rows = parseCsv(readFileSync(evalPath, "utf8"));
  if (rows.length < 2) {
    fail("tests/evals.csv has no test rows.");
  } else {
    const header = rows[0];
    const triggerIndex = header.indexOf("should_trigger");
    if (triggerIndex < 0) {
      fail("evals.csv is missing should_trigger column.");
    } else {
      const body = rows.slice(1);
      const positives = body.filter((row) => row[triggerIndex] === "true").length;
      const negatives = body.filter((row) => row[triggerIndex] === "false").length;
      if (!positives) fail("evals.csv needs at least one positive trigger case.");
      if (!negatives) fail("evals.csv needs at least one negative control.");
      if (body.length < 10 || body.length > 30) {
        warn("Current eval set has " + body.length + " cases; 10-20 is a useful early target.");
      }
      console.log("Eval cases:", body.length, "positive:", positives, "negative:", negatives);
    }
  }
}

const secretPatterns = [
  ["OpenAI-style key", /\bsk-[A-Za-z0-9_-]{20,}\b/g],
  ["GitHub classic token", /\bghp_[A-Za-z0-9]{20,}\b/g],
  ["GitHub fine-grained token", /\bgithub_pat_[A-Za-z0-9_]{20,}\b/g],
  ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/g]
];

for (const file of files) {
  const relative = rel(file);
  if (!/\.(md|txt|csv|json|yaml|yml|js|mjs|ts|toml)$/i.test(relative)) continue;
  const text = readFileSync(file, "utf8");
  for (const entry of secretPatterns) {
    const label = entry[0];
    const pattern = entry[1];
    pattern.lastIndex = 0;
    if (pattern.test(text)) fail("Possible " + label + " found in " + relative);
  }
}

for (const warning of warnings) console.warn("WARN:", warning);
for (const error of errors) console.error("ERROR:", error);

console.log("Files checked:", files.length);

if (errors.length > 0) {
  console.error("Validation failed with " + errors.length + " error(s).");
  process.exit(1);
}

console.log("Validation passed.");
