-- Migration: bảng hoá đơn NHÁP theo hộ/ngày (dashboard nội bộ /admin/hoadon)
-- Nguồn dữ liệu: cron openclaw (push-drafts-supabase.mjs) đẩy tổng hợp nháp mỗi hộ mỗi ngày.
-- 1 dòng = 1 hộ trong 1 ngày (UNIQUE hkd_id, ngay) → cron upsert đè.
-- Dữ liệu NỘI BỘ: KHÔNG mở đọc cho anon, chỉ authenticated (admin đã đăng nhập).
-- Chạy 1 lần trong Supabase Dashboard > SQL Editor.

CREATE TABLE IF NOT EXISTS public.hoadon_nhap (
  id         BIGSERIAL PRIMARY KEY,
  hkd_id     TEXT NOT NULL,                       -- mã hộ (quynh, phuong, tansung, oanh, thanhnhan)
  hkd_ten    TEXT NOT NULL,                       -- tên hiển thị
  cong       TEXT NOT NULL,                       -- nhà cung cấp HĐĐT: vnpt | viettel | meinvoice
  ngay       DATE NOT NULL,                       -- ngày của lô nháp
  so_nhap    INT  NOT NULL DEFAULT 0,             -- số hoá đơn nháp đã tạo trong ngày
  doanh_thu  BIGINT NOT NULL DEFAULT 0,           -- tổng tiền nháp (đồng)
  target_hd  INT,                                 -- mục tiêu số HĐ/ngày (theo cấu hình hộ)
  target_dt  BIGINT,                              -- mục tiêu doanh thu/ngày (đồng)
  invoices   JSONB NOT NULL DEFAULT '[]'::jsonb,  -- [{total, lines:[{ten,code,qty}]}]
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (hkd_id, ngay)
);

CREATE INDEX IF NOT EXISTS idx_hoadon_nhap_ngay ON public.hoadon_nhap (ngay DESC);

ALTER TABLE public.hoadon_nhap ENABLE ROW LEVEL SECURITY;

-- Chỉ admin đã đăng nhập được đọc (dữ liệu nội bộ, không public/anon).
DROP POLICY IF EXISTS "Auth read hoadon_nhap" ON public.hoadon_nhap;
CREATE POLICY "Auth read hoadon_nhap" ON public.hoadon_nhap
  FOR SELECT TO authenticated USING (true);

-- Cron ghi bằng service_role key (bypass RLS sẵn; policy này để tường minh).
DROP POLICY IF EXISTS "Service write hoadon_nhap" ON public.hoadon_nhap;
CREATE POLICY "Service write hoadon_nhap" ON public.hoadon_nhap
  FOR ALL TO service_role USING (true) WITH CHECK (true);
