#!/usr/bin/env node

import { readFileSync } from "node:fs";

const file = process.argv[2];

if (!file) {
  console.error("Usage: node tests/score-quality-routing.mjs <results.csv>");
  console.error("Expected columns: id,should_trigger,detected,risk");
  process.exit(2);
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
      if (row.some((v) => v.length > 0)) rows.push(row);
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

function bool(value) {
  if (value === "true") return true;
  if (value === "false") return false;
  throw new Error("Expected true/false, got: " + value);
}

const rows = parseCsv(readFileSync(file, "utf8"));
const header = rows[0];
const body = rows.slice(1);

const idx = Object.fromEntries(header.map((name, i) => [name, i]));

for (const required of ["id", "should_trigger", "detected", "risk"]) {
  if (!(required in idx)) {
    throw new Error("Missing required column: " + required);
  }
}

let tp = 0, tn = 0, fp = 0, fn = 0;
let highRiskTotal = 0, highRiskCaught = 0;

for (const row of body) {
  const expected = bool(row[idx.should_trigger]);
  const detected = bool(row[idx.detected]);
  const risk = row[idx.risk];

  if (expected && detected) tp += 1;
  else if (expected && !detected) fn += 1;
  else if (!expected && detected) fp += 1;
  else tn += 1;

  if (expected && (risk === "P2" || risk === "P3")) {
    highRiskTotal += 1;
    if (detected) highRiskCaught += 1;
  }
}

const recall = tp + fn ? tp / (tp + fn) : 0;
const precision = tp + fp ? tp / (tp + fp) : 0;
const fpr = fp + tn ? fp / (fp + tn) : 0;
const highRisk = highRiskTotal ? highRiskCaught / highRiskTotal : 0;

const percent = (x) => (x * 100).toFixed(1) + "%";

console.log("Cases:", body.length);
console.log("TP:", tp, "FN:", fn, "TN:", tn, "FP:", fp);
console.log("Trigger recall:", percent(recall));
console.log("Trigger precision:", percent(precision));
console.log("False-positive rate:", percent(fpr));
console.log("High-risk catch rate:", percent(highRisk));

const gates = {
  recall: recall >= 0.90,
  precision: precision >= 0.85,
  falsePositiveRate: fpr <= 0.10,
  highRiskCatch: highRisk === 1
};

console.log("");
console.log("Gates:");
for (const [name, pass] of Object.entries(gates)) {
  console.log((pass ? "PASS" : "FAIL") + " " + name);
}

if (Object.values(gates).some((pass) => !pass)) process.exit(1);
