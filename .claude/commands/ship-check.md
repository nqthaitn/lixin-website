Pre-merge/pre-deploy checklist. Run this before shipping any change.

This command CHAINS `/review` first (which itself chains `security-check`,
`test-strategy`, `architecture-review`, and frontend skills), then adds the
pre-ship build/test/lint gates below. You do not need to run `/review` separately.

Steps:
1. **Run `/review` first**: get the quality/correctness/scope/security findings.
   Any "Must fix" from review blocks shipping.
2. **Scope check**: run `git diff` against the base branch
   - Are all changes related to the task?
   - Any accidental files (logs, .env, build artifacts)?
   - Any unrelated "drive-by" edits that should be separate?
3. **Tests**: run the project's test command
   - All existing tests pass?
   - New/changed behavior has test coverage?
   - No skipped or commented-out tests?
4. **Lint & types**: run lint and typecheck commands
   - No new warnings or errors?
   - No disabled lint rules without justification?
5. **Security scan**:
   - No hardcoded secrets, tokens, or passwords?
   - No SQL string concatenation?
   - No unescaped user input in HTML/URLs?
   - No `eval()`, `dangerouslySetInnerHTML`, or equivalent without justification?
   - Dependencies: any known vulnerabilities? (`npm audit` / `pip audit` / equivalent)
6. **Build**: run the build command
   - Builds successfully?
   - No new build warnings?
7. **Acceptance criteria**: check each criterion from the task file (and the PRD in `docs/specs/` if one exists)
   - All criteria met?
   - If any are not met, document why and whether it's acceptable
8. **Deploy readiness** (when the change will be deployed, not just merged): chain the
   `deployment` and `observability` skills —
   - reversible rollback path decided, secrets from env (not baked in), migrations ordered expand-then-contract
   - post-deploy smoke/health check exists; errors and key paths are observable (no PII in logs)
   - version bumped + changelog updated + release tagged (`release-management`); public/behavior changes documented (`documentation`)
9. **Report**: summarize findings as:
   - **Ready to ship**: all checks pass
   - **Blocked**: list what must be fixed first
   - **Ship with follow-up**: minor issues that can be tracked as next tasks

Verification gate (evidence, not assertions):
- A step counts as passed ONLY when you have shown the evidence — the actual command output (test summary, build result, lint result) — not a claim that "it should pass".
- "Ready to ship" requires real output for tests, lint/types, and build pasted or observed this session. If you didn't run it, it is not passed — mark it "not verified".

Anti-rationalization — when you think the left, the reality is the right:

| Excuse | Reality |
|--------|---------|
| "It's a small change, skip the checklist" | Small changes ship the most regressions precisely because they skip checks. |
| "Tests should still pass, no need to run" | "Should" is a guess. Run them — that's the whole point of the gate. |
| "I'll fix the lint warning after merge" | After-merge fixes rarely happen; the warning becomes permanent noise. |
| "The build worked locally yesterday" | Yesterday's build doesn't cover today's diff. Re-run against the current change. |

Rules:
- Scale depth to the change, not the step count — a one-line fix still needs scope/test/build green, just faster. Mark a step N/A explicitly; never skip it silently.
- If a check fails, fix it before shipping — don't ship with known issues
- This is the pre-ship gate even for small tasks; it's the full pipeline (plan→implement) that small tasks skip, not this checklist
