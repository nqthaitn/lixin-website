# ai-dev-template — Working Rules

> Template-owned rules. File này được `apply-template` ghi đè khi update — **đừng sửa tay**.
> Tùy biến theo dự án thì viết ở `CLAUDE.md` (mục Project-Specific Notes), không sửa file này.

## Agent Behavior (mọi task)
Áp cho mọi task — trị over-engineering và sửa lan man (đúc từ Karpathy's CLAUDE.md).
- **Nghĩ trước khi code**: nêu giả định + tradeoff, hỏi khi mơ hồ — đừng tự chọn im lặng.
- **Đơn giản trước**: code tối thiểu giải quyết đúng vấn đề. Không feature/abstraction đầu cơ, không handle lỗi bất khả thi.
- **Sửa phẫu thuật**: chỉ đụng cái buộc phải đụng; theo style hiện có; không refactor code đang chạy tốt.
- **Dọn đúng rác của mình**: xoá import/biến mình làm thừa; để yên dead code có sẵn trừ khi được yêu cầu.
- **Bám mục tiêu**: chốt success criteria, loop tới khi verify xong (gate ở `/ship-check`).

## Project Doc Locations
- Briefs & PRDs (requirements/specs) live in `docs/specs/`
- Plans live in `docs/plans/`
- Tasks live in `docs/tasks/`
- Handoffs live in `docs/handoff/`
- Architecture/decision records live in `docs/decisions/`
- Backlog lives in `TODO.md`
- Templates live in `templates/`

## File Naming Rules
- Briefs: `docs/specs/BRIEF.md` (one per project; `BRIEF-short-kebab-name.md` if multiple sub-projects)
- PRDs: `docs/specs/PRD-###-short-kebab-name.md`
- Glossary: `docs/specs/GLOSSARY.md` (one per project; shared domain vocabulary)
- Roadmap: `docs/plans/ROADMAP.md`
- Plans: `docs/plans/YYYY-MM-DD-short-kebab-name.md`
- Tasks: `docs/tasks/TASK-###-short-kebab-name.md`
- Handoffs: `docs/handoff/YYYY-MM-DD-short-kebab-name.md`
- Decisions: `docs/decisions/ADR-###-short-kebab-name.md`

Never create vague names like `plan.md`, `notes.md`, `final.md`, or `temp.md`.

## File Creation / Update Rules
- Before creating a new task/plan/handoff/decision file, check whether a relevant file already exists.
- Prefer updating an existing relevant file instead of creating duplicates.
- If no relevant file exists, create a new file using the naming rules above.
- For non-trivial work, create or update both a plan file and a task file before implementation starts.
- For unfinished work across sessions, create or update a handoff file.

## Before Starting Any Non-Trivial Task
1. Read `CLAUDE.md` first.
2. Read relevant files in `docs/specs/`, `docs/plans/`, `docs/tasks/`, `docs/handoff/`, and `docs/decisions/`.
3. If requirements are vague or no BRIEF/PRD exists, run `/discover` (or skill `requirements`) before planning.
4. If no relevant plan exists, create one using `templates/PLAN.template.md`.
5. If no relevant task exists, create one using `templates/TASK.template.md`.
6. Do not start coding until scope and acceptance criteria are clear.

## Project Lifecycle (A→Z)
Build từ yêu cầu tới ship theo các stage sau. Dùng `/start` để định vị stage hiện tại và
route bước kế — KHÔNG chạy mù cả pipeline.

| # | Stage | Làm gì | Artifact | Command / Skill |
|---|-------|--------|----------|-----------------|
| 0 | Discovery | Lấy yêu cầu (grill phản biện); nếu khách đưa URL "làm giống vầy" → phân tích web mẫu | `docs/specs/BRIEF.md` + `GLOSSARY.md` | `/discover`, skills `requirements`/`reference-analysis` |
| 1 | Spec | Viết PRD: user stories + acceptance criteria + non-goals | `docs/specs/PRD-###-*.md` | `/discover`, skill `requirements` |
| 2 | Architecture | Chốt tech stack / quyết định lớn | `docs/decisions/ADR-###-*.md` | `/new-decision`, skill `architecture-review` |
| 3 | Planning | Milestone → plan → task (chia lane nếu cần) | `ROADMAP.md`, plans, tasks | `/plan`, `/new-task`, skill `task-breakdown` |
| 4 | Implementation | Code đúng scope (test trước → implement → verify → commit từng lát nhỏ) | code | skills `tdd`/`incremental-implementation`/`backend-implementation`/`frontend-implementation`, agent `implementer` |
| 5 | Review / QA | Review chất lượng, security, test, performance (khi có hot path) | — | `/review` (tự chain `security-check`/`test-strategy`/`architecture-review`/`performance`, +FE khi cần) |
| 6 | Ship | Checklist trước merge/deploy; deploy reversible + instrument để quan sát; version + changelog + docs | — | `/ship-check`, skills `deployment`/`observability`/`release-management`/`documentation` |
| ↺ | Continuity | Bàn giao qua session/agent | `docs/handoff/*` | `/handoff`, `/resume` |

## Project Modes (calibrate độ nặng)
Chọn mode trong BRIEF (`## Mode`). Mode quyết định lượng tài liệu — đừng gold-plate.
- **light** (solo / MVP): BRIEF lite → PRD tối giản (Summary, User Stories, Acceptance Criteria, Out of Scope) → code → `/review` → `/ship-check`. Bỏ ROADMAP/ADR trừ khi có ngã rẽ thật. Task < 3 files → code thẳng, không cần plan file.
- **standard** (product team): full BRIEF → PRD đầy đủ → ADR cho quyết định lớn → ROADMAP → plan/task → implement → review → ship.
- **enterprise**: như standard + requirements traceability, risk register, security + test là gate bắt buộc, sign-off trước khi ship.

## Coding Principles
Bản tóm tắt; chi tiết + bảng chống đi tắt nằm trong skill tương ứng (auto-trigger).
- **SOLID & Clean Architecture** — mỗi unit 1 lý do để đổi; depend vào abstraction, không vào implementation; business logic KHÔNG depend framework/DB; dependency chỉ đi từ ngoài vào trong (infra → use case → domain). → skill `architecture-review`.
- **Clean Code** — tên tự giải thích; function ngắn, 1 việc, 1 level abstraction; không magic number; không dead/commented-out code; không swallow error.
- **DRY thực dụng** — copy lần 2 thì extract; nhưng 3 chỗ mới refactor (đừng abstract sớm); shared code phải có contract rõ (input/output/error), không chia sẻ bằng side-effect.
- **Security** — validate mọi input (OWASP top 10); secret qua env, không hardcode; không log PII/token; parameterized query, không concat SQL; escape output đúng context. → skill `security-check`.
- **Testing** — code mới phải có test; logic phi tầm thường viết test trước (red → green → refactor); test behavior không test internals; tên mô tả scenario (`should_return_401_when_token_expired`); >5 mock = design lỗi. → skills `test-strategy`/`tdd`.

## Efficiency Rules
- Không gọi full pipeline (plan → implement → review → ship-check) cho task nhỏ. Chỉ activate đúng bước cần.
- Task nhỏ (< 3 files, single concern): code trực tiếp, không cần plan file.
- Task vừa: plan + implement + review.
- Task lớn / multi-agent: full pipeline với lanes rõ ràng.

## Multi-Agent Workflow
- Mỗi agent/model một lane rõ — không sửa cùng file.
- Agent lead (thường là Claude) giữ quyền plan, review, và chốt.
- Agent worker (Codex hoặc agent khác) chỉ nhận task hẹp, scope rõ.
- Khi chạy song song dễ đụng file: cho mỗi worker một git worktree riêng.
- Handoff giữa agents phải dùng file trong `docs/handoff/`, không dùng verbal/session context.
- Khi chia lane, ghi rõ ai own file nào — tránh merge conflict.

## Task Execution Rules
- Keep changes scoped and avoid unrelated files.
- For multi-agent or multi-model work, define non-overlapping lanes first.
- Record important decisions in `docs/decisions/` if they affect future work.

## Before Finishing
1. Update the relevant task status.
2. Update or create a handoff file if work is incomplete.
3. Update `TODO.md` if backlog/next steps changed.
4. Run relevant verification commands for the project.
