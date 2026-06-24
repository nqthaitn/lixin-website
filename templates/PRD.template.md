# PRD-XXX — <feature / product name>

> Product Requirements: WHAT cần xây và điều kiện "done". Là nguồn sự thật cho acceptance criteria.
> Mode markers: `[standard+]` cho product/enterprise; `[enterprise]` chỉ enterprise.
> Mode `light` chỉ cần: Summary, User Stories, Acceptance Criteria, Out of Scope.

## Status
Draft <!-- Draft | Reviewed | Approved | Implemented -->

## Mode
light <!-- light | standard | enterprise -->

## Summary
<2-4 câu: xây gì, cho ai, vì sao bây giờ. Link tới BRIEF nếu có.>

## User Stories
- As a <user>, I want <capability>, so that <benefit>.
- As a <user>, I want <capability>, so that <benefit>.

## Functional Requirements
1. <yêu cầu chức năng cụ thể, kiểm chứng được>
2. <...>

## Acceptance Criteria
> Cụ thể, đo được. "API trả 401 khi token hết hạn" — KHÔNG phải "auth hoạt động".
- [ ] <criterion 1>
- [ ] <criterion 2>

## Out of Scope (Non-Goals)
- <không làm trong phạm vi này>

<!-- [standard+] -->
## Edge Cases & Error States
- <empty state / loading / lỗi mạng / input không hợp lệ / quyền truy cập>

## Non-Functional Requirements (NFR)
- Performance: <vd: p95 < 300ms>
- Security: <vd: input validation, authz per resource — xem skill security-check>
- Accessibility: <vd: WCAG AA cho UI>
- Observability: <log/metric/trace cần có>

## Dependencies
- <hệ thống / API / team / quyết định khác mà việc này phụ thuộc>

## Rollout / Release Plan
- <feature flag? migration? backward-compat? thứ tự release?>

<!-- [enterprise] -->
## Requirements Traceability
| Req ID | Requirement | Acceptance Criterion | Test | Status |
|--------|-------------|----------------------|------|--------|
| FR-1   | <...>       | <...>                | <test id> | Open |

## Risk Register
| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|------------|-------|
| <...> | Low/Med/High | Low/Med/High | <...> | <name> |

## Compliance / Data Handling
- <PII? data retention? GDPR/HIPAA/...? audit log?>

## Approvals
- [ ] Product: <name> — <date>
- [ ] Engineering: <name> — <date>
- [ ] Security: <name> — <date>

## Links
- Brief: <docs/specs/BRIEF.md>
- ADRs: <docs/decisions/ADR-###-...>
- Plans/Tasks: <docs/plans/...>, <docs/tasks/...>
