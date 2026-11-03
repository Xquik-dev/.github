# Xquik Twitter API, X API & Twitter scraper tools

[![Skills.sh Xquik Skill](https://skills.sh/b/xquik-dev/x-twitter-scraper)](https://skills.sh/xquik-dev/x-twitter-scraper)
[![Convex Component](https://www.convex.dev/components/badge/convex-xquik)](https://www.convex.dev/components/convex-xquik)

Xquik is the world's fastest and cheapest X Twitter scraper service with the most complete X data.
Xquik charges only for delivered, unique, filter-matching results and never pads rows.

Search tweets, export followers, monitor accounts, and run approved account actions.
Use the REST API, MCP server, SDKs, CLI, webhooks, or Apify Actors.
Or try any [X (Twitter) tool](#x-twitter-tools) on xquik.com.

[xquik.com](https://xquik.com) · [Docs](https://docs.xquik.com) · [REST API](https://docs.xquik.com/api-reference/overview) · [Twitter MCP server](https://docs.xquik.com/mcp/overview) · [SDKs](#twitter-api-sdks) · [Apify Actors](#apify-actors) · [RapidAPI](#rapidapi-apis) · [Postman](#postman-collection-and-openapi) · [Trust](https://xquik.com/trust)

## Public contract

| Interface | Contract |
| --- | --- |
| REST API | Public operations in the OpenAPI 3.1 contract |
| OpenAPI | 3.1.0 schema at [xquik.com/openapi.json](https://xquik.com/openapi.json) |
| MCP | 2 tools with a searchable operation catalog |
| MCP responses | JSON or text results. Binary downloads use REST |
| Authentication | API keys or OAuth 2.1, depending on the client |
| Webhooks | HMAC-SHA256 signed deliveries |

## Start with the Twitter API

1. Read the [API overview](https://docs.xquik.com/api-reference/overview).
2. Follow the [authentication guide](https://xquik.com/auth.md).
3. Send a first request with the [Twitter API quickstart](https://docs.xquik.com/x-api-quickstart).
4. Pick an SDK or integration below.
5. Use the [MCP guide](https://docs.xquik.com/mcp/overview) for agents.

## Choose a task

| Task | Start here |
| --- | --- |
| Search tweets through an API | [Search Tweets API](https://docs.xquik.com/api-reference/x/search-tweets) |
| Search tweets by date | [Search Tweets by Date Guide](https://docs.xquik.com/guides/search-tweets-by-date) |
| Export tweet search results | [Tweet Search Export Guide](https://docs.xquik.com/guides/tweet-search-export) |
| Retrieve an X or Twitter user timeline | [User Timeline API](https://docs.xquik.com/api-reference/x/user-tweets) |
| Export public follower lists | [Follower Export Guide](https://docs.xquik.com/guides/follower-export-crm) |
| List accounts that a user follows | [Following API](https://docs.xquik.com/api-reference/x/following) |
| Read your X home timeline | [Home Timeline API](https://docs.xquik.com/api-reference/x/timeline) |
| Monitor accounts or keywords | [Brand Monitoring Guide](https://docs.xquik.com/guides/brand-monitoring-workflow) |
| Receive signed monitor events | [Webhook Guide](https://docs.xquik.com/webhooks/overview) |
| Post or reply from an account | [Create Tweet API](https://docs.xquik.com/api-reference/x-write/create-tweet) |
| Download X videos, GIFs & images | [X (Twitter) Video Downloader](https://xquik.com/en/twitter-video-downloader) |
| Check an account for a shadowban | [X (Twitter) Shadowban Checker](https://xquik.com/en/twitter-shadowban-checker) |
| Pick giveaway winners | [X (Twitter) Giveaway Picker](https://xquik.com/en/twitter-giveaway-picker) |
| Read a full thread | [X (Twitter) Thread Reader](https://xquik.com/en/twitter-thread-reader) |
| Run X scrapers on Apify | [Xquik Apify Actors](https://apify.com/xquik) |
| Call the API from Postman | [Xquik REST API collection](https://documenter.getpostman.com/view/12709954/2sBY4TpxXK) |
| Automate X with n8n, Zapier & Make | [No-code workflow guide](https://docs.xquik.com/guides/no-code-workflow-handoff) |
| Use X data in Claude, ChatGPT & Cursor | [Coding-agent MCP setup](https://docs.xquik.com/mcp/coding-agents) |
| Compare Xquik with the X API | [X API Alternative Guide](https://docs.xquik.com/alternatives/x-api) |
| Move app code off the X API | [x-api Skill](https://github.com/Xquik-dev/x-api) |
| Find X advanced search operators | [Twitter advanced search operators](https://github.com/Xquik-dev/x-twitter-advanced-search) |
| Connect an AI agent safely | [Xquik Agent Skill](https://github.com/Xquik-dev/x-twitter-scraper) |

## Documentation

| Resource | Link |
| --- | --- |
| Documentation home | [docs.xquik.com](https://docs.xquik.com) |
| REST API reference | [API overview](https://docs.xquik.com/api-reference/overview) |
| Authentication | [API keys and OAuth 2.1](https://docs.xquik.com/api-reference/authentication) |
| Webhooks | [Webhooks overview](https://docs.xquik.com/webhooks/overview) |
| Webhook security | [Webhook signature verification](https://docs.xquik.com/webhooks/verification) |
| MCP server | [MCP server overview](https://docs.xquik.com/mcp/overview) |
| MCP tools | [MCP tools reference](https://docs.xquik.com/mcp/tools) |
| SDKs and CLI | [SDKs overview](https://docs.xquik.com/sdks) |
| Rate limits | [Rate limits guide](https://docs.xquik.com/guides/rate-limits) |
| Errors | [Error handling guide](https://docs.xquik.com/guides/error-handling) |
| Export formats | [Export formats guide](https://docs.xquik.com/guides/response-formats-exports) |
| Xquik site | [xquik.com](https://xquik.com) |
| Alternatives | [Twitter API alternatives](https://docs.xquik.com/twitter-api-alternatives) |
| Changelog | [Xquik changelog](https://docs.xquik.com/changelog) |

## X (Twitter) tools

Open a tool page on xquik.com to run it.
Tools that post or change an account need a connected X account.

### Search, export & download tools

- [Export Posts from an X (Twitter) Community](https://xquik.com/en/community-post-extractor)
- [See Who Liked Your Tweet on X (Twitter)](https://xquik.com/en/see-who-liked-a-tweet)
- [See Who Retweeted an X (Twitter) Post](https://xquik.com/en/repost-extractor)
- [View Quote Tweets on X (Twitter)](https://xquik.com/en/quote-tweets)
- [X (Twitter) Account Location Checker](https://xquik.com/en/twitter-account-location)
- [X (Twitter) Advanced Search](https://xquik.com/en/twitter-advanced-search)
- [X (Twitter) Archive Viewer](https://xquik.com/en/twitter-archive-viewer)
- [X (Twitter) Article Reader](https://xquik.com/en/x-article-reader)
- [X (Twitter) Communities Explorer](https://xquik.com/en/x-communities)
- [X (Twitter) Community Moderators](https://xquik.com/en/community-moderator-explorer)
- [X (Twitter) Community Search](https://xquik.com/en/community-searcher)
- [X (Twitter) Follow Checker](https://xquik.com/en/twitter-follow-checker)
- [X (Twitter) Follower Tracker](https://xquik.com/en/twitter-follower-tracker)
- [X (Twitter) Following List](https://xquik.com/en/twitter-following-list)
- [X (Twitter) GIF Downloader](https://xquik.com/en/twitter-gif-downloader)
- [X (Twitter) Giveaway Picker](https://xquik.com/en/twitter-giveaway-picker)
- [X (Twitter) ID Finder](https://xquik.com/en/twitter-id-finder)
- [X (Twitter) Image Downloader](https://xquik.com/en/twitter-image-downloader)
- [X (Twitter) Likes Viewer](https://xquik.com/en/twitter-likes-viewer)
- [X (Twitter) List Followers Export](https://xquik.com/en/list-follower-explorer)
- [X (Twitter) List Members Export](https://xquik.com/en/list-member-extractor)
- [X (Twitter) List Timeline Export](https://xquik.com/en/list-post-extractor)
- [X (Twitter) Media Viewer](https://xquik.com/en/twitter-media-viewer)
- [X (Twitter) Mentions of Any Account](https://xquik.com/en/mention-extractor)
- [X (Twitter) Replies Viewer](https://xquik.com/en/twitter-replies)
- [X (Twitter) Spaces Explorer](https://xquik.com/en/x-spaces)
- [X (Twitter) Thread Reader](https://xquik.com/en/twitter-thread-reader)
- [X (Twitter) User Search](https://xquik.com/en/twitter-user-search)
- [X (Twitter) Verified Followers](https://xquik.com/en/verified-follower-explorer)
- [X (Twitter) Video Downloader](https://xquik.com/en/twitter-video-downloader)
- [X (Twitter) Viewer](https://xquik.com/en/twitter-viewer)

### Analysis tools

- [Crypto & Stock Sentiment on X (Twitter)](https://xquik.com/en/stock-crypto-signals)
- [Tweet Analyzer with a Viral Score](https://xquik.com/en/tweet-viral-score)
- [Tweet Classifier](https://xquik.com/en/tweet-classifier)
- [X (Twitter) Account Analyzer](https://xquik.com/en/twitter-account-analyzer)
- [X (Twitter) Monitoring Tool](https://xquik.com/en/twitter-monitoring-tool)
- [X (Twitter) News Classifier](https://xquik.com/en/news-tweet-classifier)
- [X (Twitter) Roast](https://xquik.com/en/twitter-roast)
- [X (Twitter) Sentiment Analysis](https://xquik.com/en/twitter-sentiment-analysis)
- [X (Twitter) Shadowban Checker](https://xquik.com/en/twitter-shadowban-checker)

### Compose & account action tools

- [Create an X (Twitter) Community](https://xquik.com/en/community-creator)
- [Delete an X (Twitter) Community](https://xquik.com/en/community-deleter)
- [Delete X (Twitter) Likes](https://xquik.com/en/tweet-unliker)
- [Join an X (Twitter) Community](https://xquik.com/en/community-joiner)
- [Leave an X (Twitter) Community](https://xquik.com/en/community-leaver)
- [Tweet Composer for X (Twitter)](https://xquik.com/en/tweet-composer)
- [Tweet Deleter for X (Twitter)](https://xquik.com/en/tweet-deleter)
- [Undo Retweets on X (Twitter)](https://xquik.com/en/tweet-unretweeter)
- [Upload Media to X (Twitter)](https://xquik.com/en/media-uploader)
- [X (Twitter) Banner Changer](https://xquik.com/en/twitter-banner)
- [X (Twitter) Bio & Profile Editor](https://xquik.com/en/profile-editor)
- [X (Twitter) Character Counter](https://xquik.com/en/twitter-character-counter)
- [X (Twitter) DM Sender](https://xquik.com/en/dm-sender)
- [X (Twitter) Follow Tool](https://xquik.com/en/user-follower)
- [X (Twitter) Liker](https://xquik.com/en/tweet-liker)
- [X (Twitter) Profile Picture Changer](https://xquik.com/en/twitter-profile-picture)
- [X (Twitter) Retweeter](https://xquik.com/en/tweet-retweeter)
- [X (Twitter) Unfollow Tool](https://xquik.com/en/twitter-unfollow-tool)

### Trending tools

- [GitHub Trending Repos Today](https://xquik.com/en/github-trending)
- [Hacker News Top Stories](https://xquik.com/en/hacker-news-trending)
- [Most Viewed Wikipedia Pages](https://xquik.com/en/wikipedia-trending)
- [Polymarket Analytics for Top Markets](https://xquik.com/en/polymarket)
- [Reddit Trending Posts](https://xquik.com/en/reddit)
- [Trending Searches Today on Google Trends](https://xquik.com/en/google-trends)
- [TrustMRR Fastest-Growing Startups](https://xquik.com/en/trustmrr)

## Twitter API SDKs

Install a typed Twitter API client, the CLI, or the Terraform provider.

| SDK | Source | Package | Docs |
| --- | --- | --- | --- |
| TypeScript | [x-twitter-scraper-typescript](https://github.com/Xquik-dev/x-twitter-scraper-typescript) | [npm](https://www.npmjs.com/package/x-twitter-scraper) | [Twitter API TypeScript SDK](https://docs.xquik.com/sdks/typescript) |
| Python | [x-twitter-scraper-python](https://github.com/Xquik-dev/x-twitter-scraper-python) | [PyPI](https://pypi.org/project/x-twitter-scraper/) | [Twitter API Python SDK](https://docs.xquik.com/sdks/python) |
| Go | [x-twitter-scraper-go](https://github.com/Xquik-dev/x-twitter-scraper-go) | [pkg.go.dev](https://pkg.go.dev/github.com/Xquik-dev/x-twitter-scraper-go) | [Twitter API Go SDK](https://docs.xquik.com/sdks/go) |
| Java | [x-twitter-scraper-java](https://github.com/Xquik-dev/x-twitter-scraper-java) | [Maven Central](https://central.sonatype.com/artifact/com.xquik.api/x-twitter-scraper-java) | [Twitter API Java SDK](https://docs.xquik.com/sdks/java) |
| Kotlin | [x-twitter-scraper-kotlin](https://github.com/Xquik-dev/x-twitter-scraper-kotlin) | [Maven Central](https://central.sonatype.com/artifact/com.xquik.api/x-twitter-scraper-kotlin) | [Twitter API Kotlin SDK](https://docs.xquik.com/sdks/kotlin) |
| C# / .NET | [x-twitter-scraper-csharp](https://github.com/Xquik-dev/x-twitter-scraper-csharp) | [NuGet](https://www.nuget.org/packages/XTwitterScraper) | [Twitter API C# SDK](https://docs.xquik.com/sdks/csharp-x-api-sdk) |
| PHP | [x-twitter-scraper-php](https://github.com/Xquik-dev/x-twitter-scraper-php) | [Packagist](https://packagist.org/packages/xquik/x-twitter-scraper) | [Twitter API PHP SDK](https://docs.xquik.com/sdks/php) |
| Ruby | [x-twitter-scraper-ruby](https://github.com/Xquik-dev/x-twitter-scraper-ruby) | [RubyGems](https://rubygems.org/gems/x-twitter-scraper) | [Twitter API Ruby SDK](https://docs.xquik.com/sdks/ruby) |
| CLI | [x-twitter-scraper-cli](https://github.com/Xquik-dev/x-twitter-scraper-cli) | [pkg.go.dev](https://pkg.go.dev/github.com/Xquik-dev/x-twitter-scraper-cli) | [Twitter CLI](https://docs.xquik.com/sdks/cli) |
| Terraform | [terraform-provider-x-twitter-scraper](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper) | [Terraform Registry](https://registry.terraform.io/providers/Xquik-dev/x-twitter-scraper/latest) | [Terraform provider](https://docs.xquik.com/sdks/terraform) |

## Twitter MCP server for AI agents

Connect any MCP client to the hosted Xquik server at `https://xquik.com/mcp`.
Install the Xquik Skill with `npx skills add Xquik-dev/x-twitter-scraper`.

- [MCP server overview](https://docs.xquik.com/mcp/overview)
- [Coding-agent MCP setup](https://docs.xquik.com/mcp/coding-agents)
- [MCP tools reference](https://docs.xquik.com/mcp/tools)
- [ChatGPT setup guide](https://docs.xquik.com/mcp/chatgpt)
- [MCP server card](https://xquik.com/.well-known/mcp/server-card.json)
- [Official MCP Registry entry](https://registry.modelcontextprotocol.io/v0.1/servers/com.xquik%2Fmcp/versions/latest)
- [xquik-mcp server and agent plugin](https://github.com/Xquik-dev/xquik-mcp)
- [Xquik Agent Skill and plugin bundle](https://github.com/Xquik-dev/x-twitter-scraper)
- [x-developer package on npm](https://www.npmjs.com/package/x-developer)

## Agent and workflow integrations

| Repository | Integration | Learn more |
| --- | --- | --- |
| [x-twitter-scraper](https://github.com/Xquik-dev/x-twitter-scraper) | Agent Skill and plugin bundle | [Xquik Skill](https://docs.xquik.com/skill.md) |
| [xquik-mcp](https://github.com/Xquik-dev/xquik-mcp) | MCP server and agent plugin | [MCP server overview](https://docs.xquik.com/mcp/overview) |
| [tweetclaw](https://github.com/Xquik-dev/tweetclaw) | OpenClaw | [TweetClaw guide](https://docs.xquik.com/guides/tweetclaw) |
| [hermes-tweet](https://github.com/Xquik-dev/hermes-tweet) | Hermes Agent | [Hermes Tweet guide](https://docs.xquik.com/guides/hermes-tweet) |
| [n8n-nodes-xquik](https://github.com/Xquik-dev/n8n-nodes-xquik) | n8n | [n8n guide](https://docs.xquik.com/guides/n8n) |
| [prefect-xquik](https://github.com/Xquik-dev/prefect-xquik) | Prefect | [Prefect guide](https://docs.xquik.com/guides/prefect) |
| [xquik-haystack](https://github.com/Xquik-dev/xquik-haystack) | Haystack | [Haystack guide](https://docs.xquik.com/guides/haystack) |
| [paperclip-plugin-xquik](https://github.com/Xquik-dev/paperclip-plugin-xquik) | Paperclip | [Paperclip plugin on npm](https://www.npmjs.com/package/@xquik/paperclip-plugin-xquik) |
| [xquik-supabase](https://github.com/Xquik-dev/xquik-supabase) | Supabase | [Supabase guide](https://docs.xquik.com/guides/supabase) |
| [xquik-convex](https://github.com/Xquik-dev/xquik-convex) | Convex | [Convex guide](https://docs.xquik.com/guides/convex) |
| [xquik-vscode](https://github.com/Xquik-dev/xquik-vscode) | VS Code, VSCodium, Cursor & Windsurf | [Coding-agent MCP setup](https://docs.xquik.com/mcp/coding-agents) |
| [xquik-raycast](https://github.com/Xquik-dev/xquik-raycast) | Raycast | [Xquik docs](https://docs.xquik.com) |
| [strapi-plugin-xquik](https://github.com/Xquik-dev/strapi-plugin-xquik) | Strapi 5 | [API reference](https://docs.xquik.com/api-reference/overview) |

Follow a guide for your agent framework or no-code tool.

- [LangChain guide](https://docs.xquik.com/guides/langchain)
- [CrewAI guide](https://docs.xquik.com/guides/crewai)
- [AG2 guide](https://docs.xquik.com/guides/ag2)
- [Pydantic AI guide](https://docs.xquik.com/guides/pydantic-ai)
- [Google ADK guide](https://docs.xquik.com/guides/google-adk)
- [Mastra guide](https://docs.xquik.com/guides/mastra)
- [Microsoft Agent Framework guide](https://docs.xquik.com/guides/microsoft-agent-framework)
- [Zapier guide](https://docs.xquik.com/guides/zapier)
- [Make guide](https://docs.xquik.com/guides/make)
- [Pipedream guide](https://docs.xquik.com/guides/pipedream)

## Apify Actors

Run Xquik's X scrapers and monitors as Actors on Apify.
Browse all of them on the [Xquik Apify profile](https://apify.com/xquik).

- [X (Twitter) Tweet Scraper](https://apify.com/xquik/x-tweet-scraper)
- [X (Twitter) Followers Scraper](https://apify.com/xquik/x-follower-scraper)
- [X (Twitter) Profile Scraper](https://apify.com/xquik/x-profile-scraper)
- [X (Twitter) Replies Scraper](https://apify.com/xquik/x-reply-scraper)
- [X (Twitter) Engagement Scraper](https://apify.com/xquik/x-engagement-scraper)
- [X (Twitter) User Search](https://apify.com/xquik/x-user-search-scraper)
- [X (Twitter) Account Location](https://apify.com/xquik/x-account-location-scraper)
- [X (Twitter) Email Scraper](https://apify.com/xquik/x-email-scraper)
- [X (Twitter) Article Scraper](https://apify.com/xquik/x-article-scraper)
- [X (Twitter) Trends Scraper](https://apify.com/xquik/x-trends-scraper)
- [X (Twitter) Quotes Scraper](https://apify.com/xquik/x-quote-tweets-scraper)
- [X (Twitter) Communities Scraper](https://apify.com/xquik/x-community-scraper)
- [X (Twitter) Video Downloader](https://apify.com/xquik/x-media-downloader)
- [X (Twitter) List Scraper](https://apify.com/xquik/x-list-scraper)
- [X (Twitter) Space Scraper](https://apify.com/xquik/x-space-scraper)
- [X (Twitter) Stock & Crypto AI Trading Signals](https://apify.com/xquik/x-twitter-stock-crypto-signals)
- [X (Twitter) to Discord Bot](https://apify.com/xquik/x-twitter-to-discord)
- [X (Twitter) Follower Tracker](https://apify.com/xquik/x-twitter-follower-tracker)
- [X (Twitter) Post Tracker](https://apify.com/xquik/x-twitter-post-tracker)
- [X (Twitter) Tweet Viral Score Analyzer with AI](https://apify.com/xquik/x-tweet-viral-score-analyzer)
- [X (Twitter) News Monitor with AI Analysis](https://apify.com/xquik/x-twitter-news-monitor)
- [X (Twitter) Brand Monitoring with AI Analysis](https://apify.com/xquik/x-twitter-brand-monitoring)
- [X (Twitter) Jobs Scraper](https://apify.com/xquik/x-job-scraper)
- [X (Twitter) Monitor](https://apify.com/xquik/x-twitter-monitor)
- [X (Twitter) Crypto Tracker](https://apify.com/xquik/x-twitter-crypto-tracker)
- [X (Twitter) Tweet Sentiment Analysis with AI](https://apify.com/xquik/x-tweet-sentiment-analysis)
- [X (Twitter) Tweet Classifier with AI Analysis](https://apify.com/xquik/x-twitter-tweet-classifier)

## RapidAPI APIs

Call Xquik from RapidAPI with your RapidAPI key.

- [X Tweet Scraper API](https://rapidapi.com/xquik-xquik-default/api/x-tweet-scraper-api)
- [X (Twitter) Search API](https://rapidapi.com/xquik-xquik-default/api/x-twitter-search-api)
- [X (Twitter) API](https://rapidapi.com/xquik-xquik-default/api/x-twitter-api4)
- [X (Twitter) Profile Scraper API](https://rapidapi.com/xquik-xquik-default/api/x-twitter-profile-scraper-api)
- [X Tweet Reply Scraper API](https://rapidapi.com/xquik-xquik-default/api/x-tweet-reply-scraper-api)
- [X Follower Scraper API](https://rapidapi.com/xquik-xquik-default/api/x-follower-scraper-api)
- [X (Twitter) Media Downloader API](https://rapidapi.com/xquik-xquik-default/api/x-twitter-media-downloader-api)
- [X (Twitter) Trends API](https://rapidapi.com/xquik-xquik-default/api/x-twitter-trends-api)

## Postman collection and OpenAPI

- [Xquik REST API collection on Postman](https://documenter.getpostman.com/view/12709954/2sBY4TpxXK)
- [OpenAPI 3.1 schema](https://xquik.com/openapi.json)

## Marketplaces and registries

### Agent and MCP registries

| Registry | Listing |
| --- | --- |
| Official MCP Registry | [com.xquik/mcp](https://registry.modelcontextprotocol.io/v0.1/servers/com.xquik%2Fmcp/versions/latest) |
| Glama | [Xquik MCP connector](https://glama.ai/mcp/connectors/com.xquik/mcp), [Xquik MCP server](https://glama.ai/mcp/servers/Xquik-dev/x-twitter-scraper) |
| MCP Market | [Xquik on MCP Market](https://mcpmarket.com/server/x-twitter-scraper) |
| Awesome MCP Servers | [Xquik on mcpservers.org](https://mcpservers.org/servers/xquik-dev/x-twitter-scraper), [Xquik MCP Server](https://mcpservers.org/servers/docs-xquik-com-mcp-overview) |
| Corsair | [Xquik MCP server](https://corsair.dev/integrations/xquik) |
| Willow | [Xquik MCP server](https://withwillow.ai/marketplace/connectors/com-xquik-mcp) |
| MuleSoft Anypoint Exchange | [Xquik MCP server](https://anypoint.mulesoft.com/exchange/68e53915-e89b-4e82-b794-12d37982db4c/xquik-asset/) |
| skills.sh | [Xquik Skills](https://skills.sh/xquik-dev/x-twitter-scraper) |
| ClawHub | [Xquik publisher page](https://clawhub.ai/xquik), [TweetClaw plugin](https://clawhub.ai/xquik/plugins/tweetclaw), [Hermes Tweet plugin](https://clawhub.ai/xquik/plugins/hermes-tweet) |
| TanStack Intent | [Xquik Skills](https://tanstack.com/intent/registry/x-developer/x-twitter-scraper) |
| Context7 | [Xquik Skill docs](https://context7.com/xquik-dev/x-twitter-scraper) |
| DeepWiki | [Xquik wiki](https://deepwiki.com/Xquik-dev/x-twitter-scraper) |

### MCP, API and agent directories

- [agentlaunch](https://agents-launch.lovable.app/agents/xquik)
- [AgentLocker](https://agentlocker.ai/agent/xquik)
- [ALLAGENTS](https://allagents.app/agent/xquik)
- [API Tracker](https://apitracker.io/mcp-server/registry/com.xquik%2Fmcp)
- [APIs.io](https://apis.io/apis/xquik-api/xquik-api-lists-api/)
- [APIsList](https://apislist.com/api/2591/xquik-api)
- [DReview](https://dreview.co/tools/xquik-e1rbp)
- [Launch MCP](https://launchmcp.co/mcp/servers/Xquik-dev/x-twitter-scraper)
- [MCP Find](https://www.mcpfind.org/servers/xquik)
- [MCP Server Spot](https://mcpserverspot.com/servers/xquik-mcp-server)
- [mcp.tc](https://mcp.tc/i/xquik)
- [MCPBundles](https://www.mcpbundles.com/skills/xquik-mcp)
- [TrillionAgent](https://trillionagent.com/agents/xquik-1047)

### Workflow and framework marketplaces

| Platform | Listing |
| --- | --- |
| Apify Store | [Xquik Actors](https://apify.com/xquik) |
| RapidAPI | [X Tweet Scraper API](https://rapidapi.com/xquik-xquik-default/api/x-tweet-scraper-api) |
| Pipedream | [Xquik app](https://pipedream.com/apps/xquik) |
| Convex Components Directory | [Xquik component](https://www.convex.dev/components/convex-xquik) |
| Haystack integrations | [Xquik integration](https://haystack.deepset.ai/integrations/xquik) |
| Activepieces | [Xquik piece](https://www.activepieces.com/pieces/xquik) |
| Kestra | [Xquik plugin](https://kestra.io/plugins/plugin-xquik) |
| Flows360 | [Xquik integration docs](https://www.flows360.co/docs/xquik/) |
| AG2 | [Xquik Tweet Search tool](https://docs.ag2.ai/docs/user-guide/extensions/tools/search/xquik/) |

### Integration packages

| Registry | Packages |
| --- | --- |
| npm | [@xquik/tweetclaw](https://www.npmjs.com/package/@xquik/tweetclaw), [n8n-nodes-xquik](https://www.npmjs.com/package/n8n-nodes-xquik), [@xquik/paperclip-plugin-xquik](https://www.npmjs.com/package/@xquik/paperclip-plugin-xquik), [xquik-convex](https://www.npmjs.com/package/xquik-convex), [x-developer](https://www.npmjs.com/package/x-developer) |
| PyPI | [prefect-xquik](https://pypi.org/project/prefect-xquik/), [xquik-haystack](https://pypi.org/project/xquik-haystack/), [hermes-tweet](https://pypi.org/project/hermes-tweet/) |

<details>
<summary>More directories that list Xquik</summary>

- [AI Toolboard](https://aitoolboard.com/tools/xquik)
- [AI Tools Capital](https://aitoolscapital.com/tools/xquik)
- [AIBuilder Marketplace](https://aibuildermarketplace.com/marketplace/xquik/)
- [AIComing](https://aicoming.net/tool/xquik-com)
- [AISO Tools](https://aisotools.com/tool/xquik)
- [Attest](https://getattest.com.au/t/xquik)
- [CitableHub](https://citablehub.com/p/xquik)
- [Clapstorm](https://www.clapstorm.com/p/xquik)
- [DigitalDany](https://digitaldany.com/saas/xquik/)
- [Directory Index](https://directory-index.com/technology/xquik/)
- [directree](https://www.directree.io/tool/xquik)
- [Dynamite AI](https://www.dynamite-ai.com/tools/xquik)
- [FindSaaS Brazil](https://www.findsaas.com.br/saas/xquik)
- [Fstlaunch](https://fstlaunch.com/startups/xquik)
- [FutureStack](https://www.usefuturestack.com/tools/xquik)
- [FutureTools](https://futuretools.io/tools/xquik-3m7ga9)
- [HUNT0](https://hunt0.com/products/xquik)
- [IndieClash](https://www.indieclash.com/products/xquik)
- [IndieHackerStacks](https://indiehackerstacks.com/products/xquik)
- [Intelligent Tools](https://intelligenttools.co/tools/xquik)
- [KI-SUCHE](https://www.ki-suche.io/tools/xquik)
- [Launch AI](https://trylaunch.ai/launch/xquik)
- [LaunchAgentic](https://launchagentic.space/p/xquik)
- [LaunchSpot](https://www.launchspot.ai/products/xquik)
- [Listed Startups](https://listedstartups.com/companies/xquik)
- [MadeWithStack](https://www.madewithstack.com/product/xquik)
- [Nav4AI](https://nav4ai.com/tool/xquik)
- [NAVS](https://navs.site/website/xquik)
- [NextGenTools](https://nextgentools.me/xquik)
- [Offo](https://offo.dev/tools/xquik-com)
- [OpenFuture AI](https://openfuture.ai/tool/xquik)
- [OpenUpvote](https://openupvote.com/project/xquik)
- [PeerPush](https://peerpush.com/p/xquik)
- [ProductWatch](https://productwatch.io/products/xquik)
- [Shipyard HQ](https://shipyardhq.dev/products/xquik)
- [SideProjects](https://sideprojects.net/projects/xquik)
- [Software for Marketers](https://softwareformarketers.com/tools/xquik)
- [SpacerrApps](https://spacerrapps.com/apps/xquik)
- [TechDirectory](https://www.techdirectory.io/software/xquik)
- [The Hack Stack](https://thehackstack.com/s/xquik/)
- [TinyLaunch](https://www.tinylaunch.com/launch/19790-xquik)
- [TinyShelf](https://www.tinyshelf.co/tools/xquik)
- [Tolodora](https://tolodora.com/software/xquik)
- [Tools AI Online](https://www.tools-ai.online/tool/xquik-2)
- [ToolsNoCode](https://toolsnocode.com/tools/xquik)

</details>

<!-- trust:start -->

## Trust & usage

[![Twitter API package downloads](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fdownloads.json)](https://xquik.com/trust#downloads)
[![Twitter scraper users on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-users.json)](https://apify.com/xquik)
[![Twitter scraper runs on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-runs.json)](https://apify.com/xquik)
[![Tweet scraper rating on Apify](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fapify-rating.json)](https://apify.com/xquik/x-tweet-scraper/reviews)
[![Xquik Twitter API accounts](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Faccounts.json)](https://xquik.com/trust#accounts)
[![Twitter Skill installs](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fskill-installs.json)](https://xquik.com/trust#skill-installs)
[![Twitter API p99 server read time](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Frest-p99.json)](https://xquik.com/trust#speed)
[![Xquik GitHub stars](https://img.shields.io/endpoint?url=https%3A%2F%2Fxquik.com%2Fbadges%2Fgithub-stars.json)](https://github.com/Xquik-dev)

- 55,000+ downloads of Xquik's Twitter API packages on npm, PyPI, RubyGems, NuGet, Packagist & Terraform ([source](https://xquik.com/trust#downloads)) <!-- trust:downloads 55913 -->
- 10,000+ users of Xquik's Twitter scraper Actors on Apify ([source](https://apify.com/xquik)) <!-- trust:apify-users 10811 -->
- 7,700,000+ runs of Xquik's Twitter scraper Actors on Apify ([source](https://apify.com/xquik)) <!-- trust:apify-runs 7704456 -->
- 4.66 of 5 for the X Tweet Scraper from 16 Apify reviews ([source](https://apify.com/xquik/x-tweet-scraper/reviews)) <!-- trust:apify-rating 4.66 16 -->
- 4,200+ accounts on xquik.com ([source](https://xquik.com/trust#accounts)) <!-- trust:accounts 4206 -->
- 1,600+ installs of Xquik's Twitter Skills on skills.sh ([source](https://xquik.com/trust#skill-installs)) <!-- trust:skill-installs 1627 -->
- 12.7 s p99 REST API server read time over 7 days, failed reads included ([source](https://xquik.com/trust#speed)) <!-- trust:rest-p99 12634 -->
- 390+ GitHub stars across Xquik's repos ([source](https://github.com/Xquik-dev)) <!-- trust:github-stars 392 -->

Checked on 2026-11-03. See each number with its date & source on [xquik.com/trust](https://xquik.com/trust) or as [JSON](https://xquik.com/trust.json).

<!-- trust:end -->

## Discovery

- [AI-readable docs](https://docs.xquik.com/llms.txt)
- [Agent catalog](https://xquik.com/.well-known/agents.json)
- [Hosted Skill](https://xquik.com/.well-known/agent-skills/xquik/SKILL.md)
- [MCP discovery](https://xquik.com/.well-known/mcp.json)
- [MCP server card](https://xquik.com/.well-known/mcp/server-card.json)
- [OpenAPI schema](https://xquik.com/openapi.json)
- [Trust page](https://xquik.com/trust) and [trust data as JSON](https://xquik.com/trust.json)
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
