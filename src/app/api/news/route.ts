import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 -]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    const supabase = await createClient();

    let query = supabase
      .from("news")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (status && status !== "all") {
      query = query.eq("status", status);
    }

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data, total: count }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title_vi,
      title_en,
      title_zh,
      content_vi,
      content_en,
      content_zh,
      excerpt_vi,
      excerpt_en,
      excerpt_zh,
      category,
      cover_image,
      status,
    } = body;

    if (!title_vi) {
      return NextResponse.json({ error: "title_vi is required" }, { status: 400 });
    }

    const baseSlug = slugify(title_vi);
    const slug = `${baseSlug}-${Date.now()}`;

    const { data, error } = await supabase
      .from("news")
      .insert([
        {
          slug,
          title_vi,
          title_en: title_en || "",
          title_zh: title_zh || "",
          content_vi: content_vi || "",
          content_en: content_en || "",
          content_zh: content_zh || "",
          excerpt_vi: excerpt_vi || "",
          excerpt_en: excerpt_en || "",
          excerpt_zh: excerpt_zh || "",
          category: category || "general",
          cover_image: cover_image || "",
          status: status || "draft",
          author: session.user.email || "",
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
