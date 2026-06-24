---
name: documentation
description: Auto-trigger when adding/updating a README, API docs, usage guides, or documenting a public interface. Ensures docs capture the why and how-to-use (what code can't say) and stay in sync with the change.
---

# Documentation

## Goal
Document what a reader can't get from reading the code — the why, the how-to-use, and the contract — and keep it true by updating it in the same change that changes behavior.

## What to Check First
- Where docs already live (README, /docs, doc comments) and their format
- The audience: end user, integrating developer, or operator — each needs different docs
- The public/consumed surface that needs a documented contract
- Whether existing docs already drifted from the current behavior

## Default Approach
1. Document the contract and the "why", not a line-by-line restatement of the code. Code says *what*; docs say *why* and *how to use*.
2. A README answers four things fast: what it is, how to install, how to run, how to test.
3. For a public API/CLI/library surface, document inputs, outputs, errors, and a runnable example.
4. Prefer a concrete example over paragraphs of prose — readers copy examples.
5. Update docs in the same commit that changes the behavior; doc drift is worse than no docs because it misleads.
6. Match the mode — a light/MVP project needs a good README, not a manual. Don't gold-plate.

## Output Expectations
- What was documented and for which audience
- Where it lives and how it's discoverable
- A usage example for any public surface
- Anything intentionally left undocumented (and why)

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "The code is self-documenting" | Code documents *what it does*, never *why it exists* or *how to use it from outside*. Those still need words. |
| "I'll write the docs later" | "Later" is after you've forgotten the context that made them worth writing. Document while it's fresh, in the same change. |
| "Comment every line" | Line-by-line comments restate the code and rot the fastest. Document decisions and contracts, not syntax. |
| "Examples take too long" | An example is the first thing a reader copies. Skipping it pushes the cost onto every future reader instead. |

## Gotchas
- Do not let docs describe behavior the code no longer has — drift misleads
- Do not restate code in prose; capture intent, contract, and usage
- Do not ship a public surface with no usage example
- Do not over-document a light project into a manual nobody maintains
- Do not document a breaking change only in code — surface it where consumers read
