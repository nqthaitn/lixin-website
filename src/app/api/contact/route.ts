import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSettingValue } from "@/app/api/admin/settings/route";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, service, date, time, notes, locale } = body;
    const customerLocale = ["vi", "en", "zh"].includes(locale) ? locale : "vi";

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
        locale: customerLocale,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Read settings for email
    const emailNotifications = await getSettingValue("email_notifications").catch(() => "true");
    const notifyEmail = await getSettingValue("contact_notify_email").catch(
      () => "lixinvn.co.ltd@gmail.com"
    );
    const adminPhone = await getSettingValue("admin_phone").catch(() => "0395 536 768");

    // Send email notification to admin (non-blocking)
    if (emailNotifications !== "false") {
      sendEmailNotification({
        name,
        phone,
        email,
        service,
        date,
        time,
        notes,
        locale: customerLocale,
        notifyEmail,
      }).catch((err) => console.error("[Contact] Admin email error:", err));
    }

    // Send confirmation email to customer (non-blocking)
    if (email) {
      sendCustomerConfirmation({
        name,
        email,
        service,
        date,
        time,
        locale: customerLocale,
        adminPhone,
      }).catch((err) => console.error("[Contact] Customer email error:", err));
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
  locale?: string;
  notifyEmail?: string;
}) {
  const LOCALE_LABELS: Record<string, string> = {
    vi: "🇻🇳 Tiếng Việt",
    en: "🇬🇧 English",
    zh: "🇨🇳 中文",
  };
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

  const logoUrl = "https://lixinvn.com/images/logo-lixin.png";

  const subject = `[Lixin VN] Yêu cầu tư vấn mới từ ${info.name}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 24px; text-align: center;">
        <img src="${logoUrl}" alt="Lixin Vietnam" width="160" height="55" style="display: block; margin: 0 auto 8px;" />
        <p style="margin: 0; color: #9ca3af; font-size: 13px; letter-spacing: 1px;">Yêu cầu tư vấn mới</p>
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
          <tr>
            <td style="padding: 8px 0; font-weight: bold; color: #374151;">Ngôn ngữ:</td>
            <td style="padding: 8px 0; color: #1f2937;">${LOCALE_LABELS[info.locale || "vi"] || info.locale}</td>
          </tr>
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
      to: [info.notifyEmail || "lixinvn.co.ltd@gmail.com"],
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
  locale?: string;
  adminPhone?: string;
}) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return;

  const locale = info.locale || "vi";
  const logoUrl = "https://lixinvn.com/images/logo-lixin.png";

  // i18n translations
  const i18n: Record<string, Record<string, string>> = {
    vi: {
      subtitle: "TƯ VẤN KẾ TOÁN & PHÁP LÝ",
      greeting: `Kính gửi <strong>${info.name}</strong>,`,
      thanks: `Cảm ơn Quý khách đã tin tưởng và gửi yêu cầu tư vấn đến <strong>Công ty TNHH Dịch vụ và Tư vấn Lixin (Việt Nam)</strong>.`,
      received:
        "Chúng tôi đã tiếp nhận thông tin{service} của Quý khách. \nĐội ngũ tư vấn sẽ liên hệ lại trong thời gian sớm nhất (trong vòng <strong>24 giờ làm việc</strong>) để hỗ trợ chi tiết.",
      appointmentTitle: "📅 Thông tin lịch hẹn",
      dateLabel: "Ngày:",
      timeLabel: "Khung giờ:",
      contactUs: "Nếu có bất kỳ thắc mắc nào, Quý khách vui lòng liên hệ:",
      regards: "Trân trọng,",
      team: "Đội ngũ Lixin Việt Nam",
      companyFull: "Công ty TNHH Dịch vụ và Tư vấn Lixin (Việt Nam)",
      address: "Số 2, Tổ 4, Ấp 4, xã Truông Mít, Tỉnh Tây Ninh",
      autoEmail: "Email này được gửi tự động. Vui lòng không trả lời email này.",
    },
    en: {
      subtitle: "ACCOUNTING & TAX ADVISORY",
      greeting: `Dear <strong>${info.name}</strong>,`,
      thanks: `Thank you for your trust and for submitting a consultation request to <strong>Lixin Consulting & Services Co., Ltd (Vietnam)</strong>.`,
      received:
        "We have received your information{service}. \nOur consulting team will contact you as soon as possible (within <strong>24 business hours</strong>) to provide detailed assistance.",
      appointmentTitle: "📅 Appointment Information",
      dateLabel: "Date:",
      timeLabel: "Time:",
      contactUs: "If you have any questions, please contact us:",
      regards: "Best regards,",
      team: "Lixin Vietnam Team",
      companyFull: "Lixin Consulting & Services Co., Ltd (Vietnam)",
      address: "No. 2, Group 4, Hamlet 4, Truong Mit Commune, Tay Ninh Province",
      autoEmail: "This is an automated email. Please do not reply to this email.",
    },
    zh: {
      subtitle: "会计与税务咨询",
      greeting: `尊敬的 <strong>${info.name}</strong>，`,
      thanks: `感谢您的信任，并向 <strong>Lixin咨询与服务有限责任公司（越南）</strong> 提交咨询请求。`,
      received:
        "我们已收到您的信息{service}。\n我们的咨询团队将尽快与您联系（在 <strong>24 个工作时内</strong>），以提供详细的帮助。",
      appointmentTitle: "📅 预约信息",
      dateLabel: "日期：",
      timeLabel: "时间：",
      contactUs: "如有任何疑问，请联系我们：",
      regards: "此致敬意，",
      team: "Lixin越南团队",
      companyFull: "Lixin咨询与服务有限责任公司（越南）",
      address: "西宁省信德县 Truong Mit社4杜4组2号",
      autoEmail: "本邮件为自动发送，请勿回复。",
    },
  };

  const t = i18n[locale] || i18n.vi;

  const SERVICE_LABELS: Record<string, Record<string, string>> = {
    vi: {
      accounting: "Dịch vụ kế toán",
      management: "Tư vấn quản lý",
      tax: "Tư vấn thuế",
      finance: "Tư vấn tài chính",
      investment: "Tư vấn đầu tư",
      hr: "Tư vấn nguồn nhân lực",
      tech: "Tư vấn chuyển giao công nghệ",
      customs: "Khai báo hải quan",
      setup: "Thành lập doanh nghiệp",
    },
    en: {
      accounting: "Accounting Services",
      management: "Management Consulting",
      tax: "Tax Advisory",
      finance: "Financial Consulting",
      investment: "Investment Consulting",
      hr: "HR Consulting",
      tech: "Technology Transfer",
      customs: "Customs Declaration",
      setup: "Business Setup",
    },
    zh: {
      accounting: "会计服务",
      management: "管理咨询",
      tax: "税务咨询",
      finance: "财务咨询",
      investment: "投资咨询",
      hr: "人力资源咨询",
      tech: "技术转让",
      customs: "海关申报",
      setup: "企业设立",
    },
  };

  const svcLabels = SERVICE_LABELS[locale] || SERVICE_LABELS.vi;
  const serviceLabel = info.service ? svcLabels[info.service] || info.service : "";

  const appointmentHtml =
    info.date || info.time
      ? `
        <div style="background: #fefce8; border: 1px solid #fde68a; border-radius: 8px; padding: 16px; margin: 20px 0;">
          <p style="margin: 0 0 8px; font-weight: bold; color: #374151; font-size: 15px;">${t.appointmentTitle}</p>
          ${info.date ? `<p style="margin: 4px 0; font-size: 14px; color: #4b5563;">${t.dateLabel} <strong style="color: #1f2937;">${info.date}</strong></p>` : ""}
          ${info.time ? `<p style="margin: 4px 0; font-size: 14px; color: #4b5563;">${t.timeLabel} <strong style="color: #1f2937;">${info.time}</strong></p>` : ""}
        </div>
      `
      : "";

  const subjects: Record<string, string> = {
    vi: `Cảm ơn ${info.name} — Lixin VN đã nhận yêu cầu tư vấn của bạn`,
    en: `Thank you ${info.name} — Lixin VN has received your consultation request`,
    zh: `感谢 ${info.name} — Lixin VN 已收到您的咨询请求`,
  };

  const subject = subjects[locale] || subjects.vi;
  const receivedText = t.received.replace(
    "{service}",
    serviceLabel ? ` <strong>${serviceLabel}</strong>` : ""
  );

  const html = `
    <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
      <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 32px 24px; text-align: center;">
        <img src="${logoUrl}" alt="Lixin Vietnam" width="180" height="62" style="display: block; margin: 0 auto 8px;" />
        <p style="margin: 0; color: #9ca3af; font-size: 13px; letter-spacing: 1px;">${t.subtitle}</p>
      </div>

      <div style="padding: 32px 24px; border: 1px solid #e5e7eb; border-top: none;">
        <p style="font-size: 16px; color: #1f2937; margin: 0 0 8px;">${t.greeting}</p>
        
        <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 16px 0;">
          ${t.thanks}
        </p>

        <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 16px 0;">
          ${receivedText}
        </p>

        ${appointmentHtml}

        <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 16px 0;">
          ${t.contactUs}
        </p>

        <div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">
          <p style="margin: 4px 0; font-size: 14px; color: #374151;">📞 Hotline / Zalo: <strong>${info.adminPhone || "0395 536 768"}</strong></p>
          <p style="margin: 4px 0; font-size: 14px; color: #374151;">📧 Email: <strong>lixinvn.co.ltd@gmail.com</strong></p>
          <p style="margin: 4px 0; font-size: 14px; color: #374151;">🌐 Website: <a href="https://lixinvn.com" style="color: #eab308; text-decoration: none; font-weight: bold;">lixinvn.com</a></p>
        </div>

        <p style="font-size: 14px; color: #4b5563; line-height: 1.7; margin: 20px 0 4px;">${t.regards}</p>
        <p style="font-size: 14px; color: #1f2937; font-weight: 600; margin: 0;">${t.team}</p>
      </div>

      <div style="background: #1a1a1a; padding: 20px 24px; text-align: center;">
        <p style="margin: 0 0 4px; color: #9ca3af; font-size: 12px;">${t.companyFull}</p>
        <p style="margin: 0; color: #6b7280; font-size: 11px;">${t.address}</p>
        <p style="margin: 8px 0 0; color: #4b5563; font-size: 11px;">${t.autoEmail}</p>
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
