---
name: frontend-review
description: Auto-trigger when reviewing frontend changes — checks UI consistency, UX issues, responsive behavior, accessibility basics, state handling, and regression risk in shared components.
---

# Frontend Review

## Goal
Review frontend work beyond just 'does it render' and catch common UI, UX, and maintainability issues — including design-system consistency.

## Review Checklist
- Does the change match the requested scope?
- Does it follow the existing design system and component patterns?
- **Consistency / drift**: does it reuse existing shared components and tokens instead of creating near-duplicates? Flag duplicated buttons/inputs/cards with different naming, and one-off styles that drift from nearby screens.
- Does it handle loading, empty, error, and disabled states where needed?
- Is the responsive behavior reasonable for common screen sizes?
- Are labels, buttons, and interactions understandable?
- Are there accessibility basics such as semantic structure, labels, focus flow, or button/link correctness?
- Is state handling simple and consistent with the repo's existing approach?
- Are there obvious regression risks in shared components or layout wrappers?

## Consistency Baseline
Judge against the repo's existing design language. If the repo has **no design system yet**, "existing" means the conventions of nearby screens; where none exist, fall back to the Concrete Rules below so early screens set a coherent baseline instead of each inventing its own.

### Concrete Rules (stack-agnostic)
Defaults to apply when the repo has no stronger convention. Follow the *reason*, not the literal value, if the repo already decided differently.

- **One accent color.** A screen gets a single accent (links, primary action, focus); everything else is grayscale. *Why:* multiple "important" colors compete, nothing reads as primary, and the UI looks like a template demo.
- **Pure black/white is a smell.** Prefer near-black text (e.g. `#1A1A1A`–`#2A2A2A`) and off-white surfaces. *Why:* `#000` on `#FFF` is harsh, vibrates on screens, and signals "default values, no decision made."
- **One spacing scale, one radius.** Pick a step scale (e.g. 4/8/12/16/24) and a single corner radius; reuse them everywhere. *Why:* mixed paddings and 2–3 different radii are the most visible tell of AI-generated UI.
- **Hierarchy by weight/size/space, not by color.** Separate heading vs body vs caption with type scale and spacing first; reach for color last. *Why:* color-coded hierarchy breaks for color-blind users and collapses in grayscale/print.
- **Every list/data view needs four states.** Design loading, empty, error, and populated — not just populated. *Why:* empty and error states are what real users hit first when data is slow or absent.
- **Borders OR shadows OR fills to separate — pick one per context.** Don't stack a border *and* a shadow *and* a background tint on the same card. *Why:* layered separators add visual noise and make the surface look heavier than its importance warrants.

## Output Format
- What looks good
- Issues found
- Severity: high / medium / low
- Suggested follow-up actions

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "It looks fine, approve it" | "Looks fine" is a screenshot, not a review. Check states, interaction, and consistency — looks-fine UIs break on the second click. |
| "It renders, so it works" | Rendering ≠ working. Empty/error states, focus flow, and shared-component regressions don't show in a quick glance. |
| "Small change to a shared component, low risk" | Shared = high blast radius by definition. Trace every screen it touches before calling it low risk. |
| "Accessibility can be a follow-up" | Semantic structure and labels are cheap now and a rewrite later. Catch the basics in review. |

## Gotchas
- Do not review only visuals; check interaction behavior too
- Do not suggest large redesigns unless requested
- Do not ignore consistency with existing screens
- If a component is shared, call out blast radius clearly
