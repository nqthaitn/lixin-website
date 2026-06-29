-- Migration: Atomic per-article read counter for anonymous visitors
-- Run this in Supabase Dashboard > SQL Editor
--
-- The detail page is statically cached (revalidate 1 day), so the read count
-- can't be bumped during render. Instead the browser fires a fire-and-forget
-- POST /api/news/[id]/view, which calls this RPC. SECURITY DEFINER lets the
-- anon role increment without granting it write access to the news table
-- (no broad UPDATE policy needed). The UPDATE is atomic, so concurrent reads
-- don't lose counts.

CREATE OR REPLACE FUNCTION increment_news_view(article_id bigint)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE news
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = article_id
    AND status = 'published';
$$;

-- Anonymous (logged-out) visitors are the ones reading articles.
GRANT EXECUTE ON FUNCTION increment_news_view(bigint) TO anon;
