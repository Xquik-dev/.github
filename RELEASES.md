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
| `x-twitter-scraper-csharp` | NuGet | Project-controlled signature evidence remains incomplete |
| `x-twitter-scraper-go` | Go modules | Project-controlled signature evidence remains incomplete |
| `x-twitter-scraper-java`, `x-twitter-scraper-kotlin` | Maven Central | Current public artifact and signature evidence remains incomplete |
| `x-twitter-scraper-php` | Packagist | Project-controlled signature evidence remains incomplete |
| `x-twitter-scraper-ruby` | RubyGems | Published gem certificate evidence remains incomplete |

The first 11 projects have verifiable signed release artifacts.

Their Silver badge answers still require default-branch documentation.

The remaining 6 projects must add public cryptographic release evidence.

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

npm, PyPI, and GitHub attestations use identity-bound signing.

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
