Create or update a plan for the current task.

Steps:
1. Read `CLAUDE.md` to understand project rules
2. Read the BRIEF/PRD in `docs/specs/` for requirements + acceptance criteria, then check
   existing files in `docs/plans/`, `docs/tasks/`, and `docs/decisions/` for related work
3. If a relevant plan already exists, update it instead of creating a new one
4. If no plan exists, create one using `templates/PLAN.template.md` with naming: `docs/plans/YYYY-MM-DD-short-kebab-name.md`
5. Fill in all sections:
   - **Context**: why this work is needed (link to issue/ticket if available)
   - **Problem**: what is broken, missing, or needs to change
   - **Plan**: numbered steps in execution order
   - **Lanes**: if multi-agent, define non-overlapping responsibilities
   - **Files Likely Affected**: list specific paths
   - **Risks**: what could go wrong, what needs extra attention
   - **Verification**: exact commands to validate the work (test, build, lint)
6. If the task also needs a task file, create one using `templates/TASK.template.md`
7. Do NOT start implementing unless explicitly asked — planning and coding are separate steps

Anti-rationalization — when you think the left, the reality is the right:

| Excuse | Reality |
|--------|---------|
| "This task is clear, I'll just start coding" | If it's clear, the plan takes 5 minutes. If you can't write it quickly, it wasn't clear — and you were about to find out the expensive way. |
| "Verification is obvious, skip that section" | "Obvious" verification is the first thing skipped under pressure. Write the exact command now so the gate has teeth later. |
| "I'll figure out the risks as I hit them" | Risks hit at the worst time. Naming them up front is the cheapest mitigation you'll ever do. |
| "Plan and code in one go is faster" | It feels faster and reviews slower — nobody can tell intent from outcome. Plan, confirm, then code. |

See `docs/plans/2026-01-15-user-auth-api.example.md` for a filled example.
