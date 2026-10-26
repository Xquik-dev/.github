// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { test } from "node:test";
import { z } from "zod";
import { root, runTool, workspace, writeProbes } from "./helpers.ts";

// Each probe breaks 1 checking flag of tsconfig.json, and errors lists every
// code that tsc reports for it.
const TSC_CASES: readonly {
  readonly flag: string;
  readonly file: string;
  readonly code: string;
  readonly errors: readonly string[];
}[] = [
  { flag: "strict", file: "strict.ts", code: "export const echo = (value) => value;\n", errors: ["TS7006"] },
  {
    flag: "noUncheckedIndexedAccess",
    file: "no-unchecked-indexed-access.ts",
    code: "export const first = (list: number[]): number => list[0];\n",
    errors: ["TS2322"],
  },
  {
    flag: "exactOptionalPropertyTypes",
    file: "exact-optional-property-types.ts",
    code: "export const box: { n?: number } = { n: undefined };\n",
    errors: ["TS2375"],
  },
  { flag: "noUnusedLocals", file: "no-unused-locals.ts", code: "const unused = 1;\nexport {};\n", errors: ["TS6133"] },
  {
    flag: "noUnusedParameters",
    file: "no-unused-parameters.ts",
    code: "export const one = (value: number): number => 1;\n",
    errors: ["TS6133"],
  },
  {
    flag: "noFallthroughCasesInSwitch",
    file: "no-fallthrough-cases-in-switch.ts",
    code: "export function total(n: number): number {\n  let sum = 0;\n  switch (n) {\n    case 1:\n      sum += 1;\n    case 2:\n      sum += 2;\n  }\n  return sum;\n}\n",
    errors: ["TS7029"],
  },
  {
    flag: "noImplicitReturns",
    file: "no-implicit-returns.ts",
    code: "export function positive(n: number): number | undefined {\n  if (n > 0) return n;\n}\n",
    errors: ["TS7030"],
  },
  { flag: "erasableSyntaxOnly", file: "erasable-syntax-only.ts", code: "export enum Color {\n  Red,\n}\n", errors: ["TS1294"] },
  {
    flag: "verbatimModuleSyntax",
    file: "verbatim-module-syntax.ts",
    code: 'import { IncomingHttpHeaders } from "node:http";\nexport type Headers = IncomingHttpHeaders;\n',
    errors: ["TS1484"],
  },
  { flag: "checkJs", file: "check-js.mjs", code: "export const n = 1;\nn.toUpperCase();\n", errors: ["TS2339"] },
];

// Each probe fails 1 flag of the coverage:types script and passes without it.
const COVERAGE_CASES: readonly { readonly flag: readonly string[]; readonly name: string; readonly code: string }[] = [
  { flag: ["--at-least", "100"], name: "an any value", code: 'export const v = JSON.parse("1");\n' },
  { flag: ["--strict"], name: "a cast with no any", code: "const value: unknown = 1;\nexport const n = value as number;\n" },
];

const ALLOWED = 'export const pair = [1, "a"] as const;\nexport const total: number = pair[0] + 1;\n';

const PackageJson = z.looseObject({
  scripts: z.looseObject({
    "coverage:types": z
      .string()
      .transform((script) => script.split(" "))
      .pipe(z.tuple([z.string()], z.string())),
  }),
});
const [coverage, ...coverageFlags] = PackageJson.parse(JSON.parse(readFileSync(join(root, "package.json"), "utf8")))
  .scripts["coverage:types"];

test("tsc rejects each probe with the error of its flag", async (t) => {
  const folder = workspace(t);
  writeProbes(folder, { "allowed.ts": ALLOWED, ...Object.fromEntries(TSC_CASES.map(({ file, code }) => [file, code])) });
  const tsc = runTool(folder, "tsc", ["-p", ".", "--pretty", "false"]);
  const errors = new Map<string, string[]>();
  for (const [, file = "", code = ""] of tsc.stdout.matchAll(/^([^(\s]+)\(\d+,\d+\): error (TS\d+):/gmu)) {
    errors.set(file, [...(errors.get(file) ?? []), code]);
  }
  await t.test("reports nothing in code that types every value", () => {
    assert.equal(errors.get("allowed.ts"), undefined, tsc.stdout);
  });
  for (const { flag, file, errors: expected } of TSC_CASES) {
    await t.test(`${flag} reports ${expected.join(", ")} in ${file}`, () => {
      assert.deepEqual(errors.get(file), expected);
    });
  }
});

for (const { flag, name, code } of COVERAGE_CASES) {
  test(`type-coverage ${flag.join(" ")} rejects ${name}`, (t) => {
    const folder = workspace(t);
    writeProbes(folder, { "probe.ts": code });
    assert.notEqual(runTool(folder, coverage, coverageFlags).status, 0);
    const without = runTool(
      folder,
      coverage,
      coverageFlags.filter((argument) => !flag.includes(argument)),
    );
    assert.equal(without.status, 0, without.stdout);
  });
}

test("type-coverage passes typed code with as const at 100%", (t) => {
  const folder = workspace(t);
  writeProbes(folder, { "allowed.ts": ALLOWED });
  const result = runTool(folder, coverage, coverageFlags);
  assert.equal(result.status, 0, result.stdout);
  assert.match(result.stdout, /\(\d+ \/ \d+\) 100\.00%/u);
});
