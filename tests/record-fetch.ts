// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

// Preloaded by contract-token.test.ts. Replaces fetch with a fake that
// records each host and whether the request carried a token, then answers 500.

import { appendFileSync } from "node:fs";
import { z } from "zod";

const log = z.string().parse(process.env.FETCH_LOG);

globalThis.fetch = async (url, options = {}) => {
  const sent = new Headers(options.headers).has("authorization") ? "token" : "anonymous";
  appendFileSync(log, `${new URL(url instanceof Request ? url.url : url).host} ${sent}\n`);
  return new Response("{}", { status: 500 });
};
