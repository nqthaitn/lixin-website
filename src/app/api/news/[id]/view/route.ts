import { NextResponse } from "next/server";
import { supabasePublic } from "@/lib/supabase/public";

// Public read-counter endpoint. The browser fires this once per session per
// article (deduped client-side) when a visitor opens a news detail page.
// Auth-less by design — anonymous readers are exactly who we're counting.
// The heavy lifting (atomic increment, published-only guard) lives in the
// SECURITY DEFINER RPC `increment_news_view`, so this route just validates the
// id and forwards the call.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Ids are numeric (bigint). Reject anything else before hitting the DB.
  if (!/^\d+$/.test(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const { error } = await supabasePublic.rpc("increment_news_view", {
    article_id: Number(id),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // No body needed — the caller is fire-and-forget.
  return new NextResponse(null, { status: 204 });
}
