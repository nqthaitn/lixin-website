---
name: handoff-writing
description: Auto-trigger when stopping mid-task, handing work to another agent/model, task is blocked, or session is ending with incomplete work. Creates self-contained handoff with exact file paths, test status, and concrete next action.
---

# Handoff Writing

## Goal
Leave the next session/agent with enough context to resume immediately — no archaeology needed.

## When to Use
- Stopping mid-task (end of session, context limit, switching focus)
- Handing work to a different agent or model
- Task is blocked and will be picked up later

## Include
- **Current state**: what is done, what is in progress, what is not started
- **Changed files**: exact paths + one-line description of each change
- **Test status**: which tests pass, which fail, which are new
- **Open questions**: decisions pending, unclear requirements, blockers
- **Next recommended action**: the ONE thing to do first — specific enough to start immediately
- **Risks**: what breaks if the next agent isn't careful

## Rules
- Never write vague handoffs like "continue the feature" or "finish implementation"
- The next action must be a concrete step: "Write test for POST /auth/login in tests/auth.test.ts" not "add tests"
- Always include file paths — the next agent shouldn't have to search
- If tests are failing, note which ones and the error message
- Handoff should be self-contained — reader should NOT need to dig through git log
- Check if a handoff file already exists before creating a new one — update instead of duplicate

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "The next agent will figure it out" | "Figuring it out" means re-reading everything you already know. Write the state down — that's the whole point. |
| "It's all in the git log / diff anyway" | A handoff that needs git archaeology isn't a handoff. Make it self-contained: paths, status, next action. |
| "'Continue the feature' is enough direction" | Vague next-actions stall the next session. Give ONE concrete step: file + what to do, specific enough to start now. |
| "I'll skip the test status, they can re-run" | Re-running to discover what you already saw wastes a cycle. Note which pass/fail and the error. |

## Process
1. Read current task and plan files
2. Run `git diff` and `git status` to capture state
3. Create/update handoff file in `docs/handoff/YYYY-MM-DD-short-kebab-name.md`
4. Update task status
5. Update `TODO.md` if backlog changed
