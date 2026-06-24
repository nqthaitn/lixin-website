Quickly update a task file's status and notes without breaking flow.

Steps:
1. Find the relevant task file in `docs/tasks/`
   - If the user specifies a task ID (e.g., TASK-001), find that file
   - If not specified, find the most recently modified task file
2. Update the **Status** field to one of:
   - `Planned` — not started
   - `In Progress` — actively being worked on
   - `Blocked` — waiting on something (note what in Notes)
   - `In Review` — code done, waiting for review
   - `Done` — all acceptance criteria met
3. Add a timestamped note in the **Notes** section if there's context worth recording:
   - What was just completed
   - What blocker was hit
   - Any decision made during implementation
4. Update **Next Step** to reflect the current reality
5. Update `TODO.md` if the change affects the backlog

Rules:
- Keep notes concise — one line per update, not paragraphs
- Do NOT change scope or acceptance criteria here — that requires updating the plan
- If status changes to Blocked, always note what it's blocked on
- If status changes to Done, verify all acceptance criteria are actually met first
