// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import { spawnSync } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TestContext } from "node:test";
import { fileURLToPath } from "node:url";

export const root = fileURLToPath(new URL("..", import.meta.url));

// Makes a temporary folder that the test removes when it ends.
export function workspace(t: TestContext) {
  const folder = mkdtempSync(join(tmpdir(), "xquik-profile-test-"));
  t.after(() => rmSync(folder, { force: true, recursive: true }));
  return folder;
}

// Writes fake commands into <folder>/fakes. Each fake appends its call to
// <folder>/calls.log, then runs its body.
export function writeFakes(folder: string, fakes: Readonly<Record<string, string>>) {
  const directory = join(folder, "fakes");
  mkdirSync(directory);
  writeFileSync(join(folder, "calls.log"), "");
  for (const [name, body] of Object.entries(fakes)) {
    const source = `#!/bin/bash\ncall="\${0##*/} $*"\nprintf '%s\\n' "$call" >> "$FAKE_CALLS"\n${body}\n`;
    writeFileSync(join(directory, name), source, { mode: 0o755 });
  }
  return directory;
}

// Runs a script with only the fakes and the system tools on PATH.
export function run(
  folder: string,
  [program, ...args]: readonly [string, ...string[]],
  env: Readonly<Record<string, string>> = {},
) {
  const result = spawnSync(program, args, {
    encoding: "utf8",
    env: {
      FAKE_CALLS: join(folder, "calls.log"),
      HOME: folder,
      PATH: `${join(folder, "fakes")}:/usr/bin:/bin`,
      TMPDIR: folder,
      ...env,
    },
  });
  return {
    calls: readFileSync(join(folder, "calls.log"), "utf8").split("\n").filter(Boolean),
    status: result.status,
    stderr: result.stderr,
    stdout: result.stdout,
  };
}
