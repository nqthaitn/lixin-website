import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, date, time, notes } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: "Tên và số điện thoại là bắt buộc" }, { status: 400 });
    }

    const supabase = await createClient();

    // Build message from date/time/notes
    const messageParts: string[] = [];
    if (date) messageParts.push(`Ngày hẹn: ${date}`);
    if (time) messageParts.push(`Giờ: ${time}`);
    if (notes) messageParts.push(`Ghi chú: ${notes}`);
    const message = messageParts.join("\n") || null;

    // Map frontend service names to valid DB service_type values
    const SERVICE_MAP: Record<string, string> = {
      accounting: "accounting",
      management: "general",
      tax: "general",
      finance: "general",
      investment: "general",
      hr: "other",
      tech: "other",
      customs: "other",
      setup: "other",
    };
    const serviceType = SERVICE_MAP[service || ""] || "general";

    const { data, error } = await supabase
      .from("contacts")
      .insert({
        name,
        phone,
        email: email || null,
        service_type: serviceType,
        message,
        source: "website",
        status: "new",
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Send email notification (non-blocking)
    sendEmailNotification({ name, phone, email, service, date, time, notes }).catch((err) =>
      console.error("[Contact] Email error:", err)
    );

    return NextResponse.json({ data, success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function sendEmailNotification(info: {
  name: string;
  phone: string;
  email?: string;
  service?: string;
  date?: string;
  time?: string;
  notes?: string;
}) {
  const SERVICE_LABELS: Record<string, string> = {
    accounting: "Kế toán",
    management: "Quản lý",
    tax: "Tư vấn thuế",
    finance: "Tài chính",
    investment: "Đầu tư",
    hr: "Nhân sự",
    tech: "Công nghệ",
    customs: "Hải quan",
    setup: "Thành lập DN",
  };

  const serviceLabel = info.service ? SERVICE_LABELS[info.service] || info.service : "Chưa chọn";

  const subject = `[Lixin VN] Yêu cầu tư vấn mới từ ${info.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1a1a1a; color: #eab308; padding: 20px; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">LIXIN VN</h1>
        <p style="margin: 5px 0 0; color: #9ca3af; font-size: 14px;">Yêu cầu tư vấn mới</p>
      </div>
      <div style="padding: 24px; background: #fff; border: 1px solid #e5e7eb;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 140px;">Họ tên:</td>
            <td style="padding: 8px 0; color: #1f2937;">${info.name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Số điện thoại:</td>
            <td style="padding: 8px 0; color: #1f2937;">${info.phone}</td>
          </tr>
          ${info.email ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td><td style="padding: 8px 0; color: #1f2937;">${info.email}</td></tr>` : ""}
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Dịch vụ:</td>
            <td style="padding: 8px 0; color: #1f2937;">${serviceLabel}</td>
          </tr>
          ${info.date ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Ngày hẹn:</td><td style="padding: 8px 0; color: #1f2937;">${info.date}</td></tr>` : ""}
          ${info.time ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Giờ:</td><td style="padding: 8px 0; color: #1f2937;">${info.time}</td></tr>` : ""}
          ${info.notes ? `<tr><td style="padding: 8px 0; font-weight: bold; color: #374151;">Ghi chú:</td><td style="padding: 8px 0; color: #1f2937;">${info.notes}</td></tr>` : ""}
        </table>
      </div>
      <div style="background: #f9fafb; padding: 16px; text-align: center; color: #6b7280; font-size: 12px; border: 1px solid #e5e7eb; border-top: 0;">
        <p>Email này được gửi tự động từ website lixinvn.com</p>
      </div>
    </div>
  `;

  // Use Supabase Edge Function or Resend API
  // For now, use Resend if RESEND_API_KEY is set
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.log("[Contact] No RESEND_API_KEY, skipping email. Data saved to DB.");
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Lixin VN <onboarding@resend.dev>",
      to: ["lixinvn.co.ltd@gmail.com"],
      subject,
      html,
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error("[Contact] Resend API error:", result);
  } else {
    console.log("[Contact] Email sent:", result.id);
  }
}
