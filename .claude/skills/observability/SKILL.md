---
name: observability
description: Auto-trigger when adding logging, metrics, error tracking, health checks, or tracing — or when code runs in production without diagnosability. Ensures the running system can be understood when it breaks, without leaking sensitive data.
---

# Observability

## Goal
Make the running system diagnosable: know when it breaks, and have enough signal to find out why — without logging things you shouldn't.

## What to Check First
- Existing logging framework, format (structured vs plain), and level conventions
- Whether error tracking/alerting exists (e.g. Sentry) or errors only land in logs
- Existing metrics, health/readiness endpoints, and dashboards
- Whether a correlation/request ID is propagated across layers and external calls
- What is sensitive (PII, tokens, secrets) and must never be logged (see `security-check`)

## Default Approach
1. Log at boundaries — request in/out, external calls, and failures — with structured context, not scattered prints in the middle of logic.
2. Every error path emits enough to diagnose: which operation, which entity (by id, not by PII), and the cause.
3. Use levels on purpose: `error` = needs action, `warn` = suspicious but handled, `info` = lifecycle events, `debug` = development detail.
4. Add a health/readiness check for anything deployed, so a bad instance is detectable automatically.
5. Propagate a correlation/request ID end-to-end so one request can be traced across services and logs.
6. Send errors to central tracking with alerting; don't rely on a human tailing logs to notice failures.
7. Emit a few key metrics for critical paths (latency, error rate, throughput) — enough to answer "is it healthy?".

## Output Expectations
- What was instrumented and where (logs, metrics, health endpoint, error tracking)
- The fields/context attached to errors and key log lines
- The correlation/request ID strategy, if added or changed
- What is intentionally NOT logged (and why)

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "If it breaks we'll add logging then" | Production failures aren't reproducible on demand. Instrument the failure paths before they fire, not after. |
| "Log the whole request so we have everything" | Full request bodies leak PII/tokens and bury the signal. Log the specific fields you'd actually need, by id. |
| "catch, log, and rethrow at every layer" | That's the same error five times with no new info. Log once where you have the most context; let it propagate. |
| "A health check is overkill here" | Without one, a wedged instance keeps taking traffic until users complain. It's a few lines and it's the deploy's safety net. |
| "We can grep the logs when someone reports it" | By then the user already hit it twice. Central error tracking + alerting catches it before the report. |

## Gotchas
- Do not log PII, secrets, tokens, passwords, or full payloads
- Do not log-and-rethrow the same error at every layer
- Do not use `error` level for things that are handled, or `info` for noise — levels lose meaning
- Do not leave stray `console.log`/`print` debugging in shipped code
- Do not swallow an error silently — at minimum it must be observable somewhere
- Do not add so much logging that the signal drowns; instrument the paths that matter
