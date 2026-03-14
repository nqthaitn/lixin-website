# ARCHITECTURE DOCUMENT — WEBSITE LIXIN VN
> Ngày tạo: 14/03/2026
> Phiên bản: v1.0 (đồng bộ với REQUIREMENTS v1.8)

---

## 1. TỔNG QUAN KIẾN TRÚC

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND                             │
│              Next.js 14 (App Router) + TypeScript            │
│        Tailwind CSS + Lucide React + next-intl (i18n)       │
├──────────────┬──────────────┬─────────────┬─────────────────┤
│  Public Site │  Admin Panel │   API       │  AI Agent       │
│  /[locale]/* │  /admin/*    │  /api/*     │  (Cron/External)│
└──────┬───────┴──────┬───────┴──────┬──────┴────────┬────────┘
       │              │              │               │
       └──────────────┴──────────────┴───────────────┘
                              │
                     ┌────────▼────────┐
                     │   Supabase      │
                     │  (PostgreSQL)   │
                     │  + Auth + RLS   │
                     └─────────────────┘
```

---

## 2. CẤU TRÚC THƯ MỤC

```
src/
├── app/
│   ├── [locale]/              # Public pages (i18n routing)
│   │   ├── layout.tsx         # Root layout: Header, Footer, i18n provider
│   │   ├── page.tsx           # Trang chủ (Homepage)
│   │   ├── about/             # Giới thiệu công ty
│   │   ├── services/          # 9 dịch vụ
│   │   ├── news/              # ⭐ Trang tin tức (target v1.8)
│   │   │   ├── page.tsx       # Danh sách tin — SSR, truyền data → NewsFilter
│   │   │   ├── layout.tsx     # SEO metadata cho trang news
│   │   │   └── [slug]/        # Chi tiết bài viết
│   │   │       └── page.tsx   # Article detail — SSR, JSON-LD, breadcrumb
│   │   └── contact/           # Form liên hệ + Đặt lịch
│   ├── admin/                 # Admin Panel (không i18n)
│   │   ├── layout.tsx         # Admin layout + auth guard
│   │   ├── page.tsx           # Dashboard
│   │   ├── news/              # Quản lý tin tức
│   │   ├── contacts/          # Quản lý liên hệ
│   │   ├── settings/          # Cài đặt hệ thống
│   │   └── login/             # Đăng nhập admin
│   └── api/                   # API Routes
│       ├── news/
│       │   ├── route.ts       # GET (list + pagination) / POST (create)
│       │   └── [id]/route.ts  # GET / PUT / DELETE single article
│       ├── contacts/          # Contact form API
│       ├── admin/             # Admin-specific APIs
│       └── auth/              # Auth callback
├── components/
│   ├── Header.tsx             # Navigation bar
│   ├── Footer.tsx             # Footer
│   ├── NewsFilter.tsx         # ⭐ Client component: category filter + news grid
│   ├── ZaloChat.tsx           # Floating Zalo chat button
│   └── admin/                 # Admin-specific components
├── i18n/                      # Internationalization config
├── lib/
│   └── supabase/              # Supabase client (server + browser)
└── types/
    └── news.ts                # News interface định nghĩa
```

---

## 3. DATA FLOW — TRANG TIN TỨC (HIỆN TẠI)

```
┌─────────────────────────────────────────────────────────────┐
│ HIỆN TẠI — FLOW ĐƠN GIẢN                                   │
│                                                             │
│  news/page.tsx (Server Component)                           │
│       │                                                     │
│       ├── supabase.from("news").limit(30) ← ❌ Chỉ 30 bài  │
│       │                                                     │
│       └── <NewsFilter news={data} />  (Client Component)    │
│               │                                             │
│               ├── useState(category)  ← Chỉ filter category│
│               ├── Render ALL news cards một lần              │
│               └── Không pagination, không search             │
└─────────────────────────────────────────────────────────────┘
```

### Vấn đề phát hiện:
| # | Vấn đề | Impact |
|---|--------|--------|
| 1 | `.limit(30)` — tin thứ 31+ không bao giờ hiển thị | 🔴 Nghiêm trọng |
| 2 | Không pagination/infinity scroll | 🔴 Nghiêm trọng |
| 3 | Không ô tìm kiếm | 🟡 Thiếu tính năng |
| 4 | Giao diện basic — thiếu sidebar, share, related articles | 🟡 UX kém |
| 5 | API route đã hỗ trợ `page` + `limit` nhưng frontend không dùng | 🟡 Lãng phí |

---

## 4. KIẾN TRÚC ĐỀ XUẤT — TRANG TIN TỨC v1.8

```
┌─────────────────────────────────────────────────────────────────┐
│ ĐỀ XUẤT — ENHANCED NEWS PAGE                                   │
│                                                                 │
│  ┌─────────────────────────────────────────────────┐             │
│  │ Header (Global — mọi trang)                     │             │
│  │   └── GlobalSearch — icon 🔍 trên nav bar       │             │
│  │         ├── Ctrl+K shortcut → mở search modal   │             │
│  │         ├── Search overlay full-width            │             │
│  │         ├── Grouped results: Tin tức, Dịch vụ   │             │
│  │         └── fetch /api/search?q=xxx&locale=vi   │             │
│  └─────────────────────────────────────────────────┘             │
│                                                                 │
│  news/page.tsx (Server Component)                               │
│       │                                                         │
│       ├── SSR: Fetch batch đầu (12 bài) + totalCount            │
│       │        Parse URL searchParams: ?cat=tax&page=1          │
│       │                                                         │
│       └── <NewsPageClient                                       │
│               initialNews={data}                                │
│               totalCount={count}                                │
│               searchParams={...}                                │
│           />                                                    │
│               │                                                 │
│               ├── CategoryTabs — filter + animation             │
│               ├── DateFilter — month/year dropdown              │
│               ├── InfinityScroll — IntersectionObserver         │
│               │       └── fetch /api/news?page=N&cat=...       │
│               ├── NewsGrid — cards + skeleton loading           │
│               └── Sidebar — "Bài xem nhiều" (top 5 by views)   │
│                                                                 │
│  news/[slug]/page.tsx (Server Component)                        │
│       │                                                         │
│       ├── SSR: Article + Related Articles (same category)       │
│       ├── ReadingProgress bar                                   │
│       ├── ShareButtons (Facebook, Zalo, Copy)                   │
│       ├── TableOfContents (auto from headings)                  │
│       └── RelatedArticles (3 bài cùng category)                │
└─────────────────────────────────────────────────────────────────┘
```

### 4.1 API Enhancement

**GET `/api/search`** — 🆕 Global Search endpoint (dùng cho Header):

| Param | Type | Mô tả |
|-------|------|--------|
| `q` | string | Từ khóa tìm kiếm (required) |
| `locale` | string | Ngôn ngữ hiện tại: vi/en/zh (default: vi) |
| `limit` | number | Số kết quả tối đa (default: 10) |

**Response format:**
```json
{
  "news": [
    { "id": 1, "slug": "...", "title": "...", "excerpt": "...", "category": "tax", "cover_image": "...", "created_at": "..." }
  ],
  "services": [
    { "slug": "accounting", "title": "Dịch vụ kế toán", "description": "..." }
  ],
  "total": 15
}
```

---

**GET `/api/news`** — Upgrade params:

| Param | Type | Mô tả |
|-------|------|--------|
| `page` | number | Trang hiện tại (default: 1) |
| `limit` | number | Số bài/trang (default: 12) |
| `status` | string | Filter status: published, draft, all |
| `category` | string | Filter theo category |
| `q` | string | 🆕 Full-text search tin tức (khi navigate từ global search "Xem tất cả") |
| `from` | string | 🆕 Date filter: from date (ISO) |
| `to` | string | 🆕 Date filter: to date (ISO) |
| `sort` | string | 🆕 Sort: `created_at`, `view_count`, `like_count` |
| `locale` | string | 🆕 Locale cho search field (vi/en/zh) |

**Response format:**
```json
{
  "data": [...],
  "total": 150,
  "page": 1,
  "limit": 12,
  "hasMore": true
}
```

**GET `/api/news/popular`** — 🆕 Endpoint mới:
- Trả về top 5 bài viết theo `view_count`
- Dùng cho sidebar "Bài xem nhiều nhất"

### 4.2 Component Architecture

```
components/
├── Header.tsx               → ✏️ Upgrade: thêm icon search + trigger GlobalSearch
├── GlobalSearch.tsx          → 🆕 Search modal/overlay toàn trang (client component)
├── NewsFilter.tsx            → ❌ Deprecated (sẽ thay thế)
├── news/                     → 🆕 Folder mới
│   ├── NewsPageClient.tsx    → Main orchestrator (client component)
│   ├── NewsCategoryTabs.tsx  → Category filter tabs
│   ├── NewsDateFilter.tsx    → Month/Year dropdown
│   ├── NewsGrid.tsx          → Grid layout + cards
│   ├── NewsCard.tsx          → Individual article card
│   ├── NewsCardSkeleton.tsx  → Loading skeleton
│   ├── NewsSidebar.tsx       → Popular articles sidebar
│   ├── NewsInfinityLoader.tsx → IntersectionObserver wrapper
│   ├── ShareButtons.tsx      → Social share (FB, Zalo, Copy)
│   ├── RelatedArticles.tsx   → 3 bài liên quan
│   ├── ReadingProgress.tsx   → Progress bar khi đọc bài
│   └── TableOfContents.tsx   → Auto TOC from headings
```

### 4.3 State Management

```
GlobalSearch state (Header-level):
├── isOpen: boolean             → modal đang mở?
├── query: string               → từ khóa đang gõ
├── results: SearchResults      → { news: [], services: [] }
├── isSearching: boolean        → đang fetch?
├── recentSearches: string[]    → 5 tìm kiếm gần nhất (localStorage)
└── debounceTimer: Timeout      → 300ms debounce

NewsPageClient state:
├── news: News[]              → accumulate từ infinity scroll
├── page: number              → trang hiện tại
├── hasMore: boolean          → còn bài để load?
├── isLoading: boolean        → đang fetch?
├── selectedCategory: string  → category filter
├── dateRange: {from, to}     → date filter
└── sortBy: string            → sort criteria
```

**URL Sync Strategy:**
- `useSearchParams()` + `router.push()` khi filter thay đổi
- Server component đọc `searchParams` → SSR batch đầu tiên theo filter
- Client component nối tiếp từ batch đầu

---

## 5. DATABASE SCHEMA — BẢNG `news`

| Column | Type | Ghi chú |
|--------|------|---------|
| id | serial (PK) | Auto-increment |
| slug | text (unique) | URL-friendly title |
| title_vi/en/zh | text | Tiêu đề 3 ngôn ngữ |
| content_vi/en/zh | text (HTML) | Nội dung bài viết |
| excerpt_vi/en/zh | text | Tóm tắt |
| category | text | tax, accounting, legal, business, other |
| cover_image | text | URL ảnh bìa |
| source_url | text (nullable) | Link bài gốc |
| thumbnail | text | Ảnh thumbnail |
| status | text | draft / published |
| author | text | Email người tạo |
| author_role | text | Vai trò |
| is_highlight | boolean | Bài nổi bật |
| tags | text | Comma-separated tags |
| meta_desc_vi/en/zh | text | SEO meta description |
| view_count | integer | 🔑 Dùng cho sidebar "Xem nhiều" |
| like_count | integer | Lượt thích |
| published_at | timestamp | Ngày đăng |
| created_at | timestamp | Ngày tạo |
| updated_at | timestamp | Ngày cập nhật |

### Index đề xuất (v1.8):
```sql
-- Full-text search performance
CREATE INDEX idx_news_title_vi_gin ON news USING gin(to_tsvector('simple', title_vi));
CREATE INDEX idx_news_title_en_gin ON news USING gin(to_tsvector('english', title_en));

-- Filter & sort performance
CREATE INDEX idx_news_status_created ON news(status, created_at DESC);
CREATE INDEX idx_news_category ON news(category);
CREATE INDEX idx_news_view_count ON news(view_count DESC) WHERE status = 'published';
```

---

## 6. TECH STACK TỔNG QUAN

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| i18n | next-intl (vi/en/zh) |
| Icons | Lucide React |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Deployment | Vercel |
| Domain/DNS | Cloudflare |
| Email Send | Resend |
| Email Receive | Cloudflare Email Routing |
| Chat | Zalo Widget |

---

## 7. TRẠNG THÁI ĐỒNG BỘ

| Document | Version | Ngày cập nhật |
|----------|---------|---------------|
| REQUIREMENTS | v1.8 | 14/03/2026 |
| ARCHITECTURE | v1.0 | 14/03/2026 |
| Source Code | Phase 2 done | — |
