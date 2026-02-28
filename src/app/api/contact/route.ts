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

    // Send email notification to admin (non-blocking)
    sendEmailNotification({ name, phone, email, service, date, time, notes }).catch((err) =>
      console.error("[Contact] Admin email error:", err)
    );

    // Send confirmation email to customer (non-blocking)
    if (email) {
      sendCustomerConfirmation({ name, email, service, date, time }).catch((err) =>
        console.error("[Contact] Customer email error:", err)
      );
    }

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
      from: "Lixin VN <noreply@lixinvn.com>",
      to: ["lixinvn.co.ltd@gmail.com"],
      subject,
      html,
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error("[Contact] Resend API error:", result);
  } else {
    console.log("[Contact] Admin email sent:", result.id);
  }
}

async function sendCustomerConfirmation(info: {
  name: string;
  email: string;
  service?: string;
  date?: string;
  time?: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const SERVICE_LABELS: Record<string, string> = {
    accounting: "Dịch vụ kế toán",
    management: "Tư vấn quản lý",
    tax: "Tư vấn thuế",
    finance: "Tư vấn tài chính",
    investment: "Tư vấn đầu tư",
    hr: "Tư vấn nguồn nhân lực",
    tech: "Tư vấn chuyển giao công nghệ",
    customs: "Dịch vụ khai báo hải quan",
    setup: "Thành lập doanh nghiệp",
  };

  const serviceLabel = info.service ? SERVICE_LABELS[info.service] || info.service : "";

  const appointmentHtml =
    info.date || info.time
      ? `
        <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-weight: bold; color: #374151; font-size: 15px;">📅 Thông tin lịch hẹn</p>
          ${info.date ? `<p style="margin: 4px 0; font-size: 14px; color: #4b5563;">Ngày: <strong style="color: #1f2937;">${info.date}</strong></p>` : ""}
          ${info.time ? `<p style="margin: 4px 0; font-size: 14px; color: #4b5563;">Khung giờ: <strong style="color: #1f2937;">${info.time}</strong></p>` : ""}
        </div>
      `
      : "";

  const subject = `Cảm ơn ${info.name} — Lixin VN đã nhận yêu cầu tư vấn của bạn`;
  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 28px; color: #eab308; letter-spacing: 2px;">LIXIN</h1>
        <p style="margin: 4px 0 0; color: #9ca3af; font-size: 13px; letter-spacing: 1px;">TƯ VẤN KẾ TOÁN & PHÁP LÝ</p>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="font-size: 16px; color: #1f2937; margin: 0 0 8px;">Kính gửi <strong>${info.name}</strong>,</p>
        
        <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 16px 0;">
          Cảm ơn Quý khách đã tin tưởng và gửi yêu cầu tư vấn đến <strong>Công ty TNHH Dịch vụ và Tư vấn Lixin (Việt Nam)</strong>.
        </p>

        <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 16px 0;">
          Chúng tôi đã tiếp nhận thông tin${serviceLabel ? ` về <strong>${serviceLabel}</strong>` : ""} của Quý khách. 
          Đội ngũ tư vấn sẽ liên hệ lại trong thời gian sớm nhất (trong vòng <strong>24 giờ làm việc</strong>) để hỗ trợ chi tiết.
        </p>

        ${appointmentHtml}

        <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 16px 0;">
          Nếu có bất kỳ thắc mắc nào, Quý khách vui lòng liên hệ:
        </p>

        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0; font-size: 14px; color: #374151;">📞 Hotline / Zalo: <strong>0395 536 768</strong></p>
          <p style="margin: 4px 0; font-size: 14px; color: #374151;">📧 Email: <strong>lixinvn.co.ltd@gmail.com</strong></p>
          <p style="margin: 4px 0; font-size: 14px; color: #374151;">🌐 Website: <a href="https://lixinvn.com" style="color: #eab308; text-decoration: none; font-weight: bold;">lixinvn.com</a></p>
        </div>

        <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 20px 0 4px;">Trân trọng,</p>
        <p style="font-size: 14px; color: #1f2937; font-weight: 600; margin: 0;">Đội ngũ Lixin Việt Nam</p>
      </div>

      <div style="background: #1a1a1a; padding: 20px 24px; text-align: center;">
        <p style="margin: 0 0 4px; color: #9ca3af; font-size: 12px;">Công ty TNHH Dịch vụ và Tư vấn Lixin (Việt Nam)</p>
        <p style="margin: 0; color: #6b7280; font-size: 11px;">Số 2, Tổ 4, Ấp 4, xã Truông Mít, Tỉnh Tây Ninh</p>
        <p style="margin: 8px 0 0; color: #4b5563; font-size: 11px;">Email này được gửi tự động. Vui lòng không trả lời email này.</p>
      </div>
    </div>
  `;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "Lixin VN <noreply@lixinvn.com>",
      to: [info.email],
      subject,
      html,
    }),
  });

  const result = await res.json();
  if (!res.ok) {
    console.error("[Contact] Customer email error:", result);
  } else {
    console.log("[Contact] Customer confirmation sent:", result.id);
  }
}
