import { NextResponse } from "next/server";
import { getPopularNews } from "@/lib/news";

export async function GET() {
  try {
    const data = await getPopularNews(5);
    return NextResponse.json(
      { data },
      { headers: { "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600" } }
    );
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
