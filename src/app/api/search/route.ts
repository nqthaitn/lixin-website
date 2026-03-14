import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();
    const locale = searchParams.get("locale") || "vi";
    const limit = parseInt(searchParams.get("limit") || "5");

    if (!q || q.length < 2) {
      return NextResponse.json({ news: [], services: [], total: 0 });
    }

    const supabase = await createClient();
    const titleField = `title_${locale}`;
    const excerptField = `excerpt_${locale}`;

    // Search news by title and excerpt in the current locale
    const { data: newsData } = await supabase
      .from("news")
      .select(
        "id, slug, title_vi, title_en, title_zh, excerpt_vi, excerpt_en, excerpt_zh, category, cover_image, created_at"
      )
      .eq("status", "published")
      .or(`${titleField}.ilike.%${q}%,${excerptField}.ilike.%${q}%,tags.ilike.%${q}%`)
      .order("created_at", { ascending: false })
      .limit(limit);

    const news = (newsData || []).map((item) => ({
      id: item.id,
      slug: item.slug,
      title: ((item as Record<string, unknown>)[titleField] as string) || item.title_vi,
      excerpt: ((item as Record<string, unknown>)[excerptField] as string) || item.excerpt_vi,
      category: item.category,
      cover_image: item.cover_image,
      created_at: item.created_at,
    }));

    // Services are static data - search from translation keys
    const serviceKeys = [
      {
        slug: "accounting",
        vi: "Dịch vụ kế toán",
        en: "Accounting Services",
        zh: "会计服务",
        vi_desc: "Cung cấp dịch vụ kế toán trọn gói, báo cáo tài chính",
        en_desc: "Full-package accounting services, financial reporting",
        zh_desc: "提供全套会计服务、财务报告",
      },
      {
        slug: "tax",
        vi: "Tư vấn thuế",
        en: "Tax Consulting",
        zh: "税务咨询",
        vi_desc: "Tư vấn kê khai, quyết toán thuế, tối ưu nghĩa vụ thuế",
        en_desc: "Tax declaration, settlement consulting",
        zh_desc: "税务申报、结算咨询",
      },
      {
        slug: "management",
        vi: "Tư vấn quản lý",
        en: "Management Consulting",
        zh: "管理咨询",
        vi_desc: "Tư vấn chiến lược quản lý doanh nghiệp",
        en_desc: "Business management strategy consulting",
        zh_desc: "企业管理战略咨询",
      },
      {
        slug: "finance",
        vi: "Tư vấn tài chính",
        en: "Financial Consulting",
        zh: "财务咨询",
        vi_desc: "Phân tích tài chính, lập kế hoạch ngân sách",
        en_desc: "Financial analysis, budget planning",
        zh_desc: "财务分析、预算规划",
      },
      {
        slug: "investment",
        vi: "Tư vấn đầu tư",
        en: "Investment Consulting",
        zh: "投资咨询",
        vi_desc: "Tư vấn thủ tục đầu tư, giấy phép đầu tư",
        en_desc: "Investment procedure consulting",
        zh_desc: "投资手续咨询",
      },
      {
        slug: "hr",
        vi: "Tư vấn nguồn nhân lực",
        en: "Human Resources Consulting",
        zh: "人力资源咨询",
        vi_desc: "Tư vấn xây dựng bộ máy nhân sự",
        en_desc: "HR structure consulting",
        zh_desc: "人事架构咨询",
      },
      {
        slug: "tech",
        vi: "Tư vấn chuyển giao công nghệ",
        en: "Technology Transfer Consulting",
        zh: "技术转让咨询",
        vi_desc: "Hỗ trợ thủ tục chuyển giao công nghệ",
        en_desc: "Technology transfer procedures support",
        zh_desc: "技术转让手续支持",
      },
      {
        slug: "customs",
        vi: "Dịch vụ khai báo hải quan",
        en: "Customs Declaration Services",
        zh: "海关申报服务",
        vi_desc: "Khai báo hải quan xuất nhập khẩu",
        en_desc: "Import-export customs declaration",
        zh_desc: "进出口海关申报",
      },
      {
        slug: "setup",
        vi: "Thành lập doanh nghiệp",
        en: "Business Establishment",
        zh: "企业设立",
        vi_desc: "Tư vấn và thực hiện thủ tục thành lập công ty",
        en_desc: "Company establishment procedures",
        zh_desc: "公司设立手续咨询与执行",
      },
    ];

    const qLower = q.toLowerCase();
    const services = serviceKeys
      .filter((s) => {
        const title = (s as Record<string, string>)[locale] || s.vi;
        const desc = (s as Record<string, string>)[`${locale}_desc`] || s.vi_desc;
        return title.toLowerCase().includes(qLower) || desc.toLowerCase().includes(qLower);
      })
      .slice(0, 3)
      .map((s) => ({
        slug: s.slug,
        title: (s as Record<string, string>)[locale] || s.vi,
        description: (s as Record<string, string>)[`${locale}_desc`] || s.vi_desc,
      }));

    return NextResponse.json({
      news,
      services,
      total: news.length + services.length,
    });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
