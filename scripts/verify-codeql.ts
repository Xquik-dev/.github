// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

// Fails unless the SARIF report shows 1 complete CodeQL run whose every result
// is a reviewed exception. An exception names the rule, the file and the exact
// message, and it fails once its recheck date has passed or CodeQL stops
// reporting it.
// Usage: node scripts/verify-codeql.ts <report.sarif> <exceptions.json> [today]

import { readFile } from "node:fs/promises";
import { z } from "zod";

const EXTRACTED_FILES = "js/diagnostics/successfully-extracted-files";
const HARMLESS_LEVELS: ReadonlySet<string | undefined> = new Set(["none", "note"]);

const needs = (field: string) => ({ error: `Each entry in codeql-exceptions.json needs a ${field}.` });
const text = (field: string) => z.string(needs(field)).min(1, needs(field));
const Exceptions = z.array(
  z.looseObject(
    { rule: text("rule"), file: text("file"), message: text("message"), reason: text("reason"), recheck: text("recheck") },
    needs("rule"),
  ),
  { error: "codeql-exceptions.json must hold a list." },
);
type Exception = z.infer<typeof Exceptions>[number];

const lacks = (name: string) => ({ error: `CodeQL report lacks ${name}.` });
const Result = z.looseObject({
  ruleId: z.string().optional(),
  message: z.looseObject({ text: z.string().optional() }).optional(),
  locations: z
    .array(
      z.looseObject({
        physicalLocation: z
          .looseObject({
            artifactLocation: z.looseObject({ uri: z.string().optional() }).optional(),
            region: z.looseObject({ startLine: z.number().optional() }).optional(),
          })
          .optional(),
      }),
    )
    .optional(),
});
type Result = z.infer<typeof Result>;
const Notification = z.looseObject({
  level: z.string().optional(),
  message: z.looseObject({ text: z.string().optional() }).optional(),
  descriptor: z.looseObject({ id: z.string().optional() }).optional(),
});
const Invocation = z.looseObject({
  executionSuccessful: z.unknown(),
  toolExecutionNotifications: z.array(Notification, lacks("diagnostics")).min(1, lacks("diagnostics")),
});
const Run = z.looseObject({
  results: z.array(Result, lacks("results")),
  invocations: z.array(Invocation, lacks("invocations")).min(1, lacks("invocations")),
});
const Report = z.looseObject({ runs: z.array(Run, lacks("runs")).min(1, lacks("runs")), version: z.unknown() });

const [reportPath, exceptionsPath, today = new Date().toISOString().slice(0, 10)] = z
  .tuple([z.string(), z.string()], z.string())
  .parse(process.argv.slice(2));

// A malformed document fails with the message of its first problem, in the
// order of the fields above.
function valid<T>(parsed: z.ZodSafeParseResult<T>): T {
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message);
  return parsed.data;
}

function fileOf(result: Result) {
  return result.locations?.[0]?.physicalLocation?.artifactLocation?.uri ?? "unknown file";
}

function describe(result: Result) {
  const line = result.locations?.[0]?.physicalLocation?.region?.startLine ?? 0;
  return `${result.ruleId} ${fileOf(result)}:${line} ${result.message?.text ?? ""}`.trim();
}

function matches(exception: Exception, result: Result) {
  return (
    exception.rule === result.ruleId &&
    exception.file === fileOf(result) &&
    exception.message === result.message?.text
  );
}

const exceptions = valid(Exceptions.safeParse(JSON.parse(await readFile(exceptionsPath, "utf8"))));
for (const exception of exceptions) {
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

const report = valid(Report.safeParse(JSON.parse(await readFile(reportPath, "utf8"))));
const [run, ...otherRuns] = report.runs;
if (report.version !== "2.1.0" || run === undefined || otherRuns.length > 0) {
  throw new Error("Expected 1 SARIF 2.1.0 run.");
}
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
for (const invocation of run.invocations) {
  if (invocation.executionSuccessful !== true) throw new Error("CodeQL invocation failed.");
  for (const notification of invocation.toolExecutionNotifications) {
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
