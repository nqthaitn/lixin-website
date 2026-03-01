# REQUIREMENTS DOCUMENT v1.7 — WEBSITE LIXIN VN
> Phiên bản: v1.7
> Ngày tạo: 26/02/2026
> Ngày cập nhật: 01/03/2026
> BA: Hoa (@hoa_ba_bot)
> Decision Maker: @nqthaitn ✅ APPROVED
> Khách hàng: Chị Hằng / 阿恒 (@janengotn)

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

## 12. TECH STACK (do Leader đề xuất)

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

## 13. TRẠNG THÁI

| Phase | Nội dung | Trạng thái |
|-------|----------|------------|
| Phase 1 | Foundation — UI/UX 5 trang, i18n 3 ngôn ngữ, Zalo chat | ✅ Hoàn thành |
| Phase 2 | Database, API, Admin Panel, AI News Agent, SEO, Email (Resend + Cloudflare Email Routing) | ✅ Hoàn thành |
| Phase 3 | PWA Admin, Push Notification, Auto Backup (Google Drive) | 📋 Chờ triển khai |

---

## 14. GHI CHÚ

- Nếu cần bổ sung/thay đổi yêu cầu, khách hàng nhắn qua group Telegram **"Lixin"**
- Versioning: v1 → v1.1 → v1.2 → v1.3 → v1.4 → v1.5 → v1.6 → v1.7 (01/03/2026)
