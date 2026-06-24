Start here when you're not sure what to do next. Orchestrates a project end-to-end (A→Z):
detects which lifecycle stage the project is in, then routes to the right next step instead of
forcing the full pipeline every time. (The counterpart at the finish line is `/ship-check`.)

## Step 1 — Read state
1. Read `CLAUDE.md` (rules + Project Lifecycle A→Z + mode tiers).
2. Scan: `docs/specs/` (BRIEF, PRD), `docs/decisions/` (ADRs), `docs/plans/`, `docs/tasks/`,
   `docs/handoff/`, `TODO.md`. Note what exists and what's missing.
3. Determine project mode (light / standard / enterprise) from the BRIEF, or ask.

## Step 2 — Locate the project on the lifecycle
Map current state to a stage:
- **0. Discovery** — no BRIEF/PRD, or requirements are vague → run `/discover`.
- **1. Spec** — BRIEF exists but PRD missing/incomplete or acceptance criteria unclear → finish PRD (`/discover` or edit).
- **2. Architecture** — PRD ready but a significant tech/structure decision is open → `/new-decision` (ADR); consider the `architecture-review` skill.
- **3. Planning** — spec + key decisions set, no plan/tasks → `ROADMAP` (standard+), then `/plan` + `/new-task`; use `task-breakdown` if 3+ files / multi-concern.
- **4. Implementation** — plan/tasks exist, code in progress → implement in scope; `/update-task` as you go.
- **5. Review/QA** — code done, not reviewed → `/review`; auto-skills: `security-check`, `test-strategy`, `frontend-review` when relevant.
- **6. Ship** — reviewed, ready to merge/deploy → `/ship-check`.
- **Continuity** — work spans sessions/agents → `/handoff` when stopping, `/resume` when restarting.

## Step 3 — Apply mode (don't over-process)
- `light` (solo/MVP): BRIEF lite → minimal PRD → code → `/review` → `/ship-check`. Skip ROADMAP/ADR unless a real fork appears. Tiny task (<3 files) → code directly, no plan file.
- `standard`: full BRIEF → PRD → ADR for big calls → ROADMAP → PLAN/TASK → implement → review → ship.
- `enterprise`: standard + requirements traceability, risk register, mandatory security + test gates, sign-offs before ship.

## Step 4 — Propose and confirm
Report: detected stage, mode, what's missing, and the single recommended next action (with the exact command).
Ask for confirmation before kicking off a heavy step. Then proceed with that step.

Anti-rationalization — when you think the left, the reality is the right:

| Excuse | Reality |
|--------|---------|
| "Just run the full pipeline to be safe" | The full pipeline on a tiny task is pure overhead. Detect the stage and route to the ONE step actually needed. |
| "Skip discovery, they clearly know what they want" | If there's no BRIEF/PRD, the requirements aren't captured — only assumed. Confirm the stage before skipping it. |
| "This is enterprise, do every gate regardless" | Mode scales the process. A light/MVP project drowning in ADRs and traceability is the wrong call too. |
| "I'll proceed without confirming the next step" | Heavy steps started on a wrong read waste the most. Report detected stage + recommended action, then confirm. |

Rules:
- Never run the whole pipeline blindly — route to the stage that's actually needed next.
- Prefer updating existing docs over creating duplicates.
- Surface blockers/open questions explicitly before moving forward.
