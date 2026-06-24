---
name: security-check
description: Auto-trigger when code handles user input, auth/authz changes, API endpoints, database queries, file uploads, or dependency updates. Checks OWASP top 10, secrets exposure, injection, auth bypass.
---

# Security Check

## Goal
Catch security vulnerabilities before they reach production.

## When to Use
- Any code that handles user input
- Authentication/authorization changes
- API endpoint changes
- Database query changes
- File upload/download features
- Dependency updates
- Before shipping (part of `/ship-check`)

## Process
Before running the checklist, **read the actual code** and trace data flows:
1. Identify all entry points (API routes, form handlers, webhooks)
2. For each entry point, trace: client input → validation → persistence → output
3. Check auth consistency: compare auth guards across ALL HTTP methods on the same route
4. Check trust boundaries: where does the code switch from untrusted (client) to trusted (DB/server)?

## Checklist

### Business Logic & Trust Boundaries
- [ ] Server NEVER trusts client-supplied prices, totals, discounts, or quantities — always recompute from DB
- [ ] Client-supplied IDs (product_id, user_id) are validated against DB before use
- [ ] State transitions are validated server-side (e.g., order status, payment status)
- [ ] No TOCTOU: data read for validation is the same data used for the operation

### Authentication & Authorization
- [ ] Auth guards applied consistently to ALL HTTP methods on protected routes (GET, POST, PUT, DELETE)
- [ ] No auth bypass paths — check every route handler, not just the obvious ones
- [ ] Admin-only data (drafts, inactive records, internal fields) requires admin auth even on GET
- [ ] Passwords are hashed with bcrypt/argon2 (not MD5/SHA1)
- [ ] JWT tokens have expiry and are validated on every request
- [ ] Authorization checks on every resource access (not just route level)

### Injection
- [ ] SQL: all queries use parameterized statements, never string concatenation
- [ ] NoSQL: queries use safe builders, no raw user input in operators
- [ ] Command: no `exec()`/`system()` with user input; if unavoidable, whitelist + escape
- [ ] XSS: all user-generated content is escaped for the correct context (HTML/JS/URL/CSS)

### Data Exposure
- [ ] No secrets/tokens/passwords in code, config files, or logs
- [ ] Sensitive data (PII, tokens) not logged even at debug level
- [ ] API responses don't leak internal IDs, stack traces, or debug info in production
- [ ] `.env`, credentials files, and private keys are in `.gitignore`

### Configuration
- [ ] CORS is configured restrictively (not `*` in production)
- [ ] Security headers set (HSTS, X-Frame-Options, CSP, etc.)
- [ ] Debug mode disabled in production
- [ ] Default credentials changed

### Dependencies
- [ ] No known vulnerable dependencies (`npm audit` / `pip audit` / equivalent)
- [ ] Dependencies are pinned to specific versions
- [ ] No unnecessary dependencies with broad system access

## Output
- **Critical**: must fix before shipping (injection, auth bypass, secret exposure)
- **High**: should fix before shipping (missing rate limit, permissive CORS)
- **Medium**: fix soon (missing security headers, verbose error messages)
- **Info**: noted for awareness (dependency update available)

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "No one would think to exploit this" | Attackers automate the obvious. "Nobody would" is the assumption behind most breaches. |
| "It's validated on the client already" | Client validation is UX, not security — the attacker skips your client entirely. Re-validate server-side. |
| "This endpoint is internal only" | Internal today, exposed after one refactor or SSRF. Trust boundaries move; auth shouldn't be optional. |
| "It's just a prototype / we'll harden later" | Prototypes ship. "Later" is when the secret is already in git history and the bypass is in prod. |

## Rules
- Every finding must include: what's wrong, where (file:line), how to fix, severity
- Don't cry wolf — only flag real risks, not theoretical concerns
- If unsure whether something is a vulnerability, flag it as a question, not a finding
- Check both the code being reviewed AND its integration points
- Always trace the full data flow — a fix in one place can be defeated by missing validation upstream
- Compare auth on GET vs POST/PUT/DELETE on the same route — inconsistency is a common blind spot
