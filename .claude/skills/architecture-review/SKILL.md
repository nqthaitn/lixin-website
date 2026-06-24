---
name: architecture-review
description: Auto-trigger when adding new modules/services, changing layer boundaries or dependency direction, introducing new design patterns, or refactoring existing structure. Evaluates Clean Architecture and SOLID compliance.
---

# Architecture Review

## Goal
Ensure code structure follows Clean Architecture and SOLID principles before implementation starts or grows too large to refactor.

## When to Use
- Adding a new module, service, or major feature
- Refactoring existing structure
- PR introduces new dependencies or changes layer boundaries
- Something "feels wrong" about where code lives

## Checklist
### Layer Separation
- [ ] Business logic is free of framework/infrastructure imports
- [ ] Dependencies flow inward: infrastructure → use cases → domain
- [ ] No circular dependencies between modules
- [ ] Each layer communicates through interfaces, not concrete implementations

### SOLID Check
- [ ] **S**: Does each class/module have a single reason to change?
- [ ] **O**: Can this be extended without modifying existing code?
- [ ] **L**: Can subclasses substitute their parents without breaking behavior?
- [ ] **I**: Are interfaces focused and minimal (no god interfaces)?
- [ ] **D**: Do high-level modules depend on abstractions, not details?

### Practical Concerns
- [ ] No god classes/files (>300 lines is a smell, >500 needs splitting)
- [ ] No circular imports
- [ ] Shared utilities have clear contracts (input/output/error)
- [ ] External services are behind adapters/interfaces (swappable, testable)
- [ ] Config and secrets are injected, not imported directly

## Output
- List of violations found (with file paths and specific issues)
- Recommended fixes (concrete, not vague)
- If clean: explicit approval with brief reasoning

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "I'll fix the structure later, after it works" | "Later" is after 10 more files depend on the wrong structure. The cheapest moment to fix is now. |
| "It's small, I'll just put it here for now" | "For now" is how business logic ends up importing the framework. Put it in the right layer the first time. |
| "Adding the interface is over-engineering" | Without the seam, the external service isn't swappable or testable. One interface ≠ enterprise architecture. |
| "This god class is fine, splitting is risky" | A 500-line class is already the risk — every change touches everything. Note it as tech debt at minimum. |

## Rules
- Review structure BEFORE implementation when possible — cheaper to fix early
- Don't enforce patterns for their own sake — justify each recommendation
- Small projects don't need enterprise architecture — scale recommendations to project size
- If a violation exists but fixing it would be a major refactor, note it as tech debt with a recommended follow-up task
