"use client";

import { useEffect, useState, useCallback } from "react";

type Line = { ten?: string; code?: string; qty?: number };
type Invoice = { total?: number; lines?: Line[] };
type Row = {
  hkd_id: string;
  hkd_ten: string;
  cong: string;
  ngay: string;
  so_nhap: number;
  doanh_thu: number;
  target_hd: number | null;
  target_dt: number | null;
  invoices: Invoice[];
  updated_at: string;
};

const PROV: Record<string, { name: string; color: string; link: string }> = {
  vnpt: { name: "VNPT", color: "#0b5fa4", link: "https://hkd.vnpt.vn/Thue/QuanLyHoaDon" },
  viettel: {
    name: "Viettel",
    color: "#ee0033",
    link: "https://vinvoice.viettel.vn/invoice-management/invoice-draft",
  },
  meinvoice: {
    name: "MeInvoice",
    color: "#e2661e",
    link: "https://actasp.misa.vn/app/SA/SAProcess",
  },
};

const f = (n: number) => Math.round(n || 0).toLocaleString("vi-VN");
const fq = (n: number) =>
  (Math.round((n || 0) * 1000) / 1000).toLocaleString("vi-VN", { maximumFractionDigits: 3 });

export default function AdminHoaDonPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [dates, setDates] = useState<string[]>([]);
  const [date, setDate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [missingTable, setMissingTable] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string>("");

  const load = useCallback(async (d?: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/hoadon-nhap${d ? `?date=${d}` : ""}`);
      const data = await res.json();
      setRows(data.rows || []);
      setDates(data.dates || []);
      setDate(data.date || "");
      setMissingTable(Boolean(data.missingTable));
      setUpdatedAt(new Date().toLocaleTimeString("vi-VN"));
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const t = setInterval(() => load(date || undefined), 120_000); // tự làm mới 2 phút
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalNhap = rows.reduce((s, r) => s + (r.so_nhap || 0), 0);
  const totalRev = rows.reduce((s, r) => s + (r.doanh_thu || 0), 0);
  const dmy = date ? date.split("-").reverse().join("/") : "";

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-1">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">🧾 Hoá đơn nháp — các hộ</h1>
        <div className="flex items-center gap-2 text-sm">
          <select
            value={date}
            onChange={(e) => load(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 bg-white text-gray-700"
          >
            {dates.length === 0 && <option value="">{dmy || "—"}</option>}
            {dates.map((d) => (
              <option key={d} value={d}>
                {d.split("-").reverse().join("/")}
              </option>
            ))}
          </select>
          <button
            onClick={() => load(date || undefined)}
            className="px-3 py-1.5 rounded-lg bg-gray-900 text-white hover:bg-gray-700 transition"
          >
            ↻ Làm mới
          </button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Ngày {dmy || "—"} · cập nhật {updatedAt || "…"} · tự làm mới mỗi 2 phút
      </p>

      {/* Cảnh báo nháp chưa phát hành */}
      <div className="rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-2.5 mb-5">
        🖊️ Đây là hoá đơn <b>NHÁP — chưa phát hành</b> (chưa gửi CQT). Duyệt xong bấm phát hành/ký
        số trên đúng nhà cung cấp của từng hộ.
      </div>

      {missingTable && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3 mb-5">
          Bảng <code className="font-mono">hoadon_nhap</code> chưa tồn tại. Chạy migration{" "}
          <code className="font-mono">006_create_hoadon_nhap.sql</code> trong Supabase SQL Editor.
        </div>
      )}

      {/* Tổng quan */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
        {[
          { v: rows.length, l: "hộ kinh doanh" },
          { v: totalNhap, l: "nháp trong ngày" },
          { v: `${f(totalRev)}đ`, l: "tổng doanh thu nháp" },
        ].map((t, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 tabular-nums">{t.v}</div>
            <div className="text-xs sm:text-sm text-gray-500">{t.l}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-500 py-10 text-center">Đang tải…</div>
      ) : rows.length === 0 ? (
        <div className="text-gray-500 py-10 text-center">Chưa có dữ liệu nháp cho ngày này.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((r) => {
            const prov = PROV[r.cong] || {
              name: r.cong?.toUpperCase() || "?",
              color: "#5b6b7b",
              link: "#",
            };
            const pct = r.target_dt
              ? Math.min(100, Math.round((r.doanh_thu / r.target_dt) * 100))
              : 0;
            return (
              <section
                key={r.hkd_id}
                className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3"
                style={{ borderTop: `3px solid ${prov.color}` }}
              >
                <header className="flex items-center justify-between gap-2">
                  <h2 className="font-semibold text-gray-900">{r.hkd_ten}</h2>
                  <span
                    className="text-xs font-semibold text-white px-2.5 py-1 rounded-full whitespace-nowrap"
                    style={{ background: prov.color }}
                  >
                    {prov.name}
                  </span>
                </header>

                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-900 tabular-nums">
                    {r.so_nhap}
                    {r.target_hd != null && (
                      <span className="text-lg text-gray-400 font-semibold">/{r.target_hd}</span>
                    )}
                  </span>
                  <span className="text-sm text-gray-500">hoá đơn nháp</span>
                </div>

                <div>
                  <div className="flex justify-between text-sm tabular-nums">
                    <span className="text-gray-800">{f(r.doanh_thu)}đ</span>
                    {r.target_dt != null && (
                      <span className="text-gray-400">mục tiêu {f(r.target_dt)}đ</span>
                    )}
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, background: prov.color }}
                    />
                  </div>
                </div>

                {r.invoices?.length ? (
                  <ul className="flex flex-col gap-2">
                    {r.invoices.map((iv, i) => (
                      <li key={i} className="border-t border-gray-100 pt-2 text-sm">
                        <div className="flex justify-between">
                          <b className="text-gray-700">#{i + 1}</b>
                          <span className="font-bold text-gray-900 tabular-nums">
                            {f(iv.total || 0)}đ
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {(iv.lines || []).slice(0, 5).map((l, j) => (
                            <span key={j}>
                              {(l.ten || l.code || "").slice(0, 28)}{" "}
                              <span className="text-gray-700 font-semibold">×{fq(l.qty || 0)}</span>
                              {j < Math.min(4, (iv.lines || []).length - 1) ? ", " : ""}
                            </span>
                          ))}
                          {(iv.lines || []).length > 5 ? " …" : ""}
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-gray-400 italic">Chưa có nháp trong ngày</div>
                )}

                <a
                  href={prov.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto text-sm font-semibold hover:underline"
                  style={{ color: prov.color }}
                >
                  Mở {prov.name} để duyệt / phát hành →
                </a>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
