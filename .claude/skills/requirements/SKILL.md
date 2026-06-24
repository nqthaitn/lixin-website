---
name: requirements
description: Auto-trigger when a request is vague, lacks acceptance criteria, or describes a new feature/project without a clear "done" definition. Turns fuzzy asks into structured, verifiable requirements (BRIEF/PRD) before any planning or coding.
---

# Requirements Elicitation

## Goal
Stop fuzzy requests from turning into wrong code. Convert vague asks into a concrete spec
with verifiable acceptance criteria, scoped to the project's mode.

## When to Use
- Request is vague ("build a dashboard", "add payments", "make it better").
- Client is non-technical and gives a reference: "làm giống trang này" + a URL.
- A new feature/project starts and there's no BRIEF/PRD or acceptance criteria.
- Acceptance criteria are unmeasurable ("works well", "fast", "user-friendly").
- Scope and non-goals aren't defined → high scope-creep risk.

## Reference-driven intake (the common case)
When the input is a reference site + "make it like that": analyze the site, turn it into a
plain-language feature inventory, and confirm by showing yes/no/modify choices — don't quiz the
client with abstract questions. Capture the delta (branding, real content, features added/removed)
as the real spec. Clone structure/UX only, never copyrighted content. The `/discover` command
drives this end-to-end.

## Process
1. **Detect mode** — light / standard / enterprise (drives depth). Default `standard`.
2. **Find the real problem** — who has it, why now, cost of not solving it. Solution comes later.
3. **Elicit, don't assume** — ask focused questions on: users, goals, success metrics,
   scope, non-goals, constraints, core user flows. One cluster at a time.
4. **Make it verifiable** — rewrite every requirement as a testable acceptance criterion.
5. **Capture assumptions & open questions** — anything not confirmed is flagged, not buried.
6. **Write the spec** — BRIEF (`docs/specs/BRIEF.md`) and/or PRD
   (`docs/specs/PRD-###-...`) using the templates, filling only what the mode requires.
   Capture domain terms raised into `docs/specs/GLOSSARY.md` (one definition per term, no duplicates).

## Output (by mode)
- **light**: BRIEF lite + PRD with Summary, User Stories, Acceptance Criteria, Out of Scope.
- **standard**: full BRIEF + PRD (adds Edge Cases, NFR, Dependencies, Rollout).
- **enterprise**: + Requirements Traceability, Risk Register, Compliance, Approvals.

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "I understand what they want, let's build" | Your understanding is a guess until it's a written, confirmed acceptance criterion. Build the guess and you build the wrong thing fast. |
| "'Make it like that site' is clear enough" | "Giống vậy" hides 90% of the spec — branding, content, which features stay/go. Confirm each major one. |
| "Asking questions slows us down" | A 10-minute question is cheaper than rebuilding a feature. Ambiguity resolved late costs the most. |
| "I'll just assume a sensible default" | Silent assumptions become silent wrong requirements. Mark every assumption explicitly so it can be corrected. |

## Rules
- Never start coding/planning from a vague ask — get acceptance criteria first.
- Acceptance criteria must be specific and measurable: "returns 401 when token expired",
  not "auth works".
- Always define explicit non-goals — the cheapest defense against scope creep.
- Mark assumptions clearly; never invent requirements silently.
- Don't over-document: keep light projects light. Match the mode, don't gold-plate.
- For the full interactive flow, the `/discover` command drives this end-to-end.
- Hand the finished spec to `/start` (orchestration) or `/plan` + `/new-task` (execution).
