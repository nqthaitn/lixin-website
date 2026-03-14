# REQUIREMENTS DOCUMENT v1.8 — WEBSITE LIXIN VN
> Phiên bản: v1.8
> Ngày tạo: 26/02/2026
> Ngày cập nhật: 14/03/2026
> BA: Hoa (@hoa_ba_bot)
> Decision Maker: @nqthaitn ✅ PENDING REVIEW
> Khách hàng: Chị Hằng / 阿恒 (@janengotn)

### Changelog v1.8
- **Nâng cấp trang Tin tức (News Page)** — 3 cải tiến lớn:
  1. **Pagination / Infinity Scroll** — hỗ trợ xem tin theo trang hoặc cuộn tải thêm
  2. **Nâng cấp giao diện** — sidebar bài viết phổ biến, related articles, share buttons, skeleton loading
  3. **Xem tin cũ** — bỏ giới hạn cứng 30 bài, hỗ trợ duyệt toàn bộ tin tức theo thời gian
- **Global Search trên Header** — tìm kiếm toàn trang (tin tức, dịch vụ, giới thiệu) ngay từ thanh navigation

### Changelog v1.7
- Bổ sung **PWA cho Admin Panel**:
  - Admin cài "app" trên điện thoại, mở full screen không có thanh URL
  - Push Notification khi có bài mới cần duyệt, khách hàng mới gửi liên hệ
  - Hỗ trợ nhiều admin (8+) tự subscribe, không cần Telegram group
- Bổ sung **Auto Backup Supabase**:
  - Cron job backup DB mỗi đêm 2:00 AM
  - Lưu lên Google Drive (15GB free)
  - Giữ 30 ngày, tự xóa bản cũ
- Bổ sung **Cloudflare Email Routing**:
  - Nhận email `@lixinvn.com` → forward về Gmail
  - Gửi email thông báo qua Resend (free 100/ngày)
  - Chi phí: $0/tháng

### Changelog v1.6
- Bổ sung tính năng Admin quản lý liên hệ:
  - **Trả lời nhanh qua email** trực tiếp từ trang quản lý
  - **Hiển thị ghi chú khách hàng** ngay trong danh sách (không cần click vào từng record)

### Changelog v1.5
- Bổ sung yêu cầu **SEO** — tối ưu website xuất hiện trang đầu Google theo từ khóa địa phương (Tây Ninh)

### Changelog v1.4
- Bổ sung quy tắc số lượng bài thu thập mỗi ngày: tối thiểu 1 bài/nguồn, tối đa 6 bài/ngày
- Bổ sung chủ đề bài viết cụ thể: kế toán, thuế, hải quan, bảo hiểm, tài chính
- Bổ sung thời gian chạy AI Agent: trước 9:00 sáng mỗi ngày

### Changelog v1.3
- Cập nhật cách xử lý nội dung AI Agent: **summary** thay vì viết lại theo văn phong
- Phân biệt rõ cách xử lý link theo từng nhóm nguồn:
  - Nguồn chính phủ: summary + **kèm link** bài gốc
  - Nguồn Big 4: summary + **không kèm link** (tránh rủi ro pháp lý bản quyền)

### Changelog v1.2
- Bổ sung danh sách nguồn tin cụ thể cho AI Agent (chính phủ + Big 4)

### Changelog v1.1
- Bổ sung 3 dịch vụ nổi bật trên trang chủ: Tư vấn thuế, Dịch vụ kế toán, Tư vấn thành lập DN
- Tin tức trang chủ hiển thị dạng **Carousel**

---

## 1. THÔNG TIN CÔNG TY

| Thông tin | Chi tiết |
|-----------|----------|
| Tên công ty | Công ty TNHH Dịch vụ và Tư vấn Lixin (Việt Nam) — LIXIN VN |
| Thành lập | 2019 |
| Địa chỉ | Số 2, Tổ 4, Ấp 4, xã Truông Mít, Tỉnh Tây Ninh, Việt Nam |
| Email | lixinvn.co.ltd@gmail.com |
| SĐT / Zalo | 0395536768 |

