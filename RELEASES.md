# Release Integrity & Verification

This guide covers cryptographic verification for public Xquik-dev releases.

Use public registry or GitHub evidence for every verification.

Never trust a package because a signature merely exists.

Verify the signer identity, repository, artifact digest, and expected workflow.

## Evidence Status

Assessment date: July 25, 2026.

| Projects | Distribution | Current Public Evidence |
| --- | --- | --- |
| `n8n-nodes-xquik`, `paperclip-plugin-xquik`, `tweetclaw`, `x-twitter-scraper`, `x-twitter-scraper-typescript` | npm | Registry signature and SLSA provenance |
| `hermes-tweet`, `prefect-xquik`, `x-twitter-scraper-python`, `xquik-haystack` | PyPI | PEP 740 publish attestations |
| `terraform-provider-x-twitter-scraper` | GitHub Releases and Terraform Registry | GitHub SLSA provenance and signed checksums |
| `x-twitter-scraper-cli` | GitHub Releases | GitHub SLSA provenance |
| `x-twitter-scraper-ruby` | RubyGems | Sigstore bundle bound to the published gem |
| `x-twitter-scraper-java`, `x-twitter-scraper-kotlin` | Maven Central | OpenPGP signatures for every published Maven file |
| `x-twitter-scraper-csharp` | NuGet and GitHub Releases | Repository-bound SLSA provenance for the exact `.nupkg` |
| `x-twitter-scraper-go` | Go modules and GitHub Releases | Repository-bound SLSA provenance for the source archive |
| `x-twitter-scraper-php` | Packagist and GitHub Releases | Repository-bound SLSA provenance for the Composer archive |

All 17 projects have verifiable signed release artifacts.

Keep each badge answer aligned with current default-branch evidence.

The [consumer verification workflow](.github/workflows/release-attestations.yml)
checks the latest C#, Go, and PHP artifacts weekly.

## Verify npm Provenance

The npm registry signs packages and publishes SLSA provenance.

Install the package with a lockfile.

Then run:

```sh
npm audit signatures
```

Confirm the expected package name and Xquik-dev source repository.

The supported public package names are:

- `n8n-nodes-xquik`
- `@xquik/paperclip-plugin-xquik`
- `@xquik/tweetclaw`
- `x-developer`
- `x-twitter-scraper`

## Verify PyPI Attestations

PyPI publishes PEP 740 attestations for trusted releases.

Copy the wheel URL from the project's PyPI Files page.

Run:

```sh
uvx --from pypi-attestations \
  pypi-attestations verify pypi \
  --repository https://github.com/Xquik-dev/PROJECT \
  WHEEL_URL
```

Replace `PROJECT` with the matching repository.

Replace `WHEEL_URL` with the selected PyPI wheel URL.

The verifier checks the artifact digest and trusted publisher identity.

## Verify RubyGems Attestations

RubyGems publishes a Sigstore bundle for the current gem.

Download the gem and its bundle:

```sh
gem_file=x-twitter-scraper-0.5.5.gem
bundle_file="$gem_file.sigstore.json"

curl --fail --location --output "$gem_file" \
  "https://rubygems.org/downloads/$gem_file"

curl --fail --location \
  https://rubygems.org/api/v1/attestations/x-twitter-scraper-0.5.5.json \
  | jq '.[0]' > "$bundle_file"
```

Verify the exact workflow identity:

```sh
gem exec sigstore-cli:0.2.3 verify \
  --bundle="$bundle_file" \
  --certificate-identity=https://github.com/Xquik-dev/x-twitter-scraper-ruby/.github/workflows/publish-gem.yml@refs/tags/v0.5.5 \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com \
  "$gem_file"
```

Require an `OK` result for the downloaded artifact.

The verified SHA-256 digest is:

```text
6dfdcabd408a330d80ef87f4e650aca0004ba8a0eb8b49cb92e06a97a7cf5502
```

## Verify Maven Central Signatures

Maven Central publishes detached OpenPGP signatures for Java and Kotlin.

Download an artifact and its signature:

```sh
project=java
version=0.6.0
artifact="x-twitter-scraper-$project-$version.jar"
base="https://repo.maven.apache.org/maven2/com/xquik/api/x-twitter-scraper-$project/$version"

curl --fail --location --remote-name "$base/$artifact"
curl --fail --location --remote-name "$base/$artifact.asc"
```

Import the public key and verify the artifact:

```sh
gpg --keyserver hkps://keyserver.ubuntu.com \
  --recv-keys 0xD2037E4157E62A59
gpg --verify "$artifact.asc" "$artifact"
```

Set `project=kotlin` and `version=0.5.3` to verify Kotlin.

Confirm this full fingerprint before trusting the key:

```text
6965 E561 C0AC EE32 060A B961 D203 7E41 57E6 2A59
```

The verified root JAR SHA-256 digests are:

