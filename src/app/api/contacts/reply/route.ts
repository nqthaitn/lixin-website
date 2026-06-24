import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    if (!(await requireUser(supabase))) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { contactId, to, subject, message } = await request.json();

    if (!to || !subject || !message) {
      return NextResponse.json(
        { error: "Email, tiêu đề và nội dung là bắt buộc" },
        { status: 400 }
      );
    }

    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json({ error: "Email service not configured" }, { status: 500 });
    }

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
        <div style="background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%); padding: 28px 24px; text-align: center;">
          <img src="https://lixinvn.com/images/logo-lixin.png" alt="Lixin Vietnam" width="160" height="55" style="display: block; margin: 0 auto 8px;" />
          <p style="margin: 0; color: #9ca3af; font-size: 12px; letter-spacing: 1px;">TƯ VẤN KẾ TOÁN & PHÁP LÝ</p>
        </div>

        <div style="padding: 28px 24px; border: 1px solid #e5e7eb; border-top: none;">
          <div style="font-size: 14px; color: #374151; line-height: 1.8; white-space: pre-wrap;">${message}</div>

          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #f3f4f6;">
            <p style="font-size: 14px; color: #4b5563; margin: 0 0 4px;">Trân trọng,</p>
            <p style="font-size: 14px; color: #1f2937; font-weight: 600; margin: 0;">Đội ngũ Lixin Việt Nam</p>
          </div>

          <div style="background: #f9fafb; border-radius: 8px; padding: 14px; margin-top: 20px;">
            <p style="margin: 3px 0; font-size: 13px; color: #374151;">📞 Hotline / Zalo: <strong>0395 536 768</strong></p>
            <p style="margin: 3px 0; font-size: 13px; color: #374151;">📧 Email: <strong>lixinvn.co.ltd@gmail.com</strong></p>
            <p style="margin: 3px 0; font-size: 13px; color: #374151;">🌐 Website: <a href="https://lixinvn.com" style="color: #eab308; text-decoration: none; font-weight: bold;">lixinvn.com</a></p>
          </div>
        </div>

        <div style="background: #1a1a1a; padding: 16px 24px; text-align: center;">
          <p style="margin: 0 0 4px; color: #9ca3af; font-size: 11px;">Công ty TNHH Dịch vụ và Tư vấn Lixin (Việt Nam)</p>
          <p style="margin: 0; color: #6b7280; font-size: 10px;">Số 2, Tổ 4, Ấp 4, xã Truông Mít, Tỉnh Tây Ninh</p>
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
        to: [to],
        subject,
        html,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      console.error("[Reply] Resend error:", result);
      return NextResponse.json({ error: "Gửi email thất bại" }, { status: 500 });
    }

    // Update admin_note with reply log
    if (contactId) {
      const { data: contact } = await supabase
        .from("contacts")
        .select("admin_note")
        .eq("id", contactId)
        .single();

      const timestamp = new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" });
      const replyLog = `[${timestamp}] Đã gửi email: "${subject}"`;
      const newNote = contact?.admin_note ? `${contact.admin_note}\n${replyLog}` : replyLog;

      await supabase
        .from("contacts")
        .update({ admin_note: newNote, status: "contacted" })
        .eq("id", contactId);
    }

    console.log("[Reply] Email sent to", to, "id:", result.id);
    return NextResponse.json({ success: true, emailId: result.id }, { status: 200 });
  } catch (err) {
    console.error("[Reply] Error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
