// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

// Fails unless the SARIF report shows 1 complete CodeQL run whose every result
// is a reviewed exception. An exception names the rule, the file and the exact
// message, and it fails once its recheck date has passed or CodeQL stops
// reporting it.
// Usage: node scripts/verify-codeql.mjs <report.sarif> <exceptions.json> [today]

import { readFile } from "node:fs/promises";

const EXTRACTED_FILES = "js/diagnostics/successfully-extracted-files";
const HARMLESS_LEVELS = new Set(["none", "note"]);
const EXCEPTION_FIELDS = ["rule", "file", "message", "reason", "recheck"];

const [reportPath, exceptionsPath, today = new Date().toISOString().slice(0, 10)] =
  process.argv.slice(2);

function list(value, name) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error(`CodeQL report lacks ${name}.`);
  }
  return value;
}

function fileOf(result) {
  return result.locations?.[0]?.physicalLocation?.artifactLocation?.uri ?? "unknown file";
}

function describe(result) {
  const line = result.locations?.[0]?.physicalLocation?.region?.startLine ?? 0;
  return `${result.ruleId} ${fileOf(result)}:${line} ${result.message?.text ?? ""}`.trim();
}

function matches(exception, result) {
  return (
    exception.rule === result.ruleId &&
    exception.file === fileOf(result) &&
    exception.message === result.message?.text
  );
}

const exceptions = JSON.parse(await readFile(exceptionsPath, "utf8"));
if (!Array.isArray(exceptions)) throw new Error("codeql-exceptions.json must hold a list.");
for (const exception of exceptions) {
  for (const field of EXCEPTION_FIELDS) {
    if (typeof exception?.[field] !== "string" || exception[field] === "") {
      throw new Error(`Each entry in codeql-exceptions.json needs a ${field}.`);
    }
  }
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(exception.recheck)) {
    throw new Error(`Write the recheck date of ${exception.rule} as YYYY-MM-DD.`);
  }
  if (exception.recheck < today) {
    throw new Error(
      `The review of ${exception.rule} in ${exception.file} was due on ${exception.recheck}. ` +
        "Review it again, then set a new recheck date in codeql-exceptions.json.",
    );
  }
}

const report = JSON.parse(await readFile(reportPath, "utf8"));
const runs = list(report.runs, "runs");
if (report.version !== "2.1.0" || runs.length !== 1) {
  throw new Error("Expected 1 SARIF 2.1.0 run.");
}
const [run] = runs;
if (!Array.isArray(run.results)) throw new Error("CodeQL report lacks results.");
const unreviewed = run.results.filter(
  (result) => !exceptions.some((exception) => matches(exception, result)),
);
if (unreviewed.length > 0) {
  for (const result of unreviewed) console.error(describe(result));
  throw new Error(`CodeQL found ${unreviewed.length} unreviewed result(s). Fix each one.`);
}
const unused = exceptions.find(
  (exception) => !run.results.some((result) => matches(exception, result)),
);
if (unused !== undefined) {
  throw new Error(
    `CodeQL no longer reports ${unused.rule} in ${unused.file}. Remove it from codeql-exceptions.json.`,
  );
}
let extracted = 0;
for (const invocation of list(run.invocations, "invocations")) {
  if (invocation.executionSuccessful !== true) throw new Error("CodeQL invocation failed.");
  for (const notification of list(invocation.toolExecutionNotifications, "diagnostics")) {
    if (!HARMLESS_LEVELS.has(notification.level)) {
      throw new Error(`CodeQL diagnostic needs review. ${notification.message?.text ?? ""}`.trim());
    }
    if (notification.descriptor?.id === EXTRACTED_FILES) extracted += 1;
  }
}
if (extracted === 0) throw new Error("CodeQL did not confirm extracted JavaScript files.");
console.log(
  `CodeQL finished with no unreviewed results. Reviewed exceptions ${exceptions.length}. ` +
    `Extracted JavaScript entries ${extracted}.`,
);
