// Copyright the Xquik contributors.
// SPDX-License-Identifier: MIT

import {
  GITHUB_ORG,
  OPENSSF_PROJECT_NAMES,
  REFERENCE_REPOSITORY_NAMES,
  SHARED_REPOSITORY_NAMES,
} from "./public-projects.ts";
import { z } from "zod";

const GITHUB_GRAPHQL = "https://api.github.com/graphql";
const GITHUB_REST = "https://api.github.com";
const REVIEW_START = "2026-07-23T00:00:00Z";
const REQUIRED_RATIO = 0.5;
const REVIEW_QUERY = `
  query ReviewEvidence(
    $owner: String!
    $name: String!
    $since: GitTimestamp!
    $after: String
  ) {
    repository(owner: $owner, name: $name) {
      defaultBranchRef {
        target {
          ... on Commit {
            history(first: 100, after: $after, since: $since) {
              nodes {
                oid
                associatedPullRequests(first: 10) {
                  nodes {
                    number
                    author {
                      __typename
                      login
                    }
                    headRefOid
                    mergedAt
                    reviews(first: 100) {
                      nodes {
                        author {
                          __typename
                          login
                        }
                        commit {
                          oid
                        }
                        state
                        submittedAt
                      }
                    }
                  }
                }
              }
              pageInfo {
                endCursor
                hasNextPage
              }
            }
          }
        }
      }
    }
  }
`;

const Author = z.looseObject({ __typename: z.string(), login: z.string() }).nullable();
const CommitNode = z.looseObject({
  associatedPullRequests: z.looseObject({
    nodes: z.array(
      z.looseObject({
        author: Author,
        headRefOid: z.string(),
        mergedAt: z.string().nullable(),
        reviews: z.looseObject({
          nodes: z.array(
            z.looseObject({
              author: Author,
              commit: z.looseObject({ oid: z.string() }).nullable(),
              state: z.string(),
              submittedAt: z.string().nullable(),
            }),
          ),
        }),
      }),
    ),
  }),
});
const History = z.looseObject({
  nodes: z.array(CommitNode),
  pageInfo: z.looseObject({ endCursor: z.string().nullable(), hasNextPage: z.boolean() }),
});
const ReviewResponse = z.looseObject({
  data: z
    .looseObject({
      repository: z
        .looseObject({
          defaultBranchRef: z.looseObject({ target: z.looseObject({ history: History.optional() }).nullable() }).nullable(),
        })
        .nullable(),
    })
    .nullish(),
  errors: z.array(z.looseObject({ message: z.string() })).optional(),
});
const RepositoryInventory = z.array(z.looseObject({ name: z.string() }));

function githubToken() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN is required.");
  return token;
}

function githubHeaders() {
  return {
    accept: "application/vnd.github+json",
    authorization: `Bearer ${githubToken()}`,
    "user-agent": "xquik-review-evidence-check",
  };
}

async function queryGitHub(variables: { owner: string; name: string; since: string; after: string | null }) {
  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      ...githubHeaders(),
      "content-type": "application/json",
    },
    body: JSON.stringify({ query: REVIEW_QUERY, variables }),
  });
  if (!response.ok) {
    throw new Error(`GitHub GraphQL returned HTTP ${response.status}.`);
  }
  const payload = ReviewResponse.parse(await response.json());
  if (payload.errors?.length) {
    throw new Error(payload.errors.map(({ message }) => message).join("; "));
  }
  return payload.data;
}

async function loadPublicRepoNames() {
  const names: string[] = [];
  for (let page = 1; ; page += 1) {
    const response = await fetch(
      `${GITHUB_REST}/orgs/${GITHUB_ORG}/repos?type=public&per_page=100&page=${page}`,
      { headers: githubHeaders() },
    );
    if (!response.ok) {
      throw new Error(`GitHub REST returned HTTP ${response.status}.`);
    }
    const repositories = RepositoryInventory.safeParse(await response.json());
    if (!repositories.success) {
      throw new Error("GitHub REST returned an invalid repository inventory.");
    }
    names.push(...repositories.data.map(({ name }) => name));
    if (repositories.data.length < 100) return names;
  }
}

async function verifyPublicInventory() {
  const expected = new Set([
    ...SHARED_REPOSITORY_NAMES,
    ...REFERENCE_REPOSITORY_NAMES,
    ...OPENSSF_PROJECT_NAMES,
  ]);
  const actual = new Set(await loadPublicRepoNames());
  const unexpected = [...actual].filter((name) => !expected.has(name));
  const missing = [...expected].filter((name) => !actual.has(name));
  if (unexpected.length === 0 && missing.length === 0) return;
  throw new Error(
    `Public repository inventory changed. Unexpected: ${unexpected.join(", ") || "none"}. ` +
      `Missing: ${missing.join(", ") || "none"}.`,
  );
}

function hasTwoPersonReview(commit: z.infer<typeof CommitNode>) {
  return commit.associatedPullRequests.nodes.some((pullRequest) => {
    const { mergedAt } = pullRequest;
    if (!mergedAt || !pullRequest.headRefOid) return false;
    const author = pullRequest.author?.login;
    if (!author) return false;
    return pullRequest.reviews.nodes.some(
      (review) =>
        review.state === "APPROVED" &&
        review.author?.__typename === "User" &&
        review.author.login !== author &&
        review.commit?.oid === pullRequest.headRefOid &&
        review.submittedAt !== null &&
        review.submittedAt <= mergedAt,
    );
  });
}

async function loadCommits(project: string) {
  const commits: z.infer<typeof CommitNode>[] = [];
  let after: string | null = null;
  do {
    const data = await queryGitHub({
      owner: GITHUB_ORG,
      name: project,
      since: REVIEW_START,
      after,
    });
    const history = data?.repository?.defaultBranchRef?.target?.history;
    if (!history) throw new Error(`GitHub returned no default-branch history for ${project}.`);
    commits.push(...history.nodes);
    after = history.pageInfo.hasNextPage ? history.pageInfo.endCursor : null;
  } while (after !== null);
  return commits;
}

async function auditProject(project: string) {
  const commits = await loadCommits(project);
  if (commits.length === 0) {
    throw new Error(`${project} has no commits in the review window.`);
  }
  const reviewed = commits.filter(hasTwoPersonReview);
  return {
    project,
    reviewed: reviewed.length,
    total: commits.length,
    ratio: reviewed.length / commits.length,
  };
}

await verifyPublicInventory();

const results = await Promise.all(OPENSSF_PROJECT_NAMES.map(auditProject));
const failures = results.filter(({ ratio }) => ratio < REQUIRED_RATIO);

for (const { project, ratio, reviewed, total } of results) {
  process.stdout.write(
    `${project}: ${reviewed}/${total} commits reviewed by a non-author human ` +
      `(${(ratio * 100).toFixed(1)}%).\n`,
  );
}

if (failures.length > 0) {
  process.stderr.write(
    `Review evidence warning: independent review fell below 50% for: ${failures
      .map(({ project }) => project)
      .join(", ")}\n`,
  );
} else {
  process.stdout.write(`All ${results.length} projects meet the 50% review threshold.\n`);
}
