---
name: deployment
description: Auto-trigger when setting up or changing how the app ships — CI/CD pipelines, build/release, containerization, environment/secret config, database deploy ordering, rollback. Ensures deploys are automated, reversible, and verified.
---

# Deployment

## Goal
Get a change into an environment safely, reproducibly, and reversibly — not "it deployed" but "it deployed, was verified, and can be rolled back".

## What to Check First
- How the app is built and released today (CI config, build scripts, artifacts)
- What environments exist (dev / staging / prod) and how they differ
- How config and secrets are provided per environment
- The current deploy mechanism and whether it's automated or manual
- The rollback path — does one exist, and is it tested?
- Health/readiness checks and how a bad deploy is detected

## Default Approach
1. Build the artifact once, promote the same artifact across environments — don't rebuild per env.
2. Config and secrets come from the environment at runtime, never baked into the image/bundle or committed.
3. Decide the rollback path before shipping; a deploy you can't undo is a bet, not a release.
4. Run the automated gate (test → lint → build) in CI before deploy, not just on a laptop.
5. Make schema migrations deploy-safe: backward-compatible, ordered relative to the code, expand-then-contract for breaking changes so old and new code can both run during rollout.
6. Verify after deploy with a smoke/health check; "deploy succeeded" is not "it works".
7. Deploy small and often; avoid big-bang releases that are impossible to bisect.

## Output Expectations
- What changed in the pipeline/infra and why
- Which environments are affected
- The exact rollback steps
- Migration ordering relative to the deploy (before / with / after)
- Post-deploy verification performed (smoke test, health check, key metric)
- Anything manual that still needs a human, called out explicitly

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "Deploy went green, we're done" | Green pipeline ≠ working app. Without a smoke/health check you've shipped blind. Verify the running system. |
| "We'll figure out rollback if it breaks" | Designing the undo mid-incident is the worst time to do it. Decide and test rollback before you ship. |
| "Just SSH in and fix it real quick" | An untracked manual change diverges environments and is invisible to the next deploy. Put it in the pipeline. |
| "Bake the secret in for now, rotate later" | A secret in an image or repo is leaked the moment it's pushed. Inject from env/secret store, always. |
| "Run the breaking migration with the deploy" | A migration that locks a table or drops a column old code still reads takes the app down. Expand-then-contract. |
| "Skip staging, it's a small change" | "Small" changes cause outages precisely because nobody verified them. Promote through environments. |

## Gotchas
- Do not commit secrets/connection strings or bake them into build artifacts
- Do not ship without a known, reversible rollback path
- Do not run destructive/locking migrations in a single coupled step with the deploy
- Do not rely on manual, undocumented deploy steps — automate or write them down
- Do not treat a successful build as proof the feature works in the environment
- Do not deploy straight to prod what hasn't run in a prod-like environment
