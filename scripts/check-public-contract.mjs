import { readFile } from "node:fs/promises";

const GITHUB_API = "https://api.github.com";
const GITHUB_ORG = "Xquik-dev";
const OPENAPI_URL = "https://xquik.com/openapi.json";
const SERVER_CARD_URL = "https://xquik.com/.well-known/mcp/server-card.json";
const HTTP_METHODS = new Set(["delete", "get", "head", "options", "patch", "post", "put", "trace"]);
const INDEPENDENCE_NOTICE =
  'Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.';
const STALE_PUBLIC_COPY = [
  /\b40\+ (?:agents|integrations|tools)/iu,
  /\b47\+ (?:agents|integrations|tools)/iu,
  /\b126 (?:API |OpenAPI |REST )?operations/iu,
  /\b127 endpoints/iu,
  /\b120 (?:catalog )?routes/iu,
  /\b118 (?:catalog )?routes/iu,
  /\b118 operations through 2 tools/iu,
  /\b2\.5\.4\b/u,
];
const INTEGRATION_SURFACES = [
  {
    repo: "n8n-nodes-xquik",
    file: "nodes/Xquik/Xquik.node.ts",
    baseFile: "nodes/Xquik/GenericFunctions.ts",
    operations: [
      { path: "/credits", pathNeedle: "'/credits'", query: [] },
      {
        path: "/x/tweets/search",
        pathNeedle: "'/x/tweets/search'",
        query: ["q", "queryType", "limit", "cursor", "fromUser", "language", "sinceTime", "untilTime", "verifiedOnly"],
      },
      { path: "/x/users/search", pathNeedle: "'/x/users/search'", query: ["q", "cursor"] },
      { path: "/trends", pathNeedle: "'/trends'", query: ["woeid", "count"] },
      { path: "/x/followers/check", pathNeedle: "'/x/followers/check'", query: ["source", "target"] },
    ],
  },
  {
    repo: "paperclip-plugin-xquik",
    file: "src/worker.ts",
    baseFile: "src/constants.ts",
    operations: [
      { path: "/x/tweets/search", pathNeedle: '"/x/tweets/search"', query: ["q", "queryType", "limit", "cursor", "sinceTime", "untilTime"] },
      { path: "/x/tweets/{id}", pathNeedle: "/x/tweets/${", query: [] },
      { path: "/x/users/search", pathNeedle: '"/x/users/search"', query: ["q", "cursor"] },
      { path: "/x/users/{id}", pathNeedle: "/x/users/${", query: [] },
      { path: "/x/users/{id}/tweets", pathNeedle: "}/tweets`,", query: ["cursor", "includeReplies", "includeParentTweet"] },
      { path: "/x/trends", pathNeedle: '"/x/trends"', query: ["woeid", "count"] },
    ],
  },
  {
    repo: "prefect-xquik",
    file: "prefect_xquik/client.py",
    operations: [
      { path: "/x/tweets/search", pathNeedle: '"/x/tweets/search"', query: ["q", "queryType", "limit", "cursor", "sinceTime", "untilTime"] },
      { path: "/x/tweets/{id}", pathNeedle: 'f"/x/tweets/{quoted_id}"', query: [] },
      { path: "/x/users/search", pathNeedle: '"/x/users/search"', query: ["q", "cursor"] },
      { path: "/x/users/{id}", pathNeedle: 'f"/x/users/{quoted_id}"', query: [] },
      { path: "/x/users/{id}/tweets", pathNeedle: 'f"/x/users/{quoted_id}/tweets"', query: ["cursor", "includeReplies", "includeParentTweet"] },
      { path: "/x/trends", pathNeedle: '"/x/trends"', query: ["woeid", "count"] },
    ],
  },
  {
    repo: "xquik-haystack",
    file: "src/haystack_integrations/components/websearch/xquik/xquik_websearch.py",
    operations: [
      { path: "/x/tweets/search", pathNeedle: '}/x/tweets/search"', query: ["q", "queryType", "limit", "cursor", "sinceTime", "untilTime"] },
      { path: "/x/users/{id}/tweets", pathNeedle: "}/x/users/{quote(user_id, safe='')}/tweets\"", query: ["cursor", "includeReplies", "includeParentTweet"] },
    ],
  },
];

function requestHeaders(accept) {
  const headers = { accept, "user-agent": "xquik-public-contract-check" };
  if (process.env.GITHUB_TOKEN) headers.authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  return headers;
}

async function fetchResource(url, accept) {
  const response = await fetch(url, { headers: requestHeaders(accept) });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}.`);
  return response;
}

async function fetchJson(url) {
  return (await fetchResource(url, "application/json")).json();
}

async function fetchText(url, accept = "text/plain") {
  return (await fetchResource(url, accept)).text();
}

function operationCount(openApi) {
  return Object.values(openApi.paths ?? {}).reduce(
    (total, pathItem) =>
      total +
      Object.keys(pathItem ?? {}).filter((key) => HTTP_METHODS.has(key)).length,
    0,
  );
}

function requireCount(description, label, pattern) {
  const match = pattern.exec(description);
  if (match?.groups?.count === undefined) {
    throw new Error(`Server card is missing the ${label} count.`);
  }
  return Number(match.groups.count);
}

async function loadServerCard() {
  const localPath = process.argv[2];
  if (localPath === undefined) return fetchJson(SERVER_CARD_URL);
  return JSON.parse(await readFile(localPath, "utf8"));
}

async function listPublicRepos() {
  const repos = [];
  for (let page = 1; ; page += 1) {
    const batch = await fetchJson(
      `${GITHUB_API}/orgs/${GITHUB_ORG}/repos?type=public&per_page=100&page=${page}`,
    );
    repos.push(...batch);
    if (batch.length < 100) return repos;
  }
}

function contentUrl(repo, path) {
  const encodedPath = path.split("/").map(encodeURIComponent).join("/");
  return `${GITHUB_API}/repos/${GITHUB_ORG}/${repo.name}/contents/${encodedPath}?ref=${encodeURIComponent(repo.default_branch)}`;
}

async function loadRepoFile(repo, path) {
  return fetchText(contentUrl(repo, path), "application/vnd.github.raw+json");
}

function visibleMarkdown(markdown) {
  return markdown.replace(/[*_`>#]/gu, "").replace(/\s+/gu, " ").trim();
}

