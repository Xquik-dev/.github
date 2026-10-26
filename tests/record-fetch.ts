// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

// Preloaded by contract-token.test.ts. Replaces fetch with a fake that
// records each host and whether the request carried a token, then answers 500.

import { appendFileSync } from "node:fs";

globalThis.fetch = async (url, options = {}) => {
  const sent = new Headers(options.headers).has("authorization") ? "token" : "anonymous";
  appendFileSync(process.env.FETCH_LOG, `${new URL(url).host} ${sent}\n`);
  return new Response("{}", { status: 500 });
};
