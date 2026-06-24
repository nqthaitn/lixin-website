# Project Working Rules

@.claude/ai-dev-template-rules.md

## Project-Specific Notes
- **Stack**: Next.js 16 (App Router) + React 19 + TypeScript 5 · Tailwind CSS v4 · Supabase (`@supabase/ssr`, auth + Postgres) · next-intl (i18n) · TipTap (rich-text editor)
- **Install**: `npm install`
- **Run / Start**: `npm run dev` (dev server) · `npm start` (serve prod build)
- **Build**: `npm run build`
- **Test**: ⚠️ No test runner configured yet. Add one (e.g. Vitest) before relying on `tdd`/`test-strategy` skills. Until then, "Test" steps in `/ship-check` are N/A — mark them explicitly, don't claim passing.
- **Lint / Typecheck**: `npm run lint` (eslint src/) · `npx tsc --noEmit` (typecheck)
- **Format**: `npm run format` (write) · `npm run format:check` (verify)
- **Verify sequence** (run before shipping): `npm run format:check` → `npm run lint` → `npx tsc --noEmit` → `npm run build`

### Where things live
- `src/` — app code (Next.js App Router: routes, components, server actions)
- `messages/` — i18n translation JSON (next-intl). User-facing strings live here, NOT hardcoded.
- `supabase/` — Supabase config / migrations (DB schema source of truth)
- `scripts/` — project scripts
- `docs/` — requirements (`REQUIREMENTS_v*.md`), `ARCHITECTURE.md`, admin guide. Workflow docs go in `docs/specs|plans|tasks|handoff|decisions/`.

### Gotchas / footguns
- `.env.local` holds Supabase keys — never commit, never log. `security-check` applies to any auth/DB change.
- **Conventional commits enforced** by commitlint + husky (`lint-staged` runs eslint/prettier on commit). Commit messages must follow the convention or the hook rejects them.
- **No test suite yet** — `tdd`/`test-strategy` will push for tests; decide whether to add Vitest before treating coverage as a gate.
- Tailwind **v4** (new config model — not v3). Don't apply v3 patterns.
- next-intl: every user-facing string goes through `messages/`, not inline literals.
- Supabase is the data layer — `backend-implementation` (schema/migration discipline) applies to anything touching `supabase/`.
