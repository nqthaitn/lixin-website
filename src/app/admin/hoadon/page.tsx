"use client";

import { useEffect, useState, useCallback } from "react";
import { Hanken_Grotesk, JetBrains_Mono } from "next/font/google";

// Font hệ thống thiết kế (Stitch): Hanken Grotesk cho chữ, JetBrains Mono cho SỐ (tabular, canh cột).
const sans = Hanken_Grotesk({ subsets: ["latin", "latin-ext", "vietnamese"], display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ["500", "600", "700"], display: "swap" });

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
    <div className={`${sans.className} h-full overflow-y-auto bg-slate-50 px-4 py-3 lg:px-6`}>
      <div className="max-w-[1680px] mx-auto">
        {/* Header + KPI trên 1 hàng để tiết kiệm chiều cao */}
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              🧾 Hoá đơn nháp — các hộ
            </h1>
            <p className="text-xs text-slate-500">
              Ngày {dmy || "—"} · cập nhật {updatedAt || "…"} · tự làm mới 2 phút
            </p>
          </div>

          {/* KPI gọn dạng inline */}
          <div className={`${mono.className} flex items-stretch gap-2`}>
            <Kpi value={String(rows.length)} label="hộ" />
            <Kpi value={String(totalNhap)} label="nháp" />
            <Kpi value={`${f(totalRev)}đ`} label="doanh thu nháp" accent="#0b5fa4" wide />
          </div>

          <div className="flex items-center gap-2 text-sm">
            <select
              value={date}
              onChange={(e) => load(e.target.value)}
              className={`${mono.className} border border-slate-300 rounded-lg px-2.5 py-1.5 bg-white text-slate-700 shadow-sm focus:border-[#0b5fa4] focus:outline-none focus:ring-2 focus:ring-[#0b5fa4]/20`}
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
              className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-700 transition shadow-sm"
            >
              ↻ Làm mới
            </button>
          </div>
        </div>

        {/* Cảnh báo nháp chưa phát hành — mảnh */}
        <div className="mt-2.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 text-xs px-3 py-1.5 flex gap-1.5">
          <span aria-hidden>🖊️</span>
          <span>
            Hoá đơn <b>NHÁP — chưa phát hành</b> (chưa gửi CQT). Duyệt xong bấm phát hành / ký số
            trên đúng nhà cung cấp của từng hộ.
          </span>
        </div>

        {missingTable && (
          <div className="mt-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs px-3 py-2">
            Bảng <code className={`${mono.className} font-semibold`}>hoadon_nhap</code> chưa tồn tại
            — chạy <code className={mono.className}>006_create_hoadon_nhap.sql</code> trong Supabase
            SQL Editor.
          </div>
        )}

        {/* Lưới thẻ hộ — 3 cột để vừa 1 màn hình */}
        {loading ? (
          <div className="text-slate-400 py-16 text-center">Đang tải…</div>
        ) : rows.length === 0 ? (
          <div className="text-slate-400 py-16 text-center">Chưa có dữ liệu nháp cho ngày này.</div>
        ) : (
          <div className="grid gap-3 mt-3 sm:grid-cols-2 xl:grid-cols-3">
            {rows.map((r) => {
              const prov = PROV[r.cong] || {
                name: r.cong?.toUpperCase() || "?",
                color: "#64748b",
                link: "#",
              };
              const pct = r.target_dt
                ? Math.min(100, Math.round((r.doanh_thu / r.target_dt) * 100))
                : 0;
              return (
                <section
                  key={r.hkd_id}
                  className="relative bg-white rounded-xl border border-slate-200 shadow-[0_2px_12px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col"
                >
                  <div className="h-1" style={{ background: prov.color }} />
                  <div className="p-3.5 flex flex-col gap-2 flex-1">
                    {/* Header: tên + badge + số nháp */}
                    <div className="flex items-start justify-between gap-2">
                      <h2 className="font-semibold text-slate-900 text-[15px] leading-snug truncate">
                        {r.hkd_ten}
                      </h2>
                      <span
                        className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                        style={{ color: prov.color, background: `${prov.color}1a` }}
                      >
                        {prov.name}
                      </span>
                    </div>

                    <div className="flex items-end justify-between gap-2">
                      <div className={`${mono.className} flex items-baseline gap-1.5`}>
                        <span className="text-2xl font-bold text-slate-900 leading-none tabular-nums">
                          {r.so_nhap}
                          {r.target_hd != null && (
                            <span className="text-base text-slate-300 font-semibold">
                              /{r.target_hd}
                            </span>
                          )}
                        </span>
                        <span className={`${sans.className} text-[11px] text-slate-400`}>nháp</span>
                      </div>
                      <div className={`${mono.className} text-right leading-tight`}>
                        <div
                          className="text-sm font-bold tabular-nums"
                          style={{ color: prov.color }}
                        >
                          {f(r.doanh_thu)}đ
                        </div>
                        {r.target_dt != null && (
                          <div className="text-[10px] text-slate-400 tabular-nums">
                            /{f(r.target_dt)}đ
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Thanh tiến độ */}
                    <div
                      className="h-1.5 rounded-full overflow-hidden"
                      style={{ background: `${prov.color}1a` }}
                    >
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${pct}%`, background: prov.color }}
                      />
                    </div>

                    {/* Danh sách HĐ — mỗi HĐ 1 dòng gọn (tên hàng rút gọn) */}
                    {r.invoices?.length ? (
                      <ul className="flex flex-col divide-y divide-slate-100">
                        {r.invoices.map((iv, i) => (
                          <li key={i} className="py-1">
                            <div className="flex justify-between items-baseline gap-2">
                              <span className="text-slate-400 text-[11px] shrink-0">#{i + 1}</span>
                              <span className="text-[11px] text-slate-500 truncate flex-1">
                                {(iv.lines || [])
                                  .slice(0, 6)
                                  .map(
                                    (l) =>
                                      `${(l.ten || l.code || "").slice(0, 20)} ×${fq(l.qty || 0)}`
                                  )
                                  .join(", ")}
                                {(iv.lines || []).length > 6 ? " …" : ""}
                              </span>
                              <span
                                className={`${mono.className} font-bold text-slate-900 text-xs tabular-nums shrink-0`}
                              >
                                {f(iv.total || 0)}đ
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-xs text-slate-400 italic py-1">Chưa có nháp</div>
                    )}

                    <a
                      href={prov.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-1 text-xs font-semibold hover:underline"
                      style={{ color: prov.color }}
                    >
                      Mở {prov.name} để duyệt / phát hành →
                    </a>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({
  value,
  label,
  accent,
  wide,
}: {
  value: string;
  label: string;
  accent?: string;
  wide?: boolean;
}) {
  return (
    <div
      className={`bg-white rounded-lg border border-slate-200 shadow-sm px-3 py-1.5 flex flex-col justify-center ${
        wide ? "min-w-[150px]" : "min-w-[64px]"
      }`}
    >
      <div
        className="text-lg font-bold tabular-nums leading-none"
        style={{ color: accent || "#0f172a" }}
      >
        {value}
      </div>
      <div className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">{label}</div>
    </div>
  );
}
