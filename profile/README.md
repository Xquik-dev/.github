# Xquik Developer Tools

[![Skills.sh Xquik Skill](https://skills.sh/b/xquik-dev/x-twitter-scraper)](https://skills.sh/xquik-dev/x-twitter-scraper)

Use Xquik for X data, monitoring, exports, webhooks, and approved account actions.

## Public Contract

| Surface | Contract |
| --- | --- |
| REST API | 127 OpenAPI-backed operations |
| OpenAPI | 3.1.0 schema at [xquik.com/openapi.json](https://xquik.com/openapi.json) |
| MCP | 119 catalog routes through 2 tools |
| MCP responses | 118 JSON or text operations are supported. Binary support downloads use REST |
| Authentication | API keys or OAuth 2.1, depending on the client |
| Webhooks | HMAC-SHA256 signed deliveries |

## Start

1. Read the [API overview](https://docs.xquik.com/api-reference/overview).
2. Follow the [authentication guide](https://xquik.com/auth.md).
3. Pick an SDK or integration below.
4. Use the [MCP guide](https://docs.xquik.com/mcp/overview) for agents.

## SDKs

| Repository | Ecosystem |
| --- | --- |
| [x-twitter-scraper-typescript](https://github.com/Xquik-dev/x-twitter-scraper-typescript) | TypeScript |
| [x-twitter-scraper-python](https://github.com/Xquik-dev/x-twitter-scraper-python) | Python |
| [x-twitter-scraper-go](https://github.com/Xquik-dev/x-twitter-scraper-go) | Go |
| [x-twitter-scraper-java](https://github.com/Xquik-dev/x-twitter-scraper-java) | Java |
| [x-twitter-scraper-kotlin](https://github.com/Xquik-dev/x-twitter-scraper-kotlin) | Kotlin |
| [x-twitter-scraper-csharp](https://github.com/Xquik-dev/x-twitter-scraper-csharp) | C# / .NET |
| [x-twitter-scraper-php](https://github.com/Xquik-dev/x-twitter-scraper-php) | PHP |
| [x-twitter-scraper-ruby](https://github.com/Xquik-dev/x-twitter-scraper-ruby) | Ruby |
| [x-twitter-scraper-cli](https://github.com/Xquik-dev/x-twitter-scraper-cli) | CLI |
| [terraform-provider-x-twitter-scraper](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper) | Terraform |

## Agent and Workflow Integrations

| Repository | Integration |
| --- | --- |
| [x-twitter-scraper](https://github.com/Xquik-dev/x-twitter-scraper) | Agent Skill and plugin bundle |
| [tweetclaw](https://github.com/Xquik-dev/tweetclaw) | OpenClaw |
| [hermes-tweet](https://github.com/Xquik-dev/hermes-tweet) | Hermes Agent |
| [n8n-nodes-xquik](https://github.com/Xquik-dev/n8n-nodes-xquik) | n8n |
| [prefect-xquik](https://github.com/Xquik-dev/prefect-xquik) | Prefect |
| [xquik-haystack](https://github.com/Xquik-dev/xquik-haystack) | Haystack |
| [paperclip-plugin-xquik](https://github.com/Xquik-dev/paperclip-plugin-xquik) | Paperclip |

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

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