function resolveParameter(openApi, parameter) {
  if (!parameter?.$ref) return parameter;
  const name = parameter.$ref.split("/").at(-1);
  return openApi.components?.parameters?.[name];
}

function operationQueryParameters(openApi, path, method) {
  const publicPath = openApi.paths?.[path] ? path : `/api/v1${path}`;
  const pathItem = openApi.paths?.[publicPath];
  const operation = pathItem?.[method];
  if (!operation) throw new Error(`OpenAPI is missing ${method.toUpperCase()} ${path}.`);
  return new Set(
    [...(pathItem.parameters ?? []), ...(operation.parameters ?? [])]
      .map((parameter) => resolveParameter(openApi, parameter))
      .filter((parameter) => parameter?.in === "query")
      .map((parameter) => parameter.name),
  );
}

async function checkRepoReadmes(repos) {
  await Promise.all(
    repos.map(async (repo) => {
      const path = repo.name === ".github" ? "profile/README.md" : "README.md";
      const readme = await loadRepoFile(repo, path);
      const visible = visibleMarkdown(readme);
      if (!visible.includes(INDEPENDENCE_NOTICE)) {
        throw new Error(`${repo.name}/${path} is missing the approved independence notice.`);
      }
      const stale = STALE_PUBLIC_COPY.find((pattern) => pattern.test(visible));
      if (stale) throw new Error(`${repo.name}/${path} contains stale public copy: ${stale}.`);
    }),
  );
}

async function checkIntegrationSurfaces(openApi, reposByName) {
  await Promise.all(
    INTEGRATION_SURFACES.map(async (surface) => {
      const repo = reposByName.get(surface.repo);
      if (!repo) throw new Error(`Public repository ${surface.repo} is missing.`);
      const source = await loadRepoFile(repo, surface.file);
      const baseSource = surface.baseFile ? await loadRepoFile(repo, surface.baseFile) : source;
      if (!baseSource.includes("https://xquik.com/api/v1")) {
        throw new Error(`${surface.repo}/${surface.baseFile ?? surface.file} has the wrong API base URL.`);
      }
      for (const operation of surface.operations) {
        const available = operationQueryParameters(openApi, operation.path, "get");
        if (!source.includes(operation.pathNeedle)) {
          throw new Error(`${surface.repo}/${surface.file} is missing GET ${operation.path}.`);
        }
        for (const parameter of operation.query) {
          if (!available.has(parameter)) {
            throw new Error(`OpenAPI no longer accepts ${parameter} for GET ${operation.path}.`);
          }
          if (!source.includes(parameter)) {
            throw new Error(`${surface.repo}/${surface.file} is missing ${parameter} for GET ${operation.path}.`);
          }
        }
      }
    }),
  );
}

const [openApi, serverCard, profile, repos] = await Promise.all([
  fetchJson(OPENAPI_URL),
  loadServerCard(),
  readFile("profile/README.md", "utf8"),
  listPublicRepos(),
]);
const reposByName = new Map(repos.map((repo) => [repo.name, repo]));
const restCount = operationCount(openApi);
const cardDescription = serverCard.description ?? "";
const cardRestCount = requireCount(
  cardDescription,
  "REST operations",
  /(?<count>\d+) REST operations\b/u,
);
const mcpCount = requireCount(
  cardDescription,
  "MCP routes",
  /(?<count>\d+) MCP (?:catalog )?routes\b/u,
);
const textCount = requireCount(
  cardDescription,
  "JSON/text operations",
  /(?<count>\d+) (?:JSON or text operations|JSON\/text ops)\b/u,
);

if (cardRestCount !== restCount) {
  throw new Error(`Server card says ${cardRestCount} REST operations; OpenAPI has ${restCount}.`);
}
for (const expected of [
  `| REST API | ${restCount} OpenAPI-backed operations |`,
  `${mcpCount} catalog routes through 2 tools`,
  `${textCount} JSON or text operations are supported`,
]) {
  if (!profile.includes(expected)) {
    throw new Error(`profile/README.md is missing: ${expected}`);
  }
}
if (/126 operations|40\+ agents|118 operations through 2 tools/u.test(profile)) {
  throw new Error("profile/README.md contains a stale public count.");
}

await checkIntegrationSurfaces(openApi, reposByName);
await checkRepoReadmes(repos);

process.stdout.write(
  `Checked ${repos.length} public repositories. Contracts match ${restCount} REST, ${mcpCount} MCP, and ${textCount} JSON/text operations.\n`,
);
