Review the current changes for quality, correctness, and scope.

This command CHAINS skills — it pulls in the right expertise automatically so you
don't invoke them by hand. Skills chained: `security-check`, `test-strategy`,
`architecture-review`, `performance` (when a hot path changed), and (when frontend
files changed) `frontend-review`.

Steps:
1. Read the relevant task file in `docs/tasks/` for the goal and acceptance criteria;
   if a PRD exists in `docs/specs/`, treat its acceptance criteria as the source of truth.
2. Read the relevant plan file in `docs/plans/` to understand the intended scope
3. Run `git diff` to see all changes, and classify what kind of files changed
   (backend/logic, frontend/UI, infra) — this decides which skills to chain
4. Check each change against:
   - **Goal**: does it achieve what the task set out to do?
   - **Acceptance criteria**: are all criteria met?
   - **Scope**: are there unrelated changes that should be in a separate task?
   - **Regressions**: could any change break existing behavior?
   - **Tests**: are new/changed behaviors covered? → chain the `test-strategy` skill
   - **Security**: injection, auth bypass, secret exposure, OWASP top 10? → chain the `security-check` skill
   - **Architecture**: new modules, changed boundaries, dependency direction? → chain the `architecture-review` skill
   - **Performance**: new work on a hot path (loops, queries, rendering, large data)? → chain the `performance` skill (measure before optimizing)
5. **If frontend files changed** (components, pages, styles), also chain the
   `frontend-review` skill:
   - UI consistency with existing screens/components
   - loading / empty / error / disabled states
   - responsive behavior, accessibility basics
   - regression risk in shared components, style drift, duplicate components
6. Report findings as:
   - **Must fix**: issues that block shipping
   - **Should fix**: issues worth addressing but not blockers
   - **Nit**: style or preference, take it or leave it
   - **Good**: things done well (reinforce good patterns)
7. If scope creep is found, recommend splitting into follow-up tasks

Note: this replaces the old `/frontend-review` command — frontend review now runs
automatically here whenever the diff touches frontend files.
