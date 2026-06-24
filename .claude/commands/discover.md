Elicit requirements from a (often non-technical) client, then produce a BRIEF and PRD.

Most clients can't state goals/metrics/non-goals. The common real intake is:
they send a website link and say "make it like that". So default to reference-driven
discovery, and confirm by showing concrete options — not by asking abstract questions.

## Step 0 — Detect mode
Infer or ask the project mode (drives how heavy the output is):
- `light` (solo / MVP): BRIEF lite + 1-page PRD (Summary, User Stories, Acceptance Criteria, Out of Scope).
- `standard` (product team): full BRIEF + PRD (adds Edge Cases, NFR, Dependencies, Rollout).
- `enterprise`: standard + Traceability, Risk Register, Compliance, Approvals.
Default `standard`. Don't ask the client jargon — pick a default and move on.

## Step 1 — Intake (pick the path that matches what the client gave you)

### Path A — Reference-driven (DEFAULT: "làm giống trang này")
1. Take the reference URL(s) and run the `reference-analysis` skill to extract structure —
   it defines the method (map page types → screenshot/vision for UI → optional HAR for APIs →
   infer data model), the tool tiers, and the limits/legal guardrail. Go only as deep as the task needs.
2. From that, build a **feature inventory** in plain, non-technical language:
   - Page/screen types (home, product list, product detail, cart, checkout, login, blog, contact, dashboard…)
   - Key features (search, filters, booking, payment, accounts, comments, multi-language…)
   - Core user flows (e.g. browse → add to cart → pay)
   - Content model (what kinds of items: products, articles, listings…)
   - Obvious integrations (payment, maps, chat, email signup)
3. Play it back as yes/no/modify decisions the client CAN answer — show, don't quiz:
   - "Trang mẫu có [giỏ hàng + thanh toán online]. Bạn cần phần này giống vậy không?"
   - "Có [đăng nhập tài khoản] — cần không, hay bỏ?"
   - "Có [blog/tin tức] — giữ hay bỏ?"
4. Capture the **delta** (what's different from the reference — this is the real spec):
   - Branding: tên, logo, màu sắc, phông.
   - Real content: sản phẩm/dịch vụ/bài viết thật của họ (khác nội dung mẫu).
   - Features added/removed vs the reference.
   - Ngôn ngữ, khu vực, đối tượng người dùng.
5. Surface decisions only the client can make (in plain words, with a recommended default):
   - Tên miền, hosting, cổng thanh toán, ai cung cấp nội dung/ảnh thật, deadline, ngân sách.

### Path B — Interview (when there's no reference)
Ask focused questions, one cluster at a time (skip what's already obvious):
1. Problem — what problem, for whom, why now.
2. Users / stakeholders — primary persona(s).
3. Goals & how they'd know it worked (success in plain terms, not "metrics").
4. Scope & non-goals — what's in vs out (push hard on non-goals).
5. Constraints — deadline, budget, mandated tech, existing systems.
6. Core user flows — the 1-3 key "as a … I want …" stories.
7. Edge cases & risks `[standard+]`, NFRs `[standard+]`.

### Both paths — grill, don't just collect
- Push back on vague or contradictory answers; confirm before writing docs.
- "Giống vậy" hides a lot — never assume it means every page/feature; confirm each major one.
- Translate jargon out: ask in outcomes ("khách đặt hàng và trả tiền online") not tech ("REST API + payment gateway").
- Capture every domain term the client uses → glossary (Step 2).
- Never invent requirements silently — mark assumptions explicitly.

## Step 2 — Write artifacts
1. Check `docs/specs/` for an existing BRIEF/PRD on the same topic — update, don't duplicate.
2. Create/update `docs/specs/BRIEF.md` from `templates/BRIEF.template.md` (set `## Mode`).
   For reference-driven work, fill the Reference Sites + same/different mapping.
3. Create `docs/specs/PRD-{NNN}-{short-kebab-name}.md` from `templates/PRD.template.md`
   (auto-increment NNN). Derive functional requirements + acceptance criteria from the
   confirmed feature inventory and deltas. Fill only the sections the mode requires.
4. Emit a glossary as a byproduct: create/update `docs/specs/GLOSSARY.md` with the client's
   domain terms (business definition, not implementation). One term, one definition.
5. Make acceptance criteria concrete and verifiable. If any are still vague, flag and ask.

## Step 3 — Confirm & hand off
- Show the client a short plain-language summary of what will be built (same as reference / different),
  and get an explicit "đúng rồi" before moving on.
- Suggested next step: `/start` to plan the build, `/new-decision` for a pending tech choice,
  or `/plan` + `/new-task` to start execution.

## Legal / IP guardrail
Cloning a reference means copying STRUCTURE and UX patterns — NOT copyrighted assets.
Do not lift the reference's text, images, logo, brand, or proprietary content. Flag this to
the client and use their real content + original assets.

Anti-rationalization — when you think the left, the reality is the right:

| Excuse | Reality |
|--------|---------|
| "Client said 'make it like that' — that's the spec" | "Giống vậy" hides what stays, goes, and changes. Play back each major page/feature as yes/no/modify and capture the delta. |
| "I'll assume the parts they didn't mention" | Silent assumptions become wrong requirements. Mark every assumption; confirm the ones that matter. |
| "Asking in plain words is slower than just deciding" | Deciding for the client builds the wrong product confidently. Show concrete options they CAN answer. |
| "The acceptance criteria are good enough" | "Works well / fast / user-friendly" isn't testable. Rewrite each into a verifiable condition before handing off. |

Rules:
- Do NOT start coding from this command — discovery and implementation are separate.
- Keep BRIEF to one page; scope the PRD to the mode (don't fill enterprise sections for a light project).
