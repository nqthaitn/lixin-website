import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

// GET /api/hoadon-nhap?date=YYYY-MM-DD  — danh sách hoá đơn nháp theo hộ trong 1 ngày.
// Dữ liệu NỘI BỘ: bắt buộc admin đã đăng nhập (cookie session), không dựa vào RLS đơn thuần.
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    if (!(await requireUser(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date"); // YYYY-MM-DD; nếu trống → ngày mới nhất có dữ liệu

    let ngay = date;
    if (!ngay) {
      const { data: latest } = await supabase
        .from("hoadon_nhap")
        .select("ngay")
        .order("ngay", { ascending: false })
        .limit(1);
      ngay = latest?.[0]?.ngay ?? null;
    }

    if (!ngay) {
      return NextResponse.json({ date: null, rows: [], dates: [] });
    }

    const { data, error } = await supabase
      .from("hoadon_nhap")
      .select("*")
      .eq("ngay", ngay)
      .order("hkd_ten", { ascending: true });

    if (error) {
      // Bảng chưa tạo → trả rỗng, dashboard hiện hướng dẫn migration
      if (error.code === "42P01") {
        return NextResponse.json({ date: ngay, rows: [], dates: [], missingTable: true });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Các ngày có dữ liệu (cho dropdown chọn ngày) — gần đây 30 dòng đủ dùng
    const { data: dateRows } = await supabase
      .from("hoadon_nhap")
      .select("ngay")
      .order("ngay", { ascending: false })
      .limit(200);
    const dates = [...new Set((dateRows || []).map((r) => r.ngay as string))].slice(0, 30);

    return NextResponse.json({ date: ngay, rows: data ?? [], dates });
  } catch (err) {
    console.error("[hoadon-nhap] GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
