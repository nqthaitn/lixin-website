---
name: backend-implementation
description: Auto-trigger when implementing or modifying backend logic — API endpoints, services, business rules, database schema/migrations, data access, background jobs, integrations. Ensures correct layering, safe data changes, and validated input.
---

# Backend Implementation

## Goal
Implement backend changes that are correct, scoped, secure, and testable — without breaking existing contracts or data.

## What to Check First
- Existing API conventions (routing, request/response shape, status codes, error envelope)
- The current data model and how schema changes are applied (migration tool, naming, up/down)
- Existing layering (e.g. controller → service → repository) and where business logic lives
- Existing validation, auth/authz, and error-handling patterns
- Transaction boundaries and how failures are surfaced today
- Whether a contract is public/consumed — changing it has downstream blast radius

## Default Approach
1. Follow the existing layering; keep business logic out of controllers and out of the data layer. Depend on abstractions, not concrete framework/DB types (see `architecture-review`).
2. Validate and authorize every request at the boundary before touching data (see `security-check`).
3. Schema changes go through reversible migrations — add a new migration; never edit one already applied. Provide a down/rollback path.
4. Make data access explicit about transactions: wrap multi-write operations, and decide failure behavior on purpose (rollback vs partial).
5. Keep API contracts backward-compatible; if a breaking change is unavoidable, version it and say so.
6. Return consistent error shapes and correct status codes — don't leak internals or stack traces.
7. Cover non-trivial logic with tests (see `tdd` / `test-strategy`); test behavior at the service boundary, not the ORM.

## Output Expectations
- Clear list of files changed
- Endpoints/contracts added or changed (method, path, request → response, status codes)
- Any migration added, and whether it's backward-compatible / how to roll back
- Data or contract changes that affect existing consumers, called out explicitly
- Anything intentionally left out of scope

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "It returns 200, it's done" | The error, auth-failure, and not-found paths ARE the API. A handler without them ships a security hole or a silent data bug. |
| "I'll just tweak the existing migration" | An applied migration is immutable history — editing it diverges every environment. Add a new one. |
| "Validation can happen on the frontend" | The frontend is not a trust boundary. Anything the server accepts must be validated server-side, every time. |
| "One more query in the loop is fine" | That's an N+1 that melts under real data volume. Batch it or join it before it ships. |
| "Small change to the response shape" | A consumer somewhere parses that shape. Treat the contract as public — version or keep it compatible. |
| "Wrap it in try/catch and move on" | A swallowed error is a bug you'll debug at 2am with no logs. Handle it or let it surface with context. |

## Gotchas
- Do not build business logic inside controllers or inside the ORM/data layer
- Do not concatenate SQL or interpolate user input into queries — parameterize
- Do not hardcode secrets/connection strings — read from env/config
- Do not change a public API contract without versioning or a compatibility note
- Do not return unbounded result sets — paginate or cap
- Do not log PII, tokens, or full request bodies
