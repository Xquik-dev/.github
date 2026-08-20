# Debug-information preservation evidence

This register supports the OpenSSF Gold `build_preserve_debug` criterion.

The snapshot date is July 25, 2026.

This register covers all 17 standalone software projects.

OpenSSF asks build systems to preserve requested debug information.

See the official [Gold criterion](https://www.bestpractices.dev/en/criteria?details=true&rationale=true#build_preserve_debug).

Do not count pending changes as default-branch evidence.

## Current assessment

| Project | Result | Public evidence | Preserved debug context |
| --- | --- | --- | --- |
| `hermes-tweet` | Met | [Python package configuration](https://github.com/Xquik-dev/hermes-tweet/blob/master/pyproject.toml) | The wheel preserves Python sources. No stripping step exists. |
| `n8n-nodes-xquik` | Met | [TypeScript build configuration](https://github.com/Xquik-dev/n8n-nodes-xquik/blob/main/tsconfig.json) | TypeScript emits source maps into the published `dist` directory. |
| `paperclip-plugin-xquik` | Met | [esbuild configuration](https://github.com/Xquik-dev/paperclip-plugin-xquik/blob/main/esbuild.config.mjs) | esbuild emits source maps with both published bundles. |
| `prefect-xquik` | Met | [Python package configuration](https://github.com/Xquik-dev/prefect-xquik/blob/main/pyproject.toml) | The wheel preserves Python sources. No stripping step exists. |
| `terraform-provider-x-twitter-scraper` | Met | [Release configuration](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/blob/main/.goreleaser.yml) and [debug check](https://github.com/Xquik-dev/terraform-provider-x-twitter-scraper/blob/main/bin/check-release-debug-info) | GoReleaser retains DWARF data. Required CI verifies the release binary. |
| `tweetclaw` | Met | [TypeScript build configuration](https://github.com/Xquik-dev/tweetclaw/blob/master/tsconfig.json) | TypeScript emits source maps into the published `dist` directory. |
| `x-twitter-scraper` | Met | [Published package configuration](https://github.com/Xquik-dev/x-twitter-scraper/blob/master/package.json) | npm installs source assets directly. No stripping step exists. |
| `x-twitter-scraper-cli` | Met | [Release configuration](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/.goreleaser.yml) and [debug check](https://github.com/Xquik-dev/x-twitter-scraper-cli/blob/main/bin/check-release-debug-info) | GoReleaser retains DWARF data. Required CI verifies the release binary. |
| `x-twitter-scraper-csharp` | Met | [.NET build properties](https://github.com/Xquik-dev/x-twitter-scraper-csharp/blob/main/src/Directory.Build.props) | Release packages include symbols with embedded debug information. |
| `x-twitter-scraper-go` | Met | [Go build check](https://github.com/Xquik-dev/x-twitter-scraper-go/blob/main/scripts/lint) | `go build` honors `GOFLAGS` and does not strip output. |
| `x-twitter-scraper-java` | Met | [JVM build configuration](https://github.com/Xquik-dev/x-twitter-scraper-java/blob/main/buildSrc/src/main/kotlin/x-twitter-scraper.java.gradle.kts) | Gradle preserves source and line tables in JVM classes. |
| `x-twitter-scraper-kotlin` | Met | [JVM build configuration](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/blob/main/buildSrc/src/main/kotlin/x-twitter-scraper.java.gradle.kts) | Gradle preserves source and line tables in JVM classes. |
| `x-twitter-scraper-php` | Met | [Composer package configuration](https://github.com/Xquik-dev/x-twitter-scraper-php/blob/main/composer.json) | Composer installs PHP sources directly. No stripping step exists. |
| `x-twitter-scraper-python` | Met | [Python package configuration](https://github.com/Xquik-dev/x-twitter-scraper-python/blob/main/pyproject.toml) | The wheel preserves Python sources. No stripping step exists. |
| `x-twitter-scraper-ruby` | Met | [Ruby package configuration](https://github.com/Xquik-dev/x-twitter-scraper-ruby/blob/main/x_twitter_scraper.gemspec) | The gem preserves Ruby sources. No stripping step exists. |
| `x-twitter-scraper-typescript` | Met | [TypeScript build configuration](https://github.com/Xquik-dev/x-twitter-scraper-typescript/blob/main/tsconfig.build.json) | TypeScript emits source maps beside published JavaScript. |
| `xquik-haystack` | Met | [Python package configuration](https://github.com/Xquik-dev/xquik-haystack/blob/main/pyproject.toml) | The wheel preserves Python sources. No stripping step exists. |

## Native release verification

The Terraform provider and CLI publish native Go binaries.

Their release configurations previously passed `-s -w` to the Go linker.

Those flags removed symbol and DWARF data.

Each remediation now performs these checks:

1. Build the release binary with GoReleaser.
2. Select the Linux AMD64 binary from `dist/artifacts.json`.
3. Inspect its section table with `objdump`.
4. Require both `.debug_info` and `.debug_line`.
5. Repeat the check before publishing.

The checks keep `-trimpath` for reproducibility.

## JVM verification

Java and Kotlin release JARs retain JVM debugging attributes.

Rebuild either project and inspect a main class:

```bash
./gradlew build
javap -l -classpath PATH_TO_JAR FULLY_QUALIFIED_CLASS
```

The output must contain `LineNumberTable`.

The class metadata also retains its source filename.

## Source package verification

Python, PHP, and Ruby releases distribute language source files.

Their package builds do not compile or strip native binaries.

The JavaScript and TypeScript projects preserve source context.

They either ship source assets or publish source maps.

Review this register after build or packaging changes.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
