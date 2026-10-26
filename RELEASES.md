# Release integrity & verification

This guide covers verification for public Xquik-dev releases.

Use public registry or GitHub evidence for every verification.

Never trust a package because a signature merely exists.

Verify the signer identity, repository, artifact digest, and release tag.

## How releases are made

A maintainer publishes each release from the maintainer's own machine.

Most repositories have a `bin/release-local` script for that. It runs the checks, builds, uploads, tags, and creates the GitHub release.

No project publishes from a GitHub Actions workflow.

`hermes-tweet`, `prefect-xquik`, and `xquik-haystack` have no PyPI trusted publisher. A maintainer's PyPI token is the only way they publish.

So a release carries no workflow provenance. It has no SLSA provenance, no PyPI attestation, no RubyGems attestation, and no workflow signature.

Older releases came from workflows and still carry that provenance. Do not require it for a newer release.

## Evidence status

Assessment date: October 13, 2026.

| Project | Distribution | Evidence of every release |
| --- | --- | --- |
| `hermes-tweet` | PyPI `hermes-tweet` | Release tag on the default branch. Registry version equals the tag. Release assets equal the PyPI files |
| `n8n-nodes-xquik` | npm `n8n-nodes-xquik` | Release tag on the default branch. Registry version equals the tag. npm registry signature |
| `paperclip-plugin-xquik` | npm `@xquik/paperclip-plugin-xquik` | Release tag on the default branch. Registry version equals the tag. npm registry signature |
| `prefect-xquik` | PyPI `prefect-xquik` | Release tag on the default branch. Registry version equals the tag |
| `terraform-provider-x-twitter-scraper` | Terraform Registry `Xquik-dev/x-twitter-scraper` | Release tag on the default branch. Registry version equals the tag. Checksums signed by the Xquik Terraform key. GitHub release attestation |
| `tweetclaw` | npm `@xquik/tweetclaw` | Release tag on the default branch. Registry version equals the tag. npm registry signature |
| `x-twitter-scraper` | npm `x-developer` | Release tag on the default branch. Registry version equals the tag. npm registry signature |
| `x-twitter-scraper-cli` | GitHub Releases `x-twitter-scraper` | Release tag on the default branch. Checksum file matches the release assets |
| `x-twitter-scraper-csharp` | NuGet `XTwitterScraper` | Release tag on the default branch. Registry version equals the tag. NuGet package holds the files of the release asset. GitHub release attestation |
| `x-twitter-scraper-go` | Go modules `github.com/Xquik-dev/x-twitter-scraper-go` | Release tag on the default branch. Registry version equals the tag. Go checksum database entry and source commit |
| `x-twitter-scraper-java` | Maven Central `com.xquik.api:x-twitter-scraper-java` | Release tag on the default branch. Registry version equals the tag. OpenPGP signature from the Xquik Maven key |
| `x-twitter-scraper-kotlin` | Maven Central `com.xquik.api:x-twitter-scraper-kotlin` | Release tag on the default branch. Registry version equals the tag. OpenPGP signature from the Xquik Maven key |
| `x-twitter-scraper-php` | Packagist `xquik/x-twitter-scraper` | Release tag on the default branch. Registry version equals the tag. Packagist source commit equals the tag |
| `x-twitter-scraper-python` | PyPI `x-twitter-scraper` | Release tag on the default branch. Registry version equals the tag. GitHub release attestation |
| `x-twitter-scraper-ruby` | RubyGems `x-twitter-scraper` | Release tag on the default branch. Registry version equals the tag. GitHub release attestation |
| `x-twitter-scraper-typescript` | npm `x-twitter-scraper` | Release tag on the default branch. Registry version equals the tag. npm registry signature. Release asset equals the npm tarball. GitHub release attestation |
| `xquik-haystack` | PyPI `xquik-haystack` | Release tag on the default branch. Registry version equals the tag |

Every row holds for the latest release of the project.

[`bin/check-local`](bin/check-local) verifies every row on every run. It runs [`scripts/verify-release-evidence.ts`](scripts/verify-release-evidence.ts).

What each kind of evidence means.

