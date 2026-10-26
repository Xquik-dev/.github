// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import assert from "node:assert/strict";
import { basename, join } from "node:path";
import { test } from "node:test";
import { z } from "zod";
import { root, runTool, workspace, writeProbes } from "./helpers.ts";

const ANY_VALUE = "xquik/no-any-returning-value";
const SCHEMA_TYPE = "xquik/no-schema-type-annotation";
const BOX = 'import { z } from "zod";\ntype Box = { n: number };\n';
const BOX_SCHEMA = "z.looseObject({ n: z.number() });\n";

// Each probe breaks 1 ban. findings lists the rule of every message that ESLint
// reports for the probe, so a probe passes only because its ban fires.
const CASES: readonly {
  readonly file: string;
  readonly code: string;
  readonly findings: readonly (string | null)[];
}[] = [
  {
    file: "inline-config.ts",
    code: '/* eslint-disable */\nexport const n = JSON.parse("1") as number;\n',
    // ESLint reports the ignored directive with no rule.
    findings: [null, "@typescript-eslint/consistent-type-assertions"],
  },
  { file: "javascript.mjs", code: "export const a = 1;\n", findings: ["no-restricted-syntax"] },
  {
    file: "declaration.d.ts",
    code: "export type Box = { readonly n: number };\n",
    findings: ["no-restricted-syntax"],
  },
  {
    file: "ts-ignore.ts",
    code: "// @ts-ignore\nexport const a = 1;\n",
    findings: ["@typescript-eslint/ban-ts-comment"],
  },
  {
    file: "ts-expect-error.ts",
    code: "// @ts-expect-error\nexport const a: string = 1;\n",
    findings: ["@typescript-eslint/ban-ts-comment"],
  },
  {
    file: "ts-nocheck.ts",
    code: "// @ts-nocheck\nexport const a = 1;\n",
    findings: ["@typescript-eslint/ban-ts-comment"],
  },
  {
    file: "assertion.ts",
    code: "export const n = [1] as number[];\n",
    findings: ["@typescript-eslint/consistent-type-assertions"],
  },
  {
    file: "method-signature.ts",
    code: "export type Sink<T> = { put(v: T): void };\n",
    findings: ["@typescript-eslint/method-signature-style"],
  },
  {
    file: "explicit-any.ts",
    code: "export const x: any = 1;\n",
    findings: ["@typescript-eslint/no-explicit-any"],
  },
  {
    file: "unsafe-argument.ts",
    code: 'export const n = Math.abs(JSON.parse("1"));\n',
    findings: ["@typescript-eslint/no-unsafe-argument"],
  },
  {
    file: "unsafe-assignment.ts",
    code: 'export const n: number = JSON.parse("1");\n',
    findings: ["@typescript-eslint/no-unsafe-assignment"],
  },
  {
    file: "unsafe-call.ts",
    code: 'JSON.parse("1")();\n',
    findings: ["@typescript-eslint/no-unsafe-call"],
  },
  {
    file: "unsafe-declaration-merging.ts",
    code: "export class Box {}\nexport interface Box {\n  readonly n: number;\n}\n",
    // The rule reports the class and the interface.
    findings: [
      "@typescript-eslint/no-unsafe-declaration-merging",
      "@typescript-eslint/no-unsafe-declaration-merging",
    ],
  },
  {
    file: "unsafe-member-access.ts",
    code: 'export const n: unknown = JSON.parse("{}").n;\n',
    findings: ["@typescript-eslint/no-unsafe-member-access"],
  },
  {
    file: "unsafe-return.ts",
    code: 'export function read() {\n  return JSON.parse("1");\n}\n',
    findings: ["@typescript-eslint/no-unsafe-return"],
  },
  {
    file: "catch-callback.ts",
    code: 'export const m = Promise.reject(new Error("x")).catch((e: Error) => e.message);\n',
    findings: ["@typescript-eslint/use-unknown-in-catch-callback-variable"],
  },
  { file: "eval.ts", code: 'eval("1");\n', findings: ["no-eval"] },
  {
    file: "overload.ts",
    code: "export function f(a: string): string;\nexport function f(a: unknown): unknown {\n  return a;\n}\n",
    findings: ["no-restricted-syntax"],
  },
  {
    file: "method-overload.ts",
    code: "export class C {\n  m(a: string): string;\n  m(a: unknown): unknown {\n    return a;\n  }\n}\n",
    findings: ["no-restricted-syntax"],
  },
  {
    file: "definite.ts",
    code: "let v!: number;\nv = 1;\nexport { v };\n",
    findings: ["no-restricted-syntax"],
  },
  {
    file: "declare.ts",
    code: "declare const x: number;\nexport { x };\n",
    findings: ["no-restricted-syntax"],
  },
  {
    file: "type-coverage-ignore.ts",
    code: "// type-coverage:ignore-next-line\nexport const a = 1;\n",
    findings: ["no-warning-comments"],
  },
  {
    file: "oxlint-disable.ts",
    code: "/* oxlint-disable */\nexport const a = 1;\n",
    findings: ["no-warning-comments"],
  },
  {
    file: "oxlint-enable.ts",
    code: "/* oxlint-enable */\nexport const a = 1;\n",
    findings: ["no-warning-comments"],
  },
  {
    file: "destructured-assign.ts",
    code: "const { assign } = Object;\nexport const a = assign;\n",
    findings: [ANY_VALUE],
  },
  { file: "computed-assign.ts", code: 'export const a = Object["assign"];\n', findings: [ANY_VALUE] },
  {
    file: "global-assign.ts",
    code: "export const a = globalThis.Object.assign;\n",
    findings: [ANY_VALUE],
  },
  {
    file: "renamed-import.ts",
    code: 'import { runInNewContext as run } from "node:vm";\nexport const r = run;\n',
    findings: [ANY_VALUE],
  },
  {
    file: "computed-import.ts",
    code: 'import vm from "node:vm";\nexport const r = vm["runInNewContext"];\n',
    findings: [ANY_VALUE],
  },
  {
    file: "from-entries.ts",
    code: 'const build: (e: [string, string][]) => { n: number } = Object.fromEntries;\nexport const n: number = build([["n", "text"]]).n;\n',
    findings: [ANY_VALUE],
  },
  {
    file: "destructured-parse.ts",
    code: "const { parse } = JSON;\nexport const f: (s: string) => number = parse;\n",
    findings: [ANY_VALUE],
  },
  { file: "require.ts", code: "export const load = require;\n", findings: [ANY_VALUE] },
  {
    file: "promise-any.ts",
    code: 'import type { Readable } from "node:stream";\nexport const find = (r: Readable): ((f: () => boolean) => Promise<{ n: number }>) =>\n  r.find.bind(r);\n',
    findings: [ANY_VALUE],
  },
  {
    file: "imported-zod-type.ts",
    code: `import { type ZodType } from "zod";\n${BOX}export const s: ZodType<Box> = ${BOX_SCHEMA}`,
    findings: [SCHEMA_TYPE],
  },
  {
    file: "namespace-zod-type.ts",
    code: `import * as zod from "zod";\n${BOX}export const s: zod.ZodType<Box> = ${BOX_SCHEMA}`,
    findings: [SCHEMA_TYPE],
  },
  {
    file: "zod-schema.ts",
    code: `${BOX}export const s: z.ZodSchema<Box> = ${BOX_SCHEMA}`,
    findings: [SCHEMA_TYPE],
  },
  {
    file: "zod-v3-type.ts",
    code: 'import { z as v3 } from "zod/v3";\ntype Box = { n: number };\nexport const s: v3.ZodType<Box> = v3.object({ n: v3.number() });\n',
    findings: [SCHEMA_TYPE],
  },
];

