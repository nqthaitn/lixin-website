---
name: task-breakdown
description: Auto-trigger when task touches 3+ files, involves multiple concerns (API + DB + UI), description is vague, or multiple agents/sessions will work on it. Breaks task into non-overlapping lanes with acceptance criteria.
---

# Task Breakdown

## Goal
Turn a vague or medium/large task into a clear, actionable execution plan that any agent can pick up and run with.

## When to Use
- Task touches more than 3 files
- Task involves multiple concerns (e.g., API + DB + UI)
- Task description is vague ("add user management", "fix performance")
- Multiple agents or sessions will work on it

## Process
1. Clarify the problem — what is the actual goal? What does "done" look like?
2. Identify the scope — which files/modules are affected?
3. Split into lanes — each lane should be independently implementable and testable
4. Define acceptance criteria — specific, verifiable conditions (not "works well")
5. List risks — what could go wrong, what needs extra care

## Output Format
Create a plan file (`docs/plans/YYYY-MM-DD-short-kebab-name.md`) containing:
- Problem summary (2-3 sentences max)
- Scope (list of files/modules)
- Acceptance criteria (checkboxes)
- Lanes with clear boundaries (who does what, no overlap)
- Files likely affected per lane
- Risks and mitigation
- Verification commands

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "I understand it, I'll just start coding" | If it isn't written down, the next agent/session doesn't understand it — and neither will you in a week. |
| "Breaking it into lanes is overhead" | Overlapping unscoped work causes merge conflicts and rework that costs far more than the breakdown. |
| "Acceptance criteria are obvious" | "Obvious" criteria are where scope silently drifts. Write the concrete, verifiable condition. |
| "It's vague but I'll figure it out as I go" | Vague-in means vague-out. Clarify the goal and "done" first, or you'll build the wrong thing fast. |

## Rules
- Lanes must NOT overlap — if two lanes touch the same file, define who owns which part
- Each lane must be testable independently
- Do not start coding before the breakdown is approved
- Prefer updating an existing plan over creating duplicates
- Keep acceptance criteria concrete: "API returns 401 for invalid token" not "auth works"
- If a task is too small for lanes (< 3 files, single concern), skip the breakdown — just create a task file directly
