---
name: test-strategy
description: Auto-trigger when starting a new feature, adding tests to untested code, or reviewing test coverage gaps. Decides unit vs integration vs e2e, what to mock, what to skip.
---

# Test Strategy

## Goal
Define what tests are needed for a change — no over-testing, no under-testing.

## When to Use
- Starting a new feature (before writing code)
- Adding tests to untested code
- Deciding between unit/integration/e2e tests
- Reviewing test coverage and finding gaps

## Testing Pyramid
Priority from bottom (most) to top (least):

### Unit Tests (most tests here)
- Pure business logic, calculations, transformations
- Input validation and edge cases
- Error handling paths
- Fast, isolated, no external dependencies

### Integration Tests
- API endpoints (request → response)
- Database queries (with real/test DB, not mocks)
- Service-to-service communication
- Authentication/authorization flows

### E2E Tests (fewest tests here)
- Critical user journeys only (login, checkout, core workflow)
- Smoke tests for deployment verification
- Do NOT e2e test every edge case — that's what unit tests are for

## Decision Framework
For each piece of changed/new code, ask:

| Question | If yes → |
|----------|----------|
| Pure logic, no dependencies? | Unit test |
| Talks to DB/API/filesystem? | Integration test |
| Critical user flow? | E2E test |
| Already covered by existing test? | Skip (don't duplicate) |
| Trivial getter/setter? | Skip (not worth testing) |
| Config/wiring only? | Integration test covers it |

## What NOT to Test
- Framework internals (trust your framework)
- Trivial code: getters, setters, simple pass-through
- Implementation details: internal state, private methods, call order
- Third-party libraries (test YOUR integration, not their code)

## Naming Convention
```
should_<expected_behavior>_when_<condition>
```
Examples:
- `should_return_401_when_token_expired`
- `should_create_user_when_email_is_unique`
- `should_throw_when_input_is_empty`

## Coverage Guidelines
- New code: aim for >80% line coverage on business logic
- Don't chase 100% — diminishing returns after ~85%
- Coverage number alone means nothing — test BEHAVIOR, not lines
- 50% coverage with good behavioral tests > 95% coverage with trivial assertions

## Output
When defining a test strategy, produce:
- List of test cases grouped by level (unit/integration/e2e)
- Files where tests should live
- What can be skipped and why
- Mocking strategy: what to mock, what to use real instances

## Rules
- Test behavior, not implementation — if you refactor and tests break, the tests were wrong
- If a test needs >3 mocks, the code under test probably has too many dependencies — flag as design issue
- Flaky tests must be fixed or deleted — never skip and forget
- Every bug fix should come with a regression test
