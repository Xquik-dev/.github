# Six-month regression-test evidence

This register supports the OpenSSF Gold `regression_tests_added50` criterion.

The snapshot date is July 25, 2026.
The review window starts January 24, 2026.

## Counting rules

Count one defect for each distinct, project-owned root cause.
Use a public fix, pull request, issue, or changelog as evidence.
Count fixes made after a public release.

Include defects affecting shipped code, packages, installation, or builds.
Exclude features, refactors, documentation-only changes, and CI-only maintenance.
Exclude dependency updates without a demonstrated project defect.
Exclude imported upstream history before Xquik adopted the project.

Count a regression when an automated check detects the defect's return.
The check must run through the repository's documented test or validation path.
Later regression coverage may protect an earlier fix.

Use `N/A` only when the six-month denominator is zero.
Do not count pending pull-request evidence until merge.

## Current ratios

| Project | Fixed bugs | Guarded bugs | Ratio | Default-branch result |
| --- | ---: | ---: | ---: | --- |
| `hermes-tweet` | 2 | 2 | 100% | Met |
| `n8n-nodes-xquik` | 0 | 0 | N/A | N/A |
| `paperclip-plugin-xquik` | 0 | 0 | N/A | N/A |
| `prefect-xquik` | 1 | 1 | 100% | Met |
| `terraform-provider-x-twitter-scraper` | 2 | 2 | 100% | Met |
| `tweetclaw` | 3 | 2 | 66.7% | Met |
| `x-twitter-scraper` | 10 | 10 | 100% | Met |
| `x-twitter-scraper-cli` | 8 | 8 | 100% | Met |
| `x-twitter-scraper-csharp` | 3 | 3 | 100% | Met |
| `x-twitter-scraper-go` | 2 | 2 | 100% | Met |
| `x-twitter-scraper-java` | 1 | 1 | 100% | Met |
| `x-twitter-scraper-kotlin` | 2 | 2 | 100% | Met |
| `x-twitter-scraper-php` | 4 | 4 | 100% | Met |
| `x-twitter-scraper-python` | 2 | 2 | 100% | Met |
| `x-twitter-scraper-ruby` | 5 | 4 | 80% | Met |
| `x-twitter-scraper-typescript` | 3 | 3 | 100% | Met |
| `xquik-haystack` | 1 | 1 | 100% | Met |

## Project evidence

### Hermes Tweet

Count these 2 fixes:

- [Restore the marketplace grade](https://github.com/Xquik-dev/hermes-tweet/pull/595).
- [Align the agent-readable catalog](https://github.com/Xquik-dev/hermes-tweet/pull/608).

These tests protect both fixes:

- [Marketplace contract tests](https://github.com/Xquik-dev/hermes-tweet/blob/master/tests/test_metadata.py).
- [Catalog behavior tests](https://github.com/Xquik-dev/hermes-tweet/blob/master/tests/test_catalog.py).
- [Public safety tests](https://github.com/Xquik-dev/hermes-tweet/blob/master/tests/test_public_safety.py).

The ratio is 2 of 2.

### n8n nodes

No qualifying released product defect was fixed during this window.
Changes affected features, dependencies, documentation, or release automation.

The ratio is `N/A`.

### Paperclip plugin

No qualifying released product defect was fixed during this window.
The deprecated action change only affected the CI workflow.

The ratio is `N/A`.

### Prefect collection

Count the [default API host fix](https://github.com/Xquik-dev/prefect-xquik/commit/fa1b8db660f9c2530dc8c4c140618b34d16c6216).

These tests preserve the public host:

- [Client default-host test](https://github.com/Xquik-dev/prefect-xquik/blob/main/tests/test_client.py).
- [Credentials default-host test](https://github.com/Xquik-dev/prefect-xquik/blob/main/tests/test_credentials.py).

The ratio is 1 of 1.

### Terraform provider

Count these 2 fixes:

- [Remove the stale integration](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/commit/8fe251402e2f2170a8b0f222bf19d44241dc1cc1).
- [Make the JSON cache concurrency-safe](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/commit/7b3e09a8e87fe5a380a0809b8bf97e0495b6adfe).

These tests protect both fixes:

- [Registered provider tests](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/blob/main/internal/provider_coverage_test.go).
- [JSON concurrency regression](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/blob/main/internal/apijson/concurrency_test.go).

The ratio is 2 of 2.

### TweetClaw

Count these 3 fixes:

- [Eliminate package backup races](https://github.com/Xquik-dev/tweetclaw/pull/18).
- [Fix public API contract drift](https://github.com/Xquik-dev/tweetclaw/pull/23).
- [Patch the Hono Node server](https://github.com/Xquik-dev/tweetclaw/pull/24).

These checks protect the first 2 fixes:

- [Package artifact validator](https://github.com/Xquik-dev/tweetclaw/blob/master/scripts/check-package-artifact.mjs).
- [API specification tests](https://github.com/Xquik-dev/tweetclaw/blob/master/tests/api-spec.test.ts).
- [Request contract tests](https://github.com/Xquik-dev/tweetclaw/blob/master/tests/request.test.ts).

The dependency-only Hono patch lacks a focused regression.
The ratio is 2 of 3.

### Skill & plugin bundle

Count 10 shipped package defects:

- [Add package audit files](https://github.com/Xquik-dev/x-twitter-scraper/commit/56bad11881326fdcc7e593dbf2b263e16fb9607d).
- [Add Skill audit files](https://github.com/Xquik-dev/x-twitter-scraper/commit/aba2900e83ab37e44c193465189d9b96920ac2af).
- [Skill safety metadata](https://github.com/Xquik-dev/x-twitter-scraper/commit/7936541f7605bf826a0da01df0e08604804405af).
- [Skill references](https://github.com/Xquik-dev/x-twitter-scraper/commit/55d103756e8a1d50aceccef7d96229efe072701c).
- [Claude plugin MCP configuration](https://github.com/Xquik-dev/x-twitter-scraper/commit/da7a6d1bdbfdf5df8c78dff9554e2b8fadd103d5).
- [Skill frontmatter](https://github.com/Xquik-dev/x-twitter-scraper/commit/3ab22fb664cc2a0cb3a5da450a29dafbc2fd8573).
- [Skill bundle correctness](https://github.com/Xquik-dev/x-twitter-scraper/commit/ac7c9f1a1f5e6798c69907e15e15effdbc8a3046).
- [Marketplace validation](https://github.com/Xquik-dev/x-twitter-scraper/commit/8a94746f45260c3a08dcbc42ca2d03a046359fb1).
- [Public MCP contract](https://github.com/Xquik-dev/x-twitter-scraper/pull/16).
- [MCP registry metadata](https://github.com/Xquik-dev/x-twitter-scraper/pull/17).

These tests protect all 10 package contracts:

- [Package guard integration test](https://github.com/Xquik-dev/x-twitter-scraper/blob/master/tests/package-guard.test.mjs).
- [Frontmatter parser tests](https://github.com/Xquik-dev/x-twitter-scraper/blob/master/tests/frontmatter.test.mjs).
- [Local server contract tests](https://github.com/Xquik-dev/x-twitter-scraper/blob/master/tests/stub-server.test.mjs).

The ratio is 10 of 10.

### CLI

Count 4 released formatting defects:

- Empty explore results.
- Raw JSON item iteration.
- Raw output with transforms.
- Non-TTY explore fallback.

The [CLI changelog](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/CHANGELOG.md) records these fixes.

Count 4 later correctness defects:

- Custom exit handling.
- Wrapped Unix connection closure.
- Typed empty environment values.
- Signed and unsigned 8-bit query encoding.

[OpenSSF quality-gate PR #13](https://github.com/Xquik-dev/x-twitter-scraper-cli/pull/13) records these fixes.

These tests protect all 8 defects:

- [Explorer regressions](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/internal/jsonview/explorer_test.go).
- [Output formatting regressions](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/pkg/cmd/cmdutil_test.go).
- [Unix connection regressions](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/pkg/cmd/cmdutil_unix_test.go).
- [Environment parsing regressions](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/internal/requestflag/requestflag_test.go).
- [Query encoding regressions](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/internal/apiquery/coverage_test.go).
- [Exit handling regressions](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/cmd/x-twitter-scraper/main_test.go).

The ratio is 8 of 8.

### C# SDK

Count these 3 runtime defects:

- Response enumeration ignored cancellation.
- The default `HttpClient` timeout conflicted with SDK timeouts.
- Null-only scorer weights failed deserialization.

The [C# changelog](https://github.com/Xquik-dev/x-twitter-scraper-csharp/blob/main/CHANGELOG.md) records these fixes.

These tests protect all 3 defects:

- [HTTP response cancellation tests](https://github.com/Xquik-dev/x-twitter-scraper-csharp/blob/main/src/XTwitterScraper.Tests/Core/HttpResponseTest.cs).
- [Client timeout tests](https://github.com/Xquik-dev/x-twitter-scraper-csharp/blob/main/src/XTwitterScraper.Tests/Core/ClientOptionsTest.cs).
- [Compose response tests](https://github.com/Xquik-dev/x-twitter-scraper-csharp/blob/main/src/XTwitterScraper.Tests/Models/Compose/ComposeCreateResponseTest.cs).

The ratio is 3 of 3.

### Go SDK

Count these 2 fixes:

- [Resolve the generated import cycle](https://github.com/Xquik-dev/x-twitter-scraper-go/commit/4188d03924c0b7c9072ec4095efe54bf9056d094).
- [Make diagnostic dumps concurrency-safe](https://github.com/Xquik-dev/x-twitter-scraper-go/commit/6c35deb74fab127bcde9947c0a915e90dbad067b).

These tests protect both fixes:

- [Generated model contract tests](https://github.com/Xquik-dev/x-twitter-scraper-go/blob/main/model_json_test.go).
- [Diagnostic concurrency tests](https://github.com/Xquik-dev/x-twitter-scraper-go/blob/main/internal/apierror/apierror_test.go).

The ratio is 2 of 2.

### Java SDK

Count the [Java 26 shrinker fix](https://github.com/Xquik-dev/x-twitter-scraper-java/commit/00d54a6b8045c97ba497910960c6004a48cff90d).

The [ProGuard compatibility test](https://github.com/Xquik-dev/x-twitter-scraper-java/blob/main/x-twitter-scraper-java-proguard-test/src/test/kotlin/com/x_twitter_scraper/api/proguard/ProGuardCompatibilityTest.kt) protects it.

The ratio is 1 of 1.

### Kotlin SDK

Count these 2 fixes:

- [Kotlin 26 shrinker compatibility](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/commit/62b77cbcf226a5940491daee18ed7f496609f2c4).
- [Generated SDK buildability](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/commit/a2ff6517753db2724fbdbdd3b98a76171f222c39).

These tests protect both fixes:

- [ProGuard compatibility test](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/blob/main/x-twitter-scraper-kotlin-proguard-test/src/test/kotlin/com/x_twitter_scraper/api/proguard/ProGuardCompatibilityTest.kt).
- [Compose request tests](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/blob/main/x-twitter-scraper-kotlin-core/src/test/kotlin/com/x_twitter_scraper/api/models/compose/ComposeCreateParamsTest.kt).
- [Compose response tests](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/blob/main/x-twitter-scraper-kotlin-core/src/test/kotlin/com/x_twitter_scraper/api/models/compose/ComposeCreateResponseTest.kt).

The ratio is 2 of 2.

### PHP SDK

Count 4 released runtime defects:

- Guzzle streaming activation.
- File parameter generation.
- Union and enum serialization.
- Enum-typed property hydration.

The [PHP changelog](https://github.com/Xquik-dev/x-twitter-scraper-php/blob/main/CHANGELOG.md) records these fixes.

These tests protect all 4 defects:

- [Streaming transport tests](https://github.com/Xquik-dev/x-twitter-scraper-php/blob/main/tests/Core/StreamingTransportTest.php).
- [Streaming client tests](https://github.com/Xquik-dev/x-twitter-scraper-php/blob/main/tests/Core/StreamingHttpClientTest.php).
- [File parameter tests](https://github.com/Xquik-dev/x-twitter-scraper-php/blob/main/tests/Core/FileParamTest.php).
- [Conversion tests](https://github.com/Xquik-dev/x-twitter-scraper-php/blob/main/tests/Core/ConversionTest.php).
- [Model serialization tests](https://github.com/Xquik-dev/x-twitter-scraper-php/blob/main/tests/Core/ModelTest.php).

The ratio is 4 of 4.

### Python SDK

Count 2 released runtime defects:

- Preserve hardcoded query parameters.
- Send file data once.

The [Python changelog](https://github.com/Xquik-dev/x-twitter-scraper-python/blob/main/CHANGELOG.md) records these fixes.

These tests protect both defects:

- [Query parameter regressions](https://github.com/Xquik-dev/x-twitter-scraper-python/blob/main/tests/test_client.py).
- [File extraction regressions](https://github.com/Xquik-dev/x-twitter-scraper-python/blob/main/tests/test_extract_files.py).

The ratio is 2 of 2.

### Ruby SDK

Count 5 released runtime or installation defects:

- RFC 3986 path encoding.
- A runtime variable typo.
- Bodyless request content types.
- Ruby 4 `base64` installation.
- Content-type parsing.

The [Ruby changelog](https://github.com/Xquik-dev/x-twitter-scraper-ruby/blob/main/CHANGELOG.md) records these fixes.

These checks protect 4 defects:

- [Client request regressions](https://github.com/Xquik-dev/x-twitter-scraper-ruby/blob/main/test/x_twitter_scraper/client_test.rb).
- [Content-type regressions](https://github.com/Xquik-dev/x-twitter-scraper-ruby/blob/main/test/x_twitter_scraper/internal/util_test.rb).
- [Edge-case regressions](https://github.com/Xquik-dev/x-twitter-scraper-ruby/blob/main/test/x_twitter_scraper/internal/edge_cases_test.rb).
- Ruby 4 CI exercises the declared runtime dependency.

The historical variable typo lacks a focused regression.
The ratio is 4 of 5.

### TypeScript SDK

Count 3 released package defects:

- Guest wallet Bearer authentication.
- Missing npm bug-tracker metadata.
- The stale integrations resource.

The [TypeScript changelog](https://github.com/Xquik-dev/x-twitter-scraper-typescript/blob/main/CHANGELOG.md) records these fixes.

[Client authentication tests](https://github.com/Xquik-dev/x-twitter-scraper-typescript/blob/main/tests/index.test.ts) protect the first defect.

[PR #18](https://github.com/Xquik-dev/x-twitter-scraper-typescript/pull/18) protects the other 2 defects.

The ratio is 3 of 3.

### Haystack integration

Count the [installed Twine invocation fix](https://github.com/Xquik-dev/xquik-haystack/commit/1b49376f0d7b62b4feffe4c64a1f5cefe4959f0f).

[PR #4](https://github.com/Xquik-dev/xquik-haystack/pull/4) adds its regression assertion.

The ratio is 1 of 1.

## Shared project sites

The `.github` repository provides shared organization evidence.
The `xquik-docs` repository provides shared project documentation.

Neither repository has an independent release lifecycle.
Neither repository has a separate OpenSSF project entry.
Their fixes belong to the affected software projects.

## Maintenance

Recalculate this register after each qualifying bug fix.
Recalculate it monthly when work remains active.
Move the start date forward with each snapshot.
Keep merged evidence separate from pending evidence.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
