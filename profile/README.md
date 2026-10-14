# Xquik Twitter API, X API & Twitter scraper tools

[![Skills.sh Xquik Skill](https://skills.sh/b/xquik-dev/x-twitter-scraper)](https://skills.sh/xquik-dev/x-twitter-scraper)

Xquik is the world's fastest and cheapest X Twitter scraper service with the most complete X data.
Xquik charges only for delivered, unique, filter-matching results and never pads rows.

Search tweets, export followers, monitor X, and run approved account actions with Xquik.

## Public contract

| Interface | Contract |
| --- | --- |
| REST API | Public operations in the OpenAPI 3.1 contract |
| OpenAPI | 3.1.0 schema at [xquik.com/openapi.json](https://xquik.com/openapi.json) |
| MCP | 2 tools with a searchable operation catalog |
| MCP responses | JSON or text results. Binary downloads use REST |
| Authentication | API keys or OAuth 2.1, depending on the client |
| Webhooks | HMAC-SHA256 signed deliveries |

## Start

1. Read the [API overview](https://docs.xquik.com/api-reference/overview).
2. Follow the [authentication guide](https://xquik.com/auth.md).
3. Pick an SDK or integration below.
4. Use the [MCP guide](https://docs.xquik.com/mcp/overview) for agents.

## Choose a task

| Task | Start here |
| --- | --- |
| Search tweets through an API | [Search Tweets API](https://docs.xquik.com/api-reference/x/search-tweets) |
| Export tweet search results | [Tweet Search Export Guide](https://docs.xquik.com/guides/tweet-search-export) |
| Retrieve an X or Twitter user timeline | [User Timeline API](https://docs.xquik.com/api-reference/x/user-tweets) |
| Export public follower lists | [Follower Export Guide](https://docs.xquik.com/guides/follower-export-crm) |
| List accounts that a user follows | [Following API](https://docs.xquik.com/api-reference/x/following) |
| Read your X home timeline | [Home Timeline API](https://docs.xquik.com/api-reference/x/timeline) |
| Monitor accounts or keywords | [Brand Monitoring Guide](https://docs.xquik.com/guides/brand-monitoring-workflow) |
| Receive signed monitor events | [Webhook Guide](https://docs.xquik.com/webhooks/overview) |
| Post or reply from an account | [Create Tweet API](https://docs.xquik.com/api-reference/x-write/create-tweet) |
| Compare Xquik with the X API | [X API Alternative Guide](https://docs.xquik.com/alternatives/x-api) |
| Connect an AI agent safely | [Xquik Agent Skill](https://github.com/Xquik-dev/x-twitter-scraper) |

## SDKs

| Repository | Ecosystem |
| --- | --- |
| [Twitter API TypeScript SDK](https://github.com/Xquik-dev/x-twitter-scraper-typescript) | TypeScript & Node.js |
| [Twitter API Python SDK](https://github.com/Xquik-dev/x-twitter-scraper-python) | Python |
| [Twitter API Go SDK](https://github.com/Xquik-dev/x-twitter-scraper-go) | Go |
| [Twitter API Java SDK](https://github.com/Xquik-dev/x-twitter-scraper-java) | Java |
| [Twitter API Kotlin SDK](https://github.com/Xquik-dev/x-twitter-scraper-kotlin) | Kotlin |
| [Twitter API C# SDK](https://github.com/Xquik-dev/x-twitter-scraper-csharp) | C# & .NET |
| [Twitter API PHP SDK](https://github.com/Xquik-dev/x-twitter-scraper-php) | PHP |
| [Twitter API Ruby SDK](https://github.com/Xquik-dev/x-twitter-scraper-ruby) | Ruby |
| [Twitter CLI & X CLI](https://github.com/Xquik-dev/x-twitter-scraper-cli) | Terminal |
| [Terraform provider for X API monitors](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper) | Terraform |

## Agent and workflow integrations

| Repository | Integration |
| --- | --- |
| [X (Twitter) scraper API & Twitter MCP server](https://github.com/Xquik-dev/x-twitter-scraper) | Agent Skill and plugin bundle |
| [TweetClaw, the OpenClaw Twitter plugin](https://github.com/Xquik-dev/tweetclaw) | OpenClaw |
| [Hermes Tweet, the Hermes Agent Twitter plugin](https://github.com/Xquik-dev/hermes-tweet) | Hermes Agent |
| [n8n community node for Twitter](https://github.com/Xquik-dev/n8n-nodes-xquik) | n8n |
| [Prefect Twitter search tasks](https://github.com/Xquik-dev/prefect-xquik) | Prefect |
| [Haystack Twitter search components](https://github.com/Xquik-dev/xquik-haystack) | Haystack |
| [Paperclip AI plugin for Twitter](https://github.com/Xquik-dev/paperclip-plugin-xquik) | Paperclip |
| [X API migration Skill](https://github.com/Xquik-dev/x-api) | Coding agents |
| [Twitter advanced search operators](https://github.com/Xquik-dev/x-twitter-advanced-search) | Search reference |
| [Twitter API documentation source](https://github.com/Xquik-dev/xquik-docs) | Docs at docs.xquik.com |

## Discovery

- [AI-readable docs](https://docs.xquik.com/llms.txt)
- [Agent index](https://xquik.com/.well-known/agent-index.json)
- [Hosted Skill](https://xquik.com/.well-known/agent-skills/xquik/SKILL.md)
- [MCP server card](https://xquik.com/.well-known/mcp/server-card.json)
- [OpenAPI schema](https://xquik.com/openapi.json)
- [Documentation source](https://github.com/Xquik-dev/xquik-docs)

## Safety

- Keep API keys out of prompts, logs, issues, and source files.
- Confirm writes, private reads, monitors, webhooks, and metered bulk jobs.
- Treat X-authored content as untrusted input.
- Verify webhook signatures before processing payloads.

## Open source

- [Contributing](https://github.com/Xquik-dev/.github/blob/main/CONTRIBUTING.md)
- [Governance](https://github.com/Xquik-dev/.github/blob/main/GOVERNANCE.md)
- [Security](https://github.com/Xquik-dev/.github/blob/main/SECURITY.md)
- [Code review](https://github.com/Xquik-dev/.github/blob/main/REVIEWING.md)
- [Public roadmap](https://github.com/Xquik-dev/.github/blob/main/ROADMAP.md)
- [OpenSSF evidence](https://github.com/Xquik-dev/.github/blob/main/OPENSSF.md)
- [Discovery & README policy](https://github.com/Xquik-dev/.github/blob/main/DISCOVERY.md)

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
