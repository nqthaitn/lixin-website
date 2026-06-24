---
name: incremental-implementation
description: Auto-trigger when implementing a plan that touches multiple files, building a feature in steps, or about to write a large change before testing. Enforces the implement → test → verify → commit loop in small revertable slices.
---

# Incremental Implementation

## Goal
Turn an approved plan into working code through small, independently testable slices — so bugs surface early, each step is revertable, and review stays easy.

## When to Use
- Implementing a plan/task that touches more than one file
- Building a feature that has a clear sequence of steps
- Refactoring existing code
- About to write a large change (>~100 lines) before running anything

NOT for: a single-file, single-function change that is already narrowly scoped — just do it.

## The Loop
For each slice, repeat:

```
Implement → Test → Verify → Commit → Next slice
```

Each slice must leave the system in a working state (compiles, tests pass). Prefer **vertical slices** (one thin end-to-end path) over horizontal layers, so every commit is demonstrable.

## Rules
- One slice addresses one logical concern — nothing else.
- Touch only the code the slice requires. Don't clean adjacent code, fix unrelated imports, or add speculative features — note them separately for a later task.
- Keep the build green and tests passing between slices.
- New, incomplete behavior stays off by default (feature flag / guarded) until the whole feature is done.
- Make each slice independently revertable — minimize edits to existing code.
- No premature abstraction — extract a shared helper only when the 3rd duplicate appears (see [[CLAUDE.md DRY rule]]).

## Anti-Rationalization
When you catch yourself thinking the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "I'll test it all at the end" | Bugs compound — a bug in slice 1 makes slices 2-5 wrong, and you won't know which. |
| "It's faster to do it all at once" | Large changes hide bugs and make rollback painful. Small slices are faster to debug. |
| "These changes are too small to commit separately" | Small commits are free and make `git bisect` / review trivial. |
| "I'll add the feature flag later" | Incomplete features must not be user-visible — flag it now, not after merge. |
| "This refactor is small enough to fold in" | Mixed refactor + feature is the hardest thing to review and to revert. Split it. |
| "Let me run the build once more to be sure" | Re-running with no code change adds no information. Change something or move on. |

## Verification Gate (per slice)
Do not move to the next slice until ALL are true — and state the evidence, don't assert it:
- [ ] One logical concern, fully addressed
- [ ] Existing tests pass (paste/observe the command output)
- [ ] Build succeeds
- [ ] Lint / type checks pass
- [ ] New behavior confirmed working (test or manual observation)
- [ ] A descriptive commit made for this slice

## On Completion
- All slices individually tested and committed
- Full test suite passes
- Build is clean
- Feature works end-to-end per the plan's acceptance criteria
- No uncommitted changes left behind
- Update the task status and verification notes (see [[handoff-writing]] if stopping mid-way)
