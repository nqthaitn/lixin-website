Systematic debugging workflow. Do not guess — investigate.

Steps:
1. **Reproduce**: confirm the bug exists. Run the failing command/test and capture the exact error.
2. **Isolate**: narrow down where the bug lives.
   - Read the error message and stack trace carefully
   - Identify the file and line where the error originates
   - Check recent changes with `git diff` and `git log --oneline -10` — did this work before?
3. **Understand**: before fixing, understand WHY it breaks.
   - Read the relevant code (not just the error line — read the surrounding context)
   - Trace the data flow: what input → what function → what output?
   - Check assumptions: are the inputs what you expect? Are dependencies correct?
4. **Fix**: make the smallest change that fixes the root cause.
   - Fix the cause, not the symptom
   - Do NOT add workarounds or suppress errors
   - Do NOT change unrelated code
5. **Verify**: confirm the fix works and nothing else broke.
   - Run the originally failing test/command — it should pass now
   - Run the full test suite — no new failures
   - Run lint/typecheck if available
6. **Document**: if the bug was non-obvious, leave a brief note.
   - Comment in code only if the fix is surprising
   - Update task file if this was a tracked task

Anti-rationalization — when you think the left, the reality is the right:

| Excuse | Reality |
|--------|---------|
| "It's probably this line, let me just change it" | "Probably" is a guess. Read the error + trace the data flow first — wrong guesses add new bugs. |
| "A try/catch here will make the error go away" | Swallowing the error hides the cause; it resurfaces worse later. Fix the root, don't suppress it. |
| "Can't reproduce it, but I think I know the fix" | A fix you can't verify against a reproduction is a hope, not a fix. Reproduce first or ask for context. |
| "While I'm here, let me clean up this nearby code" | Bundling unrelated changes makes it impossible to tell what actually fixed the bug. One bug = one fix. |

Rules:
- Never guess-and-check blindly — read the error first
- Never fix by adding try/catch that swallows the error
- If the bug is in a dependency or external service, document it and escalate — don't hack around it
- If you can't reproduce, say so and ask for more context
- One bug = one fix. Don't bundle unrelated changes.
