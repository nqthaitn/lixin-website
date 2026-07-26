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
    <div className={`${sans.className} min-h-full bg-slate-50 p-4 sm:p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-1">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              🧾 Hoá đơn nháp — các hộ
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              Ngày {dmy || "—"} · cập nhật {updatedAt || "…"} · tự làm mới mỗi 2 phút
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <select
              value={date}
              onChange={(e) => load(e.target.value)}
              className={`${mono.className} border border-slate-300 rounded-lg px-3 py-2 bg-white text-slate-700 shadow-sm focus:border-[#0b5fa4] focus:outline-none focus:ring-2 focus:ring-[#0b5fa4]/20`}
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
              className="px-4 py-2 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-700 transition shadow-sm"
            >
              ↻ Làm mới
            </button>
          </div>
        </div>

        {/* Cảnh báo nháp chưa phát hành */}
        <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 text-amber-800 text-sm px-4 py-3 flex gap-2">
          <span aria-hidden>🖊️</span>
          <span>
            Đây là hoá đơn <b>NHÁP — chưa phát hành</b> (chưa gửi cơ quan thuế). Duyệt xong bấm phát
            hành / ký số trên đúng nhà cung cấp của từng hộ.
          </span>
        </div>

        {missingTable && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 text-red-700 text-sm px-4 py-3">
            Bảng <code className={`${mono.className} font-semibold`}>hoadon_nhap</code> chưa tồn
            tại. Chạy migration <code className={mono.className}>006_create_hoadon_nhap.sql</code>{" "}
            trong Supabase SQL Editor.
          </div>
        )}

        {/* KPI */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <KpiCard label="hộ kinh doanh" value={String(rows.length)} />
          <KpiCard label="nháp trong ngày" value={String(totalNhap)} />
          <KpiCard
            label="tổng doanh thu nháp"
            value={`${f(totalRev)}đ`}
            accent="#0b5fa4"
            mono={mono.className}
          />
        </div>

        {/* Lưới thẻ hộ */}
        {loading ? (
          <div className="text-slate-400 py-16 text-center">Đang tải…</div>
        ) : rows.length === 0 ? (
          <div className="text-slate-400 py-16 text-center">Chưa có dữ liệu nháp cho ngày này.</div>
        ) : (
          <div className="grid gap-4 mt-6 sm:grid-cols-2 lg:grid-cols-3">
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
                  className="relative bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.05)] overflow-hidden flex flex-col"
                >
                  {/* Provider accent stripe */}
                  <div className="h-1" style={{ background: prov.color }} />
                  <div className="p-5 flex flex-col gap-3.5 flex-1">
                    {/* Header: tên + số nháp lớn */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="font-semibold text-slate-900 leading-snug truncate">
                          {r.hkd_ten}
                        </h2>
                        <span
                          className="inline-block mt-1.5 text-[11px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
                          style={{ color: prov.color, background: `${prov.color}1a` }}
                        >
                          {prov.name}
                        </span>
                      </div>
                      <div className={`${mono.className} text-right shrink-0`}>
                        <div className="text-3xl font-bold text-slate-900 leading-none tabular-nums">
                          {r.so_nhap}
                          {r.target_hd != null && (
                            <span className="text-lg text-slate-300 font-semibold">
                              /{r.target_hd}
                            </span>
                          )}
                        </div>
                        <div className={`${sans.className} text-[11px] text-slate-400 mt-1`}>
                          hoá đơn nháp
                        </div>
                      </div>
                    </div>

                    {/* Doanh thu + thanh tiến độ */}
                    <div>
                      <div className="flex items-baseline justify-between gap-2">
                        <span
                          className={`${mono.className} text-base font-bold tabular-nums`}
                          style={{ color: prov.color }}
                        >
                          {f(r.doanh_thu)}đ
                        </span>
                        {r.target_dt != null && (
                          <span className={`${mono.className} text-xs text-slate-400 tabular-nums`}>
                            / {f(r.target_dt)}đ
                          </span>
                        )}
                      </div>
                      <div
                        className="h-2 mt-1.5 rounded-full overflow-hidden"
                        style={{ background: `${prov.color}1a` }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pct}%`, background: prov.color }}
                        />
                      </div>
                    </div>

                    {/* Danh sách HĐ */}
                    {r.invoices?.length ? (
                      <ul className="flex flex-col gap-2 mt-0.5">
                        {r.invoices.map((iv, i) => (
                          <li key={i} className="border-t border-slate-100 pt-2 text-sm">
                            <div className="flex justify-between items-baseline gap-2">
                              <b className="text-slate-500 text-xs">HĐ #{i + 1}</b>
                              <span
                                className={`${mono.className} font-bold text-slate-900 tabular-nums`}
                              >
                                {f(iv.total || 0)}đ
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                              {(iv.lines || []).slice(0, 5).map((l, j) => (
                                <span key={j}>
                                  {(l.ten || l.code || "").slice(0, 28)}{" "}
                                  <span
                                    className={`${mono.className} text-slate-700 font-semibold`}
                                  >
                                    ×{fq(l.qty || 0)}
                                  </span>
                                  {j < Math.min(4, (iv.lines || []).length - 1) ? ", " : ""}
                                </span>
                              ))}
                              {(iv.lines || []).length > 5 ? " …" : ""}
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-slate-400 italic">Chưa có nháp trong ngày</div>
                    )}

                    {/* Link duyệt */}
                    <a
                      href={prov.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto pt-1 text-sm font-semibold hover:underline inline-flex items-center gap-1"
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

function KpiCard({
  label,
  value,
  accent,
  mono,
}: {
  label: string;
  value: string;
  accent?: string;
  mono?: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-[0_4px_20px_rgba(15,23,42,0.05)] px-5 py-4">
      <div
        className={`${mono || ""} text-3xl font-bold tabular-nums leading-none`}
        style={{ color: accent || "#0f172a" }}
      >
        {value}
      </div>
      <div className="text-[13px] text-slate-500 mt-1.5">{label}</div>
    </div>
  );
}
