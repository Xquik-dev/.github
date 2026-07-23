# OpenSSF Best Practices Evidence

This register tracks OpenSSF Best Practices work across Xquik-dev.

It records project scope, live badge entries, shared evidence, and known gaps.

## Applicability

OpenSSF badges apply to FLOSS projects, not automatically to every repository.

OpenSSF defines project sites as supporting project development and dissemination.

See the official [criteria terminology](https://www.bestpractices.dev/en/criteria_discussion#terminology).

Xquik-dev has 17 standalone software projects with badge entries.

Two repositories serve those projects without separate releases:

- `.github` provides shared governance, policies, templates, and organization discovery.
- `xquik-docs` provides shared API, SDK, integration, and security documentation.

These repositories act as shared project sites and project-result sources.

They do not currently operate as independent released projects.

Create separate badge entries if either repository becomes independently released.

## Live Project Entries

All 17 project entries achieved Passing before July 23, 2026.

Use each live entry for current status and submitted evidence.

| Repository | Live Entry |
| --- | --- |
| `hermes-tweet` | [OpenSSF project 13725](https://www.bestpractices.dev/projects/13725) |
| `n8n-nodes-xquik` | [OpenSSF project 13726](https://www.bestpractices.dev/projects/13726) |
| `paperclip-plugin-xquik` | [OpenSSF project 13727](https://www.bestpractices.dev/projects/13727) |
| `prefect-xquik` | [OpenSSF project 13728](https://www.bestpractices.dev/projects/13728) |
| `terraform-provider-x-twitter-scraper` | [OpenSSF project 13729](https://www.bestpractices.dev/projects/13729) |
| `tweetclaw` | [OpenSSF project 13730](https://www.bestpractices.dev/projects/13730) |
| `x-twitter-scraper` | [OpenSSF project 13731](https://www.bestpractices.dev/projects/13731) |
| `x-twitter-scraper-cli` | [OpenSSF project 13732](https://www.bestpractices.dev/projects/13732) |
| `x-twitter-scraper-csharp` | [OpenSSF project 13733](https://www.bestpractices.dev/projects/13733) |
| `x-twitter-scraper-go` | [OpenSSF project 13734](https://www.bestpractices.dev/projects/13734) |
| `x-twitter-scraper-java` | [OpenSSF project 13735](https://www.bestpractices.dev/projects/13735) |
| `x-twitter-scraper-kotlin` | [OpenSSF project 13736](https://www.bestpractices.dev/projects/13736) |
| `x-twitter-scraper-php` | [OpenSSF project 13737](https://www.bestpractices.dev/projects/13737) |
| `x-twitter-scraper-python` | [OpenSSF project 13738](https://www.bestpractices.dev/projects/13738) |
| `x-twitter-scraper-ruby` | [OpenSSF project 13739](https://www.bestpractices.dev/projects/13739) |
| `x-twitter-scraper-typescript` | [OpenSSF project 13740](https://www.bestpractices.dev/projects/13740) |
| `xquik-haystack` | [OpenSSF project 13741](https://www.bestpractices.dev/projects/13741) |

## Shared Evidence

These documents support repository-specific badge evidence:

- [Contribution requirements and DCO](CONTRIBUTING.md)
- [Governance and public roles](GOVERNANCE.md)
- [Code review requirements](REVIEWING.md)
- [Vulnerability response process](SECURITY.md)
- [Code of Conduct](CODE_OF_CONDUCT.md)
- [Twelve-month roadmap](ROADMAP.md)

Repository-specific evidence must still prove the affected criterion.

## Verified Organization Controls

- GitHub requires two-factor authentication for organization members.
- Every public repository supports private vulnerability reporting.
- Seventeen standalone projects have current Passing badges.
- Seventeen standalone projects run required CI checks.

## Current Remediation Pull Requests

These pull requests implement repository-specific technical remediation.

Passing checks prove implementation, not independent review or default-branch adoption.

| Repository | Pull Request | Verified Scope |
| --- | --- | --- |
| `hermes-tweet` | [#610](https://github.com/Xquik-dev/hermes-tweet/pull/610) | License notices, tests, coverage, and package checks |
| `n8n-nodes-xquik` | [#11](https://github.com/Xquik-dev/n8n-nodes-xquik/pull/11) | License notices, tests, security checks, and reproducible packages |
| `paperclip-plugin-xquik` | [#4](https://github.com/Xquik-dev/paperclip-plugin-xquik/pull/4) | License notices, tests, security checks, and reproducible packages |
| `prefect-xquik` | [#15](https://github.com/Xquik-dev/prefect-xquik/pull/15) | License notices, tests, security checks, and reproducible packages |
| `terraform-provider-x-twitter-scraper` | [#11](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/pull/11) | Coverage, releases, security, documentation, and reproducible builds |
| `tweetclaw` | [#21](https://github.com/Xquik-dev/tweetclaw/pull/21) | Security boundaries, tests, coverage, and public disclosures |
| `x-twitter-scraper` | [#19](https://github.com/Xquik-dev/x-twitter-scraper/pull/19) | Coverage, licensing, security, reproducibility, and public disclosures |
| `x-twitter-scraper-cli` | [#13](https://github.com/Xquik-dev/x-twitter-scraper-cli/pull/13) | Coverage, cross-platform tests, licensing, releases, and public disclosures |
| `x-twitter-scraper-ruby` | [#17](https://github.com/Xquik-dev/x-twitter-scraper-ruby/pull/17) | Bounded RubyGems release verification |
| `xquik-haystack` | [#4](https://github.com/Xquik-dev/xquik-haystack/pull/4) | License notices, tests, and coverage |

Each pull request requires a different human reviewer before merging.

Do not count pending changes as default-branch evidence.

## README & Repository Metadata

All 19 public repository READMEs were audited on July 23, 2026.

All default branches contain the approved independence disclosure.

Fifteen default branches contain the exact unformatted footer.

Four pending pull requests add that exact footer:

- [Terraform provider #11](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/pull/11)
- [TweetClaw #21](https://github.com/Xquik-dev/tweetclaw/pull/21)
- [Core Skill and MCP package #19](https://github.com/Xquik-dev/x-twitter-scraper/pull/19)
- [CLI #13](https://github.com/Xquik-dev/x-twitter-scraper-cli/pull/13)

All repository descriptions identify their supported purpose.

All descriptions include the compact independence notice.

Topics remain specific to supported languages, workflows, and customer tasks.

## Known Gold Gaps

The organization currently has one member.

It does not yet meet these Gold requirements:

- A bus factor of 2 or more.
- Two unassociated significant contributors per project.
- Verifiable independent review for 50% of released modifications.
- A human security review completed within the last 5 years.

Open remediation pull requests cannot satisfy these human requirements.

These areas still need repository-specific verification:

- Per-file copyright and license notices on default branches.
- Reproducible builds.
- Statement coverage of at least 90%.
- Branch coverage when a suitable FLOSS tool exists.
- Signed release verification.
- Architecture, threat model, and assurance evidence.
- Dynamic analysis before major releases.

Never mark a criterion as met without current public evidence.

Review this register after repository, badge, or criteria changes.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
