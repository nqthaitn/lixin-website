---
name: release-management
description: Auto-trigger when cutting a product release, bumping a version, writing release notes/changelog, or making a breaking change to a public surface. Enforces semantic versioning, a human changelog, and traceable tags.
---

# Release Management

## Goal
Ship versioned, traceable releases that consumers and rollback can rely on — every shipped state is identifiable and its changes are legible.

## What to Check First
- Existing versioning scheme (SemVer? date-based?) and where the version lives
- Whether a changelog exists and what format it follows
- Tagging/release convention in git and how consumers learn what shipped
- Whether this change touches a public/consumed surface (API, CLI, library export)

## Default Approach
1. Version with SemVer intent: breaking change → major, backward-compatible feature → minor, fix → patch. The number communicates risk to consumers.
2. Keep a human changelog (Keep a Changelog style): grouped by Added/Changed/Fixed/Removed, written for a reader, not a dump of commit messages.
3. Tag the release in git — the tag is the source of truth for "what shipped", and what rollback returns to.
4. Every breaking change gets a migration note: what broke and what the consumer must do.
5. Keep the version, the tag, and the built artifact in sync — a mismatch makes incidents un-diagnosable.
6. Don't bundle changes that need separate rollback into one release.

## Output Expectations
- The new version and why that bump level (major/minor/patch)
- The changelog entry, grouped and human-readable
- The tag created (or to create) for this release
- Migration notes for any breaking change
- Anything deferred to a follow-up release

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "Bump the version later" | "Later" the artifact is already out and unidentifiable. Version before you ship, not after. |
| "The git log is the changelog" | Commit messages are for developers mid-work; a changelog is for a consumer deciding whether to upgrade. They're not the same. |
| "It's only a small breaking change" | "Small" breaking still breaks a consumer silently. Bump major and write the migration note. |
| "Tagging is bureaucratic" | The tag is what rollback restores and what an incident traces to. Without it you can't say what's in prod. |

## Gotchas
- Do not ship an untagged release — there's nothing to roll back to
- Do not let the changelog drift from what actually shipped
- Do not hide a breaking change under a minor/patch bump
- Do not let version, tag, and artifact disagree
- Do not paste raw commit messages as release notes