---

## 2. MỤC TIÊU DỰ ÁN

Xây dựng website giới thiệu công ty tư vấn kế toán thuế với 3 mục tiêu chính:

1. **Branding** — Giới thiệu công ty & dịch vụ
2. **Lead Generation** — Thu hút khách hàng tiềm năng
3. **Booking** — Cho phép khách hàng đặt lịch tư vấn online

---

## 3. NGÔN NGỮ

- 🇻🇳 Tiếng Việt
- 🇨🇳 Tiếng Trung
- 🇬🇧 Tiếng Anh

---

## 4. THIẾT KẾ

| Yếu tố | Chi tiết |
|--------|----------|
| Phong cách | Chuyên nghiệp, tối giản — tham khảo KPMG Vietnam (https://kpmg.com/vn/vi/home.html) |
| Màu chủ đạo | Vàng + Đen + Trắng (trích xuất từ logo Lixin) |
| Layout | Tối giản, nhiều khoảng trắng, Call-to-action nổi bật bằng màu vàng |
| Logo | Đã có sẵn (màu vàng - trắng - đen) |

---

## 5. CÁC TRANG WEBSITE

| # | Trang | Nội dung chính |
|---|-------|----------------|
| 1 | **Trang chủ** | Banner, giới thiệu tổng quan, **3 dịch vụ nổi bật** (Tư vấn thuế, Dịch vụ kế toán, Tư vấn thành lập DN), **section Tin tức nổi bật dạng Carousel** (người dùng vuốt/click qua lại xem bài), CTA đặt lịch |
| 2 | **Giới thiệu** | Lịch sử công ty, sứ mệnh, đội ngũ chuyên gia Việt-Trung |
| 3 | **Dịch vụ** | 9 dịch vụ chính (xem chi tiết bên dưới) |
| 4 | **Tin tức** | Admin đăng bài thủ công + AI Agent tự động tổng hợp |
| 5 | **Liên hệ** | Form liên hệ + Đặt lịch tư vấn online |

### 9 Dịch vụ chính:
1. Dịch vụ kế toán
2. Tư vấn quản lý
3. Tư vấn thuế
4. Tư vấn tài chính
5. Tư vấn đầu tư
6. Tư vấn nguồn nhân lực
7. Tư vấn chuyển giao công nghệ
8. Dịch vụ khai báo hải quan
9. Dịch vụ thành lập doanh nghiệp

### 3 Dịch vụ nổi bật (highlight trên trang chủ):
1. 🧾 Tư vấn thuế
2. 📊 Dịch vụ kế toán
3. 🏢 Tư vấn thành lập doanh nghiệp

---

## 6. TÍNH NĂNG ĐẶC BIỆT — AI AGENT TIN TỨC

### Quy trình hoạt động:
1. ⏰ **Tự động mỗi ngày trước 9:00 sáng** — thu thập bài viết từ các nguồn uy tín
2. 📝 **Summary** — tóm tắt nội dung chính, ngắn gọn súc tích
3. 🌍 **Dịch sang 3 ngôn ngữ** — Việt, Trung, Anh
4. ✅ **Admin duyệt** — xem xét, chỉnh sửa trước khi đăng
5. 🚀 **Đăng lên website** sau khi được duyệt

### Quy tắc số lượng bài:
| Quy tắc | Chi tiết |
|---------|----------|
| Tối thiểu | 1 bài/nguồn/ngày |
| Tối đa | 6 bài/ngày (tổng tất cả nguồn) |
| Chủ đề | Kế toán, thuế, hải quan, bảo hiểm, tài chính |

### Nguồn tin & Cách xử lý link:

**Chính phủ & Pháp luật — Summary + kèm link bài gốc ✅**
| Nguồn | URL |
|-------|-----|
| Thư viện Pháp luật | https://thuvienphapluat.vn/ |
| Bộ Tài chính | https://www.mof.gov.vn/ |
| Tin tức Tài chính (Bộ TC) | https://www.mof.gov.vn/tin-tuc-tai-chinh |
| Dịch vụ công quốc gia | https://dichvucong.gov.vn/ |

**Big 4 Vietnam — Summary, KHÔNG kèm link (tránh rủi ro bản quyền) ⚠️**
| Công ty | URL tham khảo |
|---------|--------------|
| KPMG Vietnam | https://kpmg.com/vn/vi/home.html |
| Deloitte Vietnam | https://www.deloitte.com/vn |
| PwC Vietnam | https://www.pwc.com/vn |
| EY Vietnam | https://www.ey.com/vi_vn |

---

## 7. SEO — TỐI ƯU TÌM KIẾM

Mục tiêu: Website xuất hiện **trang đầu Google** khi người dùng tìm kiếm dịch vụ kế toán thuế, thành lập doanh nghiệp tại Tây Ninh.

### Từ khóa mục tiêu:
| Từ khóa | Mức độ ưu tiên |
|---------|----------------|
| dịch vụ kế toán Tây Ninh | ⭐⭐⭐ Cao |
| tư vấn thuế Tây Ninh | ⭐⭐⭐ Cao |
| thành lập doanh nghiệp Tây Ninh | ⭐⭐⭐ Cao |
| công ty kế toán Tây Ninh | ⭐⭐ Trung bình |
| dịch vụ kế toán thuế Tây Ninh | ⭐⭐ Trung bình |
| tư vấn thành lập công ty Tây Ninh | ⭐⭐ Trung bình |

### Giải pháp kỹ thuật:
- ✅ **On-page SEO** — tối ưu tiêu đề (title), mô tả (meta description), heading, nội dung theo từ khóa
- ✅ **Google Business Profile** — đăng ký địa chỉ công ty trên Google Maps (Local SEO)
- ✅ **Schema Markup** — giúp Google nhận diện thông tin công ty, dịch vụ, địa chỉ
- ✅ **Tốc độ tải trang** — tối ưu Core Web Vitals (Google ưu tiên web nhanh)
- ✅ **Sitemap & robots.txt** — hỗ trợ Google crawl website hiệu quả
- ✅ **Nội dung mới hàng ngày** — AI Agent cập nhật tin tức mỗi ngày giúp Google index thường xuyên hơn

---

## 8. TÍCH HỢP

| Tính năng | Chi tiết |
|-----------|----------|
| Chat Zalo | Nút chat nổi, liên kết số 0395536768 |
| AI Agent | Tự động thu thập & summary tin tức hàng ngày trước 9:00 sáng |
| Google Analytics | Theo dõi lượt truy cập, hành vi người dùng |
| Google Search Console | Theo dõi hiệu quả SEO, từ khóa, thứ hạng |

---

## 9. ADMIN PANEL

- Đăng nhập bảo mật
- Đăng bài tin tức thủ công
- Duyệt / chỉnh sửa bài do AI Agent tổng hợp
- Quản lý nội dung website

### Quản lý liên hệ:
- 📋 **Danh sách liên hệ** — hiển thị luôn ghi chú/nội dung của khách ngay trong danh sách (không cần click vào từng record)
- 📧 **Trả lời nhanh qua email** — Admin reply trực tiếp từ trang quản lý, không cần mở email riêng

### PWA — Admin App (v1.7):
Admin Panel hỗ trợ cài đặt dưới dạng **Progressive Web App** trên điện thoại:

| Tính năng | Chi tiết |
|-----------|----------|
| **Cài đặt** | Admin vào `lixinvn.com/admin` → "Thêm vào màn hình chính" → icon app riêng |
| **Giao diện** | Full screen, không thanh URL, splash screen logo Lixin |
| **Offline** | Cache trang admin cơ bản, hiển thị khi mất mạng |
| **Push Notification** | Thông báo real-time khi có sự kiện mới |

#### Push Notification cho Admin:
| Sự kiện | Nội dung thông báo | Ưu tiên |
|---------|---------------------|---------| 
| Bài mới cần duyệt | "📰 X bài mới cần duyệt" | ⭐⭐⭐ Cao |
| Khách gửi liên hệ | "📩 Liên hệ mới: [Tên] — [SĐT]" | ⭐⭐⭐ Cao |
| Bài draft quá 7 ngày | "⚠️ X bài draft chưa duyệt quá 7 ngày" | ⭐⭐ Trung bình |

#### Đặc điểm:
- Hỗ trợ **nhiều admin** (8+) — mỗi người tự cài app, tự subscribe notification
- Không cần Telegram, không cần add vào group
- Hoạt động trên Android (full) + iOS 16.4+ (cần cài PWA trước)
- Chi phí: **$0** (Web Push API + Google FCM miễn phí)

#### Tech stack PWA:
- `next-pwa` — tự generate service worker
- `web-push` — gửi push notification từ server
- VAPID keys — xác thực push, tạo 1 lần

---

## 10. EMAIL — CLOUDFLARE EMAIL ROUTING (v1.7)

| Tính năng | Chi tiết |
|-----------|----------|
| **Nhận email** | `admin@lixinvn.com`, `contact@lixinvn.com` → forward về Gmail |
| **Gửi email** | Qua Resend API — gửi từ `no-reply@lixinvn.com` |
| **Dùng cho** | Thông báo contact form, reply khách hàng từ admin panel |
| **Giới hạn** | 100 email/ngày (Resend free plan) |
| **Chi phí** | $0/tháng |

---

## 11. AUTO BACKUP (v1.7)

| Tính năng | Chi tiết |
|-----------|----------|
| **Tần suất** | Mỗi đêm 2:00 AM tự động |
| **Dữ liệu** | Toàn bộ tables Supabase (news, contacts, ...) |
| **Lưu trữ** | Google Drive (15GB free) |
| **Định dạng** | JSON → nén tar.gz |
| **Giữ lại** | 30 ngày, tự xóa bản cũ |
| **Chi phí** | $0/tháng |

---

## 12. NÂNG CẤP TRANG TIN TỨC (v1.8) 🆕

### 12.1 Phân trang & Infinity Scroll

| Tính năng | Chi tiết |
|-----------|----------|
| **Chế độ mặc định** | Infinity Scroll — cuộn đến cuối trang → tự động load thêm bài |
| **Fallback** | Nút "Xem thêm" (Load More) nếu IntersectionObserver không hỗ trợ |
| **Batch size** | 12 bài/lần load |
| **SEO** | Server render batch đầu tiên (12 bài) → Google bot thấy nội dung |
| **Loading state** | Skeleton cards animation khi đang tải |
| **End state** | Hiển thị message "Bạn đã xem hết tin tức" khi hết bài |

### 12.2 Nâng cấp giao diện

#### Trang danh sách tin tức:
| Thành phần | Chi tiết |
|------------|----------|
| **Sidebar** | Desktop: sidebar phải hiển thị "Bài viết xem nhiều nhất" (top 5 theo view_count) |
| **Tags Cloud** | Hiển thị tags phổ biến, click → filter theo tag |
| **Category Tabs** | Giữ nguyên + thêm animation active state |
| **News Cards** | Thêm reading time estimate, hover scale effect mượt hơn |
| **Skeleton Loading** | Animated placeholder khi đang fetch data |
| **Empty State** | Illustration + message thân thiện khi không có kết quả |

#### Trang chi tiết bài viết:
| Thành phần | Chi tiết |
|------------|----------|
| **Share Buttons** | Facebook, Zalo, Copy Link — floating hoặc inline |
| **Related Articles** | 3 bài liên quan cùng category ở cuối bài |
| **Reading Progress** | Progress bar ở top khi đọc bài |
| **Table of Contents** | Auto-generated từ headings trong content (desktop sidebar) |
| **Source Link** | Hiển thị nổi bật link bài gốc (nếu có source_url) |

### 12.3 Xem tin cũ — Archive

| Tính năng | Chi tiết |
|-----------|----------|
| **Bỏ giới hạn** | Không còn limit cứng 30 bài — tải thêm qua infinity scroll |
| **Date Filter** | Dropdown chọn tháng/năm → filter tin theo khoảng thời gian |
| **URL Params** | Hỗ trợ query params: `?page=2&category=tax&q=keyword` → shareable & SEO-friendly |

### 12.4 Global Search — Tìm kiếm toàn trang (trên Header)

Tính năng tìm kiếm **nằm trên Header** của toàn bộ website, không chỉ riêng trang tin tức.

#### Vị trí & Giao diện:
| Thành phần | Chi tiết |
|------------|----------|
| **Vị trí** | Nằm trên Header navigation bar — icon 🔍 kính lúp bên cạnh language switcher |
| **Trigger** | Click icon → mở search overlay/modal full-width, mượt mà |
| **Shortcut** | `Ctrl+K` / `⌘+K` → mở nhanh search (power user) |
| **Mobile** | Icon kính lúp trên mobile, tap → expand full-screen search |
| **Đóng** | Nhấn `Esc`, click ngoài, hoặc nút X để đóng |

#### Phạm vi tìm kiếm:
| Nguồn | Tìm theo | Ưu tiên |
|-------|----------|----------|
| **Tin tức** | title, excerpt, tags | ⭐⭐⭐ Cao |
| **Dịch vụ** | Tên dịch vụ, mô tả dịch vụ (static data) | ⭐⭐ Trung bình |
| **Giới thiệu** | Nội dung trang About (static data) | ⭐ Thấp |

#### Tính năng:
| Tính năng | Chi tiết |
|-----------|----------|
| **Full-text search** | Tin tức: Supabase `ilike` hoặc full-text search. Dịch vụ/About: client-side filter |
| **Debounce** | 300ms debounce khi gõ → tránh spam API |
| **Grouped results** | Kết quả nhóm theo loại: "📰 Tin tức", "💼 Dịch vụ", "ℹ️ Giới thiệu" |
| **Highlight** | Highlight từ khóa match trong kết quả |
| **Result limit** | Hiển thị tối đa 5 tin tức + 3 dịch vụ + 2 trang khác = 10 kết quả nhanh |
| **"Xem tất cả"** | Link "Xem tất cả X kết quả" → navigate tới `/news?q=keyword` |
| **No results** | Hiển thị gợi ý "Thử với từ khóa khác" khi không có kết quả |
| **Đa ngôn ngữ** | Search tự động theo ngôn ngữ hiện tại (title_vi, title_en, title_zh) |
| **Recent searches** | Lưu 5 tìm kiếm gần nhất (localStorage) |

---

## 13. TECH STACK (do Leader đề xuất)

- **Framework:** Next.js 14 + TypeScript
- **Styling:** Tailwind CSS
- **i18n:** next-intl (3 ngôn ngữ)
- **Icons:** Lucide React
- **PWA:** next-pwa (admin only)
- **Push:** web-push + VAPID keys
- **Email gửi:** Resend (free 100/ngày)
- **Email nhận:** Cloudflare Email Routing (free)
- **Backup:** Cron job + Google Drive (free)

---

## 14. TRẠNG THÁI

| Phase | Nội dung | Trạng thái |
|-------|----------|------------|
| Phase 1 | Foundation — UI/UX 5 trang, i18n 3 ngôn ngữ, Zalo chat | ✅ Hoàn thành |
| Phase 2 | Database, API, Admin Panel, AI News Agent, SEO, Email (Resend + Cloudflare Email Routing) | ✅ Hoàn thành |
| Phase 2.5 | **Nâng cấp trang Tin tức** — Pagination, Search, UI/UX upgrade | 📋 Chờ triển khai |
| Phase 3 | PWA Admin, Push Notification, Auto Backup (Google Drive) | 📋 Chờ triển khai |

---

## 15. GHI CHÚ

- Nếu cần bổ sung/thay đổi yêu cầu, khách hàng nhắn qua group Telegram **"Lixin"**
- Versioning: v1 → v1.1 → v1.2 → v1.3 → v1.4 → v1.5 → v1.6 → v1.7 → **v1.8 (14/03/2026)**
