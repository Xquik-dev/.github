# Release Integrity & Verification

This guide covers cryptographic verification for public Xquik-dev releases.

Use public registry or GitHub evidence for every verification.

Never trust a package because a signature merely exists.

Verify the signer identity, repository, artifact digest, and expected workflow.

## Evidence Status

Assessment date: July 24, 2026.

| Projects | Distribution | Current Public Evidence |
| --- | --- | --- |
| `n8n-nodes-xquik`, `paperclip-plugin-xquik`, `tweetclaw`, `x-twitter-scraper`, `x-twitter-scraper-typescript` | npm | Registry signature and SLSA provenance |
| `hermes-tweet`, `prefect-xquik`, `x-twitter-scraper-python`, `xquik-haystack` | PyPI | PEP 740 publish attestations |
| `terraform-provider-x-twitter-scraper` | GitHub Releases and Terraform Registry | GitHub SLSA provenance and signed checksums |
| `x-twitter-scraper-cli` | GitHub Releases | GitHub SLSA provenance |
| `x-twitter-scraper-ruby` | RubyGems | Sigstore bundle bound to the published gem |
| `x-twitter-scraper-csharp` | NuGet | Project-controlled signature evidence remains incomplete |
| `x-twitter-scraper-go` | Go modules | Project-controlled signature evidence remains incomplete |
| `x-twitter-scraper-java`, `x-twitter-scraper-kotlin` | Maven Central | Current public artifact and signature evidence remains incomplete |
| `x-twitter-scraper-php` | Packagist | Project-controlled signature evidence remains incomplete |

The first 12 projects have verifiable signed release artifacts.

Their Silver badge answers still require default-branch documentation.

The remaining 5 projects must add public cryptographic release evidence.

Track that work in [organization issue #4](https://github.com/Xquik-dev/.github/issues/4).

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
gem_file=x-twitter-scraper-0.5.4.gem
bundle_file="$gem_file.sigstore.json"

curl --fail --location --output "$gem_file" \
  "https://rubygems.org/downloads/$gem_file"

curl --fail --location \
  https://rubygems.org/api/v1/attestations/x-twitter-scraper-0.5.4.json \
  | jq '.[0]' > "$bundle_file"
```

Verify the exact workflow identity:

```sh
gem exec sigstore-cli:0.2.3 verify \
  --bundle="$bundle_file" \
  --certificate-identity=https://github.com/Xquik-dev/x-twitter-scraper-ruby/.github/workflows/publish-gem.yml@refs/tags/v0.5.4 \
  --certificate-oidc-issuer=https://token.actions.githubusercontent.com \
  "$gem_file"
```

Require an `OK` result for the downloaded artifact.

The verified SHA-256 digest is:

```text
ce55622baf95df9b6599db33a7a1627463be3735b891e93177a67f8875d3aaa8
```

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

## Unsigned Tags

The latest public Git tags lacked verified Git signatures during this audit.

Keep `version_tags_signed` Unmet until important tags are verifiable.

Artifact attestations do not make an unsigned Git tag signed.

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
