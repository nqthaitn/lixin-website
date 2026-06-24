Create a new task file and optionally a matching plan file.

Steps:
1. Scan `docs/tasks/` to find the highest existing TASK number
2. Increment to get the next TASK ID (e.g., TASK-001 → TASK-002)
3. If a PRD exists in `docs/specs/`, derive goal + acceptance criteria from it (don't re-ask
   what's already specified). Otherwise ask the user (or infer from context) for:
   - Short title (kebab-case for filename, plain text for heading)
   - Goal (1-2 sentences)
   - Scope (files/modules affected)
   - Acceptance criteria (specific, measurable, verifiable)
4. Create the task file at `docs/tasks/TASK-{NNN}-{short-kebab-name}.md` using `templates/TASK.template.md`
5. Fill in: Status → `Planned`, Goal, Scope, Acceptance Criteria, Next Step
6. If the task is non-trivial (3+ files or multi-step), also create a plan file at `docs/plans/YYYY-MM-DD-{short-kebab-name}.md` using `templates/PLAN.template.md`
7. Update `TODO.md` if the new task should be tracked in the backlog

Rules:
- Never skip acceptance criteria — if the user gives vague criteria, ask to clarify
- Never reuse an existing TASK number
- If a similar task already exists (same scope/goal), warn the user before creating a duplicate
- Ownership section can be left as default if working solo
