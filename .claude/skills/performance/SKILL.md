---
name: performance
description: Auto-trigger when something is reported slow, when optimizing code, or when adding work to a hot path (loops, queries, rendering, large data). Enforces measure-first optimization and guards against premature or unmeasured tuning.
---

# Performance

## Goal
Make it fast enough by measuring the real bottleneck and fixing that — not by guessing or micro-optimizing on intuition.

## What to Check First
- Is there a *measured* problem, or a hunch? Get a number before touching anything.
- What's the target — what does "fast enough" mean for this path (latency, throughput, budget)?
- Existing profiling/metrics, and the actual hot path (where time/memory really goes)
- The data volume in production, not in the dev sample (slow appears at scale)

## Default Approach
1. Measure first — profile or benchmark to locate the real bottleneck before changing code. Intuition about "what's slow" is wrong often enough that guessing wastes the effort.
2. Set a target so you know when to stop; optimization without a goal never ends.
3. Fix the biggest cost first: algorithmic complexity and I/O (N+1, unbounded work, missing index) usually dominate — micro-CPU tuning rarely matters.
4. Optimize only the hot path; keep cold code readable. A 2% gain that hurts clarity is a net loss.
5. Re-measure after each change to confirm it actually helped — and didn't move the cost elsewhere.
6. Guard the win: add a benchmark or limit so the regression can't silently come back.

## Output Expectations
- The measurement: before/after numbers and how they were taken
- The bottleneck identified and why it dominated
- What changed and the trade-off (memory, complexity, readability)
- Any cache added, and its invalidation strategy
- What was intentionally left un-optimized (and why it's fine)

## Anti-Rationalization
When you think the left column, the right column is the reality:

| Excuse | Reality |
|--------|---------|
| "This looks slow, optimize it" | "Looks slow" is a guess. Profile it — the real cost is usually somewhere you didn't expect. |
| "Optimize everything while I'm here" | Untargeted optimization trades readability for gains nobody measured. Tune the hot path, leave the rest clear. |
| "Just add a cache" | A cache without an invalidation strategy is a correctness bug waiting to happen. Decide staleness before caching. |
| "It's fast on my machine" | Your dev dataset isn't production scale. The N+1 that's invisible on 10 rows melts on 10 million. |
| "Re-measuring is overkill" | Unverified optimizations often move the bottleneck or do nothing. Confirm the number changed. |

## Gotchas
- Do not optimize without a before/after measurement
- Do not micro-optimize at the cost of readability for unmeasured gains
- Do not introduce a cache without deciding how/when it's invalidated
- Do not benchmark on tiny dev data and assume it holds at scale
- Do not fix a symptom (add an index) without understanding the cause (N+1 query)
