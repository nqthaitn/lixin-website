---
name: tdd
description: Auto-trigger when implementing non-trivial logic, fixing a bug, or building a feature with clear input/output. Enforces red → green → refactor — write a failing test first, make it pass with the minimum code, then clean up.
---

# TDD (Red → Green → Refactor)

## Goal
Drive implementation with tests so behavior is defined before code exists, code stays minimal,
and every change is covered. Pairs with `test-strategy` (decides WHAT to test) — this skill is the LOOP.

## When to Use
- Non-trivial logic with clear input/output (parsers, calculations, validation, state machines).
- Fixing a bug → write a failing test that reproduces it first (regression lock).
- A feature where acceptance criteria are already concrete (from the PRD).

## When to Skip
- Pure UI/layout, throwaway prototypes, config/wiring, trivial getters.
- Exploratory spikes where the interface is still unknown (write tests once it settles).

## The Loop (one small slice at a time)
1. **Red** — write ONE failing test for the next small behavior. Run it; confirm it fails
   for the right reason (asserts the behavior, not a typo/import error).
2. **Green** — write the MINIMUM code to pass. No extra features, no speculative abstraction.
   Run the test; confirm green.
3. **Refactor** — clean up code AND test (names, duplication) while staying green. Re-run.
4. Commit the slice, then repeat for the next behavior.

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "I'll write the code first, tests right after" | "Right after" never comes the same — and you've now baked the implementation into the test. Test first or it isn't TDD. |
| "I know this will pass, skip watching it fail" | A test that never failed proves nothing — it might be asserting a typo. Watch red first. |
| "Let me write all the tests, then all the code" | That's not the loop. One failing test → minimum code → green. Batching hides which test drove which line. |
| "The bug's obvious, just fix it" | A fix with no failing-test-first has no regression lock — it'll silently come back. Reproduce in a test first. |

## Rules
- Test first — if code exists before its test, you're not doing TDD; add the test now and continue.
- One behavior per cycle — don't write five tests then all the code.
- Watch the test fail before making it pass — a test that never failed proves nothing.
- Minimum code to green — resist building beyond the current failing test (see Agent Behavior: simplicity).
- Test behavior, not implementation — refactoring internals must not break tests.
- A bug fix is not done until a test that failed before the fix now passes.
- Don't weaken a test to make it pass — fix the code, or fix the test for the right reason.
- Derive test cases from the PRD acceptance criteria when one exists.