| Evidence | Meaning |
| --- | --- |
| Release tag on the default branch | The commit of the latest release tag is in the history of the default branch |
| Registry version equals the tag | The registry's latest version is the version of the latest release tag |
| npm registry signature | An npm registry key signed the package name, version, and integrity value |
| Release asset equals the npm tarball | The GitHub release asset has the SHA-256 digest of the tarball npm serves |
| Release assets equal the PyPI files | Each file on PyPI has the SHA-256 digest of a GitHub release asset |
| OpenPGP signature from the Xquik Maven key | The Xquik Maven key made a valid signature over the published JAR |
| Checksums signed by the Xquik Terraform key | The Xquik Terraform key signed the checksum file, and every archive matches its line |
| Checksum file matches the release assets | Every line of the checksum file matches a release asset. The file is not signed |
| NuGet package holds the files of the release asset | NuGet.org serves the same files as the release asset, plus its own signature file |
| Go checksum database entry and source commit | The Go checksum database lists the version, and the Go proxy built it from the tag's commit |
| Packagist source commit equals the tag | Packagist serves the commit that the release tag names |
| GitHub release attestation | The repository has immutable releases, and GitHub signed a record of the release |

No release script signs its Git tags. No project publishes build provenance for a local release.

## Verify npm packages

The npm registry signs every package version.

Install the package with a lockfile, then check the signatures.

```sh
npm audit signatures
```

The signature proves that npm served the package it published. It does not name a source repository.

The supported public package names are these.

- `n8n-nodes-xquik`
- `@xquik/paperclip-plugin-xquik`
- `@xquik/tweetclaw`
- `x-developer`
- `x-twitter-scraper`

`x-twitter-scraper` also attaches its tarball to the GitHub release. Download the registry tarball and check it against that release.

```sh
curl --fail --location --remote-name \
  https://registry.npmjs.org/x-twitter-scraper/-/x-twitter-scraper-0.13.1.tgz
gh release verify-asset v0.13.1 x-twitter-scraper-0.13.1.tgz \
  --repo Xquik-dev/x-twitter-scraper-typescript
```

## Verify PyPI packages

PyPI lists a SHA-256 digest for every file. `pip` and `uv` check it on download.

A local release has no PyPI attestation, so `pypi-attestations` finds none.

`hermes-tweet` attaches its wheel and source archive to the GitHub release. Check the release assets against the digests PyPI lists.

```sh
curl --fail --silent https://pypi.org/pypi/hermes-tweet/0.1.13/json \
  | jq -r '.urls[] | "\(.digests.sha256)  \(.filename)"' > SHA256SUMS
gh release download v0.1.13 --repo Xquik-dev/hermes-tweet \
  --pattern 'hermes_tweet-*'
shasum -a 256 --check SHA256SUMS
```

`x-twitter-scraper` has a GitHub release attestation, described below.

`prefect-xquik` and `xquik-haystack` have neither. Their evidence is the release tag and the registry version.

## Verify the Ruby gem

RubyGems lists a SHA-256 digest for every gem version.

A local release has no RubyGems attestation.

The repository has immutable releases, so GitHub attests each release. The section on GitHub release attestations shows the command.

## Verify Maven Central signatures

Maven Central publishes detached OpenPGP signatures for Java and Kotlin.

The release script signs every Maven file with the Xquik Maven key. That key is long-lived, and a maintainer holds it.

Download an artifact and its signature.

```sh
project=java
version=0.10.3
artifact="x-twitter-scraper-$project-$version.jar"
base="https://repo.maven.apache.org/maven2/com/xquik/api/x-twitter-scraper-$project/$version"

curl --fail --location --remote-name "$base/$artifact"
curl --fail --location --remote-name "$base/$artifact.asc"
```

Import the public key from this repository and verify the artifact.

```sh
curl --fail --location --remote-name \
  https://raw.githubusercontent.com/Xquik-dev/.github/main/keys/xquik-maven-central.asc
gpg --import xquik-maven-central.asc
gpg --verify "$artifact.asc" "$artifact"
```

Set `project=kotlin` and `version=0.9.3` to verify Kotlin.

Confirm this full fingerprint before trusting the key.

```text
6965 E561 C0AC EE32 060A B961 D203 7E41 57E6 2A59
```

## Verify GitHub release attestations

5 repositories have immutable releases.

- `terraform-provider-x-twitter-scraper`
- `x-twitter-scraper-csharp`
- `x-twitter-scraper-python`
- `x-twitter-scraper-ruby`
- `x-twitter-scraper-typescript`

GitHub signs a record of each release there. The record names the tag, its commit, and the digest of every asset.

Verify the release, then any asset you downloaded.

```sh
gh release verify TAG --repo Xquik-dev/PROJECT
gh release verify-asset TAG FILE --repo Xquik-dev/PROJECT
```

Replace `TAG`, `FILE`, and `PROJECT` with the release tag, the downloaded file, and the repository.

This attestation is GitHub's record of a release. It is not build provenance, and it names no workflow.

The other 12 repositories have no release attestation.

## Verify SDK packages against their tags

The C#, Go, and PHP registries each offer a different check.

For C#, download the release asset and verify it against the attested release.

