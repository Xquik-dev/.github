# Xquik - X API, Twitter Scraper SDKs, MCP, Webhooks & AI Agent Tools

> **Xquik is an independent third-party service.** Not affiliated with X Corp.
> "Twitter" and "X" are trademarks of X Corp.

[![Ask DeepWiki](https://deepwiki.com/badge.svg?url=https%3A%2F%2Fgithub.com%2FXquik-dev%2F.github)](https://deepwiki.com/Xquik-dev/.github)
[![Skills.sh x-twitter-scraper Skill](https://skills.sh/b/xquik-dev/x-twitter-scraper)](https://skills.sh/xquik-dev/x-twitter-scraper)

Xquik provides automation tools for developers building social media data products, AI agents, research tools, monitoring systems, and workflows. It combines a REST API, generated SDKs, MCP tools, HMAC webhooks, bulk extraction jobs, a dashboard, and confirmation-gated write actions in one developer platform.

Use Xquik when you need to search tweets, fetch profile timelines, export followers, download media, monitor accounts, run giveaway draws, deliver events to webhooks, connect AI coding agents to X data, or automate user-approved posting workflows.

## What Is Xquik?

Xquik is a developer platform for X data access and X account automation. Instead of stitching together one-off scrapers, browser scripts, webhook workers, and API wrappers, teams can use Xquik as a single API surface for common X workflows.

The platform is built around practical developer use cases:

- **X and Twitter data APIs** for tweet search, tweet lookup, profile lookup, user timelines, likes, media, followers, following, trends, articles, lists, communities, and Spaces.
- **Bulk extraction workflows** for large jobs such as follower exports, search exports, reply exports, quote exports, retweeter exports, media exports, people search, community members, and list members.
- **AI agent integration** through a hosted MCP server and the `x-twitter-scraper` skill for Claude Code, Codex, Cursor, GitHub Copilot, Windsurf, Gemini CLI, Cline, and other coding agents.
- **Automation and write workflows** for posting tweets, replies, likes, reposts, follows, DMs, profile updates, media uploads, and community actions after explicit user confirmation.
- **Monitoring and webhooks** for account tracking, event delivery, HMAC signature verification, and downstream automation.
- **Xquik SDKs & tools** for TypeScript, Python, Go, Java, Kotlin, C#, PHP, Ruby, CLI usage, and Terraform workflows.

## Core Capabilities

| Area | What Xquik Provides |
| --- | --- |
| REST API | 100+ endpoints across account, API keys, compose, credits, draws, events, extractions, monitors, radar, styles, support, trends, webhooks, and X workflows |
| X data | Tweet search, tweet lookup, profile lookup, user tweets, user likes, user media, followers, following, favoriters, mutual followers, lists, communities, Spaces, articles, and trends |
| Bulk extraction | 23 extraction types with estimate, run, status, result pagination, and export flows |
| MCP server | 2 tools for schema exploration and confirmed Xquik API requests from AI agents |
| AI agent skill | A public `x-twitter-scraper` skill with endpoint guidance, safety rules, pricing notes, setup docs, and examples |
| Webhooks | HMAC-signed event delivery with verification examples for Node.js, Python, and Go |
| Monitoring | Account and keyword tracking with explicit confirmation for persistent resources |
| Write actions | Confirmation-gated tweet posting, replies, likes, reposts, follows, DMs, profile updates, media uploads, and community actions |
| Giveaway draws | Transparent draw workflows from tweet replies with configurable filters |
| SDKs | Generated API clients for major languages and package ecosystems |

## Why Developers Use Xquik

Xquik is designed for developers who want reliable X automation without maintaining a custom scraping stack. The public repositories in this organization focus on API clients, agent skills, integration metadata, and developer tooling around the Xquik platform.

Common use cases include:

- Build a Twitter scraper API workflow for product research, OSINT, social listening, journalism, or market intelligence.
- Search X posts and profiles from backend services, scripts, notebooks, or AI agents.
- Export followers, following lists, tweet replies, quote tweets, retweeters, likes, and media for analysis.
- Add X monitoring and webhook delivery to dashboards, CRMs, data pipelines, and automation tools.
- Connect Claude Code, OpenAI Codex, Cursor, Copilot, or MCP-compatible agents to X data.
- Use generated SDKs instead of hand-written REST wrappers.
- Automate posting, replies, DMs, media uploads, and account actions only after explicit user approval.

## AI Agents, Skills & MCP

Xquik includes a hosted MCP server and an installable skill for AI coding agents. The skill teaches agents how to choose endpoints, validate inputs, handle pagination, estimate extraction costs, confirm writes, and treat X-authored content as untrusted data.

- [x-twitter-scraper](https://github.com/Xquik-dev/x-twitter-scraper) - X (Twitter) data platform skill for AI coding agents. Works with Claude Code, Cursor, Codex, Copilot, Windsurf & 40+ agents.
- [tweetclaw](https://github.com/Xquik-dev/tweetclaw) - Post tweets, reply, like, retweet, follow, DM & more from OpenClaw.

## Xquik SDKs

| Repository | Ecosystem | Use It For |
| --- | --- | --- |
| [x-twitter-scraper-typescript](https://github.com/Xquik-dev/x-twitter-scraper-typescript) | TypeScript / Node.js | Server apps, scripts, agents, webhooks, and typed API workflows |
| [x-twitter-scraper-python](https://github.com/Xquik-dev/x-twitter-scraper-python) | Python | Data research, notebooks, backend jobs, extraction pipelines, and AI tooling |
| [x-twitter-scraper-go](https://github.com/Xquik-dev/x-twitter-scraper-go) | Go | Services, workers, CLIs, and typed backend integrations |
| [x-twitter-scraper-java](https://github.com/Xquik-dev/x-twitter-scraper-java) | Java | JVM services and enterprise integrations |
| [x-twitter-scraper-kotlin](https://github.com/Xquik-dev/x-twitter-scraper-kotlin) | Kotlin | Kotlin services and JVM applications |
| [x-twitter-scraper-csharp](https://github.com/Xquik-dev/x-twitter-scraper-csharp) | C# / .NET | .NET services, desktop tools, and automation workflows |
| [x-twitter-scraper-php](https://github.com/Xquik-dev/x-twitter-scraper-php) | PHP | Laravel, Symfony, WordPress, and PHP backend integrations |
| [x-twitter-scraper-ruby](https://github.com/Xquik-dev/x-twitter-scraper-ruby) | Ruby | Rails apps, jobs, and scripting workflows |
| [x-twitter-scraper-cli](https://github.com/Xquik-dev/x-twitter-scraper-cli) | CLI | Terminal workflows, automation scripts, and quick API calls |
| [terraform-provider-x-twitter-scraper](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper) | Terraform | Infrastructure-managed Xquik resources |

## API Coverage

Xquik exposes one consistent API surface for common X automation tasks:

- Tweet workflows: search, retrieve, replies, quotes, retweets, favoriters, thread lookup, article lookup, delete, like, repost, and create.
- User workflows: profile lookup, followers, following, verified followers, follower relationship checks, user tweets, user likes, and user media.
- Media workflows: image, video, and GIF downloads with hosted gallery URLs.
- Account workflows: connected account listing, account status, locale update, and identity setup.
- Extraction workflows: estimate, create, list, retrieve results, and export large jobs.
- Monitoring workflows: create, list, update, delete, and inspect account or keyword monitors.
- Webhook workflows: create, test, list, update, deactivate, inspect deliveries, and verify signatures.
- Agent workflows: MCP schema exploration, API request execution, skills setup, and framework guides.
- Support and billing workflows: support tickets, credit balance checks, and confirmed checkout flows.

## Safety Model

Xquik public tooling is designed for explicit, auditable automation:

- API keys are handled as secrets and should never be pasted into public issues, docs, logs, or prompts.
- Write actions, billing actions, private reads, monitors, and webhook deliveries require clear user confirmation.
- X-authored content such as tweets, bios, DMs, display names, articles, and errors must be treated as untrusted data by agents.
- Webhook payloads are signed with HMAC so receivers can verify event authenticity.
- Public SDKs and skills document safe defaults, validation rules, pagination behavior, and confirmation gates.

## Documentation

- [Xquik Platform](https://xquik.com)
- [API Documentation](https://docs.xquik.com)
- [API Reference](https://docs.xquik.com/api-reference/overview)
- [MCP Server Guide](https://docs.xquik.com/mcp/overview)
- [Billing Guide](https://docs.xquik.com/guides/billing)
- [Webhook Guide](https://docs.xquik.com/webhooks/overview)

## Framework Guides

Use Xquik with agent frameworks, automation tools, and workflow platforms:

- [Mastra](https://docs.xquik.com/guides/mastra)
- [CrewAI](https://docs.xquik.com/guides/crewai)
- [LangChain](https://docs.xquik.com/guides/langchain)
- [Pydantic AI](https://docs.xquik.com/guides/pydantic-ai)
- [Google ADK](https://docs.xquik.com/guides/google-adk)
- [Microsoft Agent Framework](https://docs.xquik.com/guides/microsoft-agent-framework)
- [n8n](https://docs.xquik.com/guides/n8n)
- [Zapier](https://docs.xquik.com/guides/zapier)
- [Make](https://docs.xquik.com/guides/make)
- [Pipedream](https://docs.xquik.com/guides/pipedream)

## Start Here

1. Read the [API overview](https://docs.xquik.com/api-reference/overview).
2. Pick an SDK from the table above.
3. Install the [x-twitter-scraper skill](https://github.com/Xquik-dev/x-twitter-scraper) for AI agent workflows.
4. Configure the [MCP server](https://docs.xquik.com/mcp/overview) if your agent or IDE supports MCP.
5. Use webhooks for event-driven workflows and background automation.