const ALLOWED = `import { runInNewContext } from "node:vm";
import { z } from "zod";
const box = ${BOX_SCHEMA}export type Box = z.infer<typeof box>;
export const parsed: Box = box.parse({ n: 1 });
export const merged = Object.assign({}, { a: 1 });
export const keys = Object.keys({ a: 1 });
export const value: unknown = JSON.parse("1");
export const result: unknown = runInNewContext("1");
export const pair = [1, "a"] as const;
export const abs = Math.abs;
const { keys: names } = Object;
export const named = names({ a: 1 });
export const isObject = (v: unknown): boolean => v instanceof Object || typeof Array === "function";
`;

const EslintResults = z.array(
  z.looseObject({
    filePath: z.string(),
    messages: z.array(z.looseObject({ ruleId: z.string().nullable() })),
  }),
);

test("ESLint bans", async (t) => {
  const folder = workspace(t);
  writeProbes(folder, { "allowed.ts": ALLOWED, ...Object.fromEntries(CASES.map(({ file, code }) => [file, code])) });
  const eslint = runTool(folder, "eslint", [
    "--config",
    join(root, "eslint.config.mts"),
    "--flag",
    "unstable_native_nodejs_ts_config",
    "--format",
    "json",
    ".",
  ]);
  const reported = new Map(
    EslintResults.parse(JSON.parse(eslint.stdout)).map(
      ({ filePath, messages }) => [basename(filePath), messages.map(({ ruleId }) => ruleId)] as const,
    ),
  );
  await t.test("tsc compiles every probe", () => {
    const tsc = runTool(folder, "tsc", ["-p", ".", "--pretty", "false"]);
    assert.equal(`${tsc.stdout}${tsc.stderr}`, "");
    assert.equal(tsc.status, 0);
  });
  await t.test("reports nothing in code that types every value", () => {
    assert.deepEqual(reported.get("allowed.ts"), []);
  });
  for (const { file, findings } of CASES) {
    await t.test(`reports ${findings.map(String).join(", ")} in ${file}`, () => {
      assert.deepEqual(reported.get(file), findings);
    });
  }
});