```sh
gh release download v0.6.2 \
  --repo Xquik-dev/x-twitter-scraper-csharp \
  --pattern XTwitterScraper.0.6.2.nupkg
gh release verify-asset v0.6.2 XTwitterScraper.0.6.2.nupkg \
  --repo Xquik-dev/x-twitter-scraper-csharp
```

NuGet.org adds its own signature file to the package it serves. The 2 packages differ in bytes and hold the same files otherwise.

For Go, the checksum database protects every download. Compare the source commit with the tag.

```sh
go mod download -json github.com/Xquik-dev/x-twitter-scraper-go@v0.18.1
gh api repos/Xquik-dev/x-twitter-scraper-go/commits/v0.18.1 --jq .sha
```

`Origin.Hash` in the first answer must equal the commit in the second.

For PHP, Packagist serves the commit of the tag. Compare both.

```sh
curl --fail --silent https://repo.packagist.org/p2/xquik/x-twitter-scraper.json \
  | jq -r '.packages["xquik/x-twitter-scraper"][0].source.reference'
gh api repos/Xquik-dev/x-twitter-scraper-php/commits/v0.13.3 --jq .sha
```

## Verify Terraform checksums

Download the checksum file, its signature, and the selected archive from the GitHub release.

The Terraform Registry publishes the signing key. Confirm this full fingerprint before trusting it.

```text
0DC4 78C1 7474 B964 5C25 B46C 4900 C25E 8532 4F28
```

Verify the signature, then the archive.

```sh
gpg --verify terraform-provider-x-twitter-scraper_*_SHA256SUMS.sig \
  terraform-provider-x-twitter-scraper_*_SHA256SUMS
shasum -a 256 --ignore-missing --check terraform-provider-x-twitter-scraper_*_SHA256SUMS
```

The repository has immutable releases, so `gh release verify` also works.

## Verify the CLI checksums

`x-twitter-scraper-cli` publishes on GitHub Releases only.

Download the archive and the checksum file, then compare.

```sh
shasum -a 256 --ignore-missing --check x-twitter-scraper_*_checksums.txt
```

The checksum file is not signed. It detects a damaged download. It does not prove who published the release.

## Signing keys

A local release signs in to each registry with a maintainer's long-lived token. Nothing in a package proves that sign-in.

2 projects sign with long-lived project keys.

| Key | Fingerprint | Signs |
| --- | --- | --- |
| Xquik Maven key | `6965 E561 C0AC EE32 060A B961 D203 7E41 57E6 2A59` | Every Java and Kotlin file on Maven Central |
| Xquik Terraform key | `0DC4 78C1 7474 B964 5C25 B46C 4900 C25E 8532 4F28` | The checksum file of each Terraform provider release |

Both are long-lived keys that a maintainer holds. Neither private key is in a repository.

GitHub signs the release attestations of the 5 repositories with immutable releases. That signing uses GitHub's own identity and short-lived keys.

No other release is signed.

## Protected release tags

Every standalone repository has an active ruleset for `v*` tags.

All 17 rulesets block deletion and non-fast-forward updates.

The rulesets currently allow tag creation.

These rules preserve published tag identity.

They do not make an unsigned tag signed.

## Unsigned tags

16 of the 17 latest release tags have no verified Git signature. The release scripts create annotated tags and do not sign them.

Keep `version_tags_signed` Unmet until important tags are verifiable.

Artifact attestations do not make an unsigned Git tag signed.

## Future signed tags

Sign every future major, minor, and vulnerability-fix tag.

Use a GitHub-verified signing key.

Never replace or force-push a published tag.

Follow GitHub's [tag signing guide](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-tags).

Configure each isolated release worktree:

```sh
git config gpg.format ssh
git config user.signingkey /secure/path/to/signing-key
git config gpg.ssh.allowedSignersFile /secure/path/to/allowed-signers
git config tag.gpgSign true
```

Create and verify the tag before pushing:

```sh
git tag -s "$version" -m "Release $version"
git tag -v "$version"
```

Never commit a private signing key.

Keep `version_tags_signed` Unmet until important public tags pass verification.

## Release requirements

Before publishing:

- Build from the protected default branch.
- Match the release version and source tag.
- Run every required test, analysis, and licensing check.
- Produce reproducible artifacts where the project builds artifacts.
- Publish the evidence this guide lists for the project.
- Keep signing authority outside the artifact distribution path.
- Document verification with public commands.

After publishing:

- Verify one public artifact as a consumer.
- Run `bin/check-local` in this repository, which verifies the new release.
- Confirm registry propagation.
- Link security fixes from release notes.
- Stop the release when verification fails.

Update OpenSSF answers only from current default-branch evidence.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
