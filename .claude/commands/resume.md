Resume work from where the last session left off.

Steps:
1. Scan `docs/handoff/` for the most recent handoff file (by date in filename)
2. Scan `docs/tasks/` for tasks with status `In Progress` or `Blocked`
3. Read the relevant handoff and task files
4. Read the associated plan in `docs/plans/` if referenced
5. Present a brief summary to the user:
   - **Active task(s)**: task ID, title, status
   - **Last handoff**: what was done, what's left
   - **Open questions/blockers**: anything unresolved
   - **Suggested next step**: the most logical next action
6. Wait for the user to confirm or redirect before starting work

Rules:
- If no handoff or active task exists, say so and ask what to work on
- Do NOT start coding automatically — present state first, let user decide
- If multiple tasks are in progress, list all and ask which to focus on
- Keep the summary short — 10 lines max, not a wall of text