```text
Java:   17aaf5366ab6ad65869e5fb4f92acb2351bb08e0a12a0d4fcab6de8875193916
Kotlin: 6e083f62f50231bbce09b99c6c6fe5b8f5ade1babaefac8220d80897df93cdf1
```

The audit verified 15 Java artifacts and their signatures.

They span 3 Maven components.

It also verified 15 Kotlin artifacts and their signatures.

They span 3 Maven components.

Public workflows verified both root artifacts after registry publication:

- [Java release verification](https://github.com/Xquik-dev/x-twitter-scraper-java/actions/runs/30110262525)
- [Kotlin release verification](https://github.com/Xquik-dev/x-twitter-scraper-kotlin/actions/runs/30125831619)

## Verify GitHub Attestations

Download the selected release artifact.

Run:

```sh
gh attestation verify ARTIFACT --repo Xquik-dev/PROJECT
```

Replace `PROJECT` with the matching repository.

Replace `ARTIFACT` with the downloaded file path.

Require the SLSA provenance predicate.

Confirm the subject digest matches the downloaded artifact.

For stricter policy, also require the expected signer workflow.

## Verify Project-Controlled SDK Artifacts

Three SDK ecosystems also publish canonical GitHub release artifacts.

Download and verify each artifact:

```sh
gh release download v0.5.4 \
  --repo Xquik-dev/x-twitter-scraper-csharp \
  --pattern XTwitterScraper.0.5.4.nupkg
gh attestation verify XTwitterScraper.0.5.4.nupkg \
  --repo Xquik-dev/x-twitter-scraper-csharp \
  --signer-workflow Xquik-dev/x-twitter-scraper-csharp/.github/workflows/publish-nuget.yml \
  --deny-self-hosted-runners

gh release download v0.7.0 \
  --repo Xquik-dev/x-twitter-scraper-go \
  --pattern x-twitter-scraper-go-v0.7.0.zip
gh attestation verify x-twitter-scraper-go-v0.7.0.zip \
  --repo Xquik-dev/x-twitter-scraper-go \
  --signer-workflow Xquik-dev/x-twitter-scraper-go/.github/workflows/release-provenance.yml \
  --deny-self-hosted-runners

gh release download v0.6.0 \
  --repo Xquik-dev/x-twitter-scraper-php \
  --pattern x-twitter-scraper-php-v0.6.0.zip
gh attestation verify x-twitter-scraper-php-v0.6.0.zip \
  --repo Xquik-dev/x-twitter-scraper-php \
  --signer-workflow Xquik-dev/x-twitter-scraper-php/.github/workflows/release-provenance.yml \
  --deny-self-hosted-runners
```

The verified SHA-256 digests are:

```text
C#:  7bef1ec1688b472424d7e92738342a446abfa6a9b1d314c4cd66fff919b5f34f
Go:  a59bd116af5ff6cc911c38b2fd515559d5f97b3eeb489d1a6148fd13fb459fb0
PHP: 31fdf66d8cb1d0d8aeacbb8748189029eafc8b178b905057fd35540f5a01589b
```

Each certificate identifies its Xquik-dev release workflow.

Each certificate also binds the artifact to its matching release tag.

## Verify Terraform Checksums

Download the checksum file, its signature, and the selected archive.

Verify the checksum signature using the published Terraform Registry key.

Then compare the selected archive:

```sh
sha256sum --check terraform-provider-x-twitter-scraper_*_SHA256SUMS
```

Also verify the archive's GitHub attestation.

## Keyless Signing

npm, PyPI, RubyGems, and GitHub attestations use identity-bound signing.

Their signing certificates use short-lived keys and public trust roots.

Verification checks the repository identity and transparency-log timestamp.

No long-lived project private signing key is required.

## Protected Release Tags

Every standalone repository has an active ruleset for `v*` tags.

All 17 rulesets block deletion and non-fast-forward updates.

The rulesets currently allow tag creation.

These rules preserve published tag identity.

They do not make an unsigned tag signed.

## Unsigned Tags

The latest public Git tags lacked verified Git signatures during this audit.

Keep `version_tags_signed` Unmet until important tags are verifiable.

Artifact attestations do not make an unsigned Git tag signed.

## Future Signed Tags

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

## Release Requirements

Before publishing:

- Build from the protected default branch.
- Match the release version and source tag.
- Run every required test, analysis, and licensing check.
- Produce reproducible artifacts where the project builds artifacts.
- Publish cryptographic provenance or signatures.
- Keep signing authority outside the artifact distribution path.
- Document verification with public commands.

After publishing:

- Verify one public artifact as a consumer.
- Record the artifact digest and signer identity.
- Confirm registry propagation.
- Link security fixes from release notes.
- Stop the release when verification fails.

Update OpenSSF answers only from current default-branch evidence.

Xquik is an independent third-party service. Not affiliated with X Corp. "Twitter" and "X" are trademarks of X Corp.
