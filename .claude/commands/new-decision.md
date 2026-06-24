Record an architecture or design decision as an ADR (Architecture Decision Record).

Steps:
1. Scan `docs/decisions/` to find the highest existing ADR number
2. Increment to get the next ADR ID (e.g., ADR-001 → ADR-002)
3. Ask the user (or infer from context) for:
   - What decision was made
   - Why it was needed (context/constraints)
   - What alternatives were considered
4. Create the file at `docs/decisions/ADR-{NNN}-{short-kebab-name}.md` using `templates/ADR.template.md`
5. Fill in:
   - **Status**: `Accepted` (or `Proposed` if still under discussion)
   - **Context**: the situation and constraints that led to this decision
   - **Decision**: what was chosen and why
   - **Consequences**: both positive outcomes and tradeoffs

Rules:
- Keep it concise — an ADR is a record, not an essay
- Always include at least one tradeoff in Consequences — no decision is free
- If the decision supersedes a previous ADR, note that and update the old ADR's status to `Superseded by ADR-{NNN}`
- Do NOT create an ADR for trivial choices — only for decisions that affect future work or would confuse someone reading the code later
