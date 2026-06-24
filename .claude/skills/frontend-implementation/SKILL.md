---
name: frontend-implementation
description: Auto-trigger when implementing or modifying frontend UI — pages, components, forms, tables, modals, navigation, responsive layouts, client-side interactions. Ensures reuse of existing patterns and handles edge states.
---

# Frontend Implementation

## Goal
Implement frontend changes that are clear, scoped, consistent, and easy to review.

## What to Check First
- Existing UI patterns in the repo
- Shared components and design system usage
- State/data flow already used by the app
- Responsive behavior for the affected screen
- Existing validation, loading, error, and empty states

## Default Approach
1. Reuse existing components before creating new ones
2. Keep visual and naming consistency with current codebase patterns
3. Preserve current behavior unless the task explicitly changes it
4. Add missing loading, error, and empty states when relevant
5. Keep styling changes local and minimal

## Output Expectations
- Clear list of files changed
- Brief summary of UI behavior added or changed
- Mention responsive/accessibility concerns if relevant
- Mention anything intentionally left out of scope

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "The happy path renders, it's done" | Empty, loading, error, and disabled states ARE the feature in production. Skipping them ships a broken UI the first time data is slow or absent. |
| "Faster to make a new component than find the existing one" | Faster today, fragmented forever. Search for the existing primitive first — duplicates rot the design system. |
| "These edge states rarely happen" | "Rarely" = a user hits it on day one and files a bug. Handle the states the screen can actually reach. |
| "I'll just tweak this shared component a bit" | A "bit" on a shared component changes every screen that uses it. Check the blast radius and call it out. |

## Gotchas
- Do not invent a new design language for one screen
- Do not mix styling approaches unless the repo already does so
- Do not change unrelated shared components without calling it out
- Do not ignore edge states just because the happy path works
