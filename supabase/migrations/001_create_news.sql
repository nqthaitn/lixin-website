CREATE TABLE IF NOT EXISTS news (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title_vi TEXT NOT NULL DEFAULT '',
  title_en TEXT NOT NULL DEFAULT '',
  title_zh TEXT NOT NULL DEFAULT '',
  content_vi TEXT NOT NULL DEFAULT '',
  content_en TEXT NOT NULL DEFAULT '',
  content_zh TEXT NOT NULL DEFAULT '',
  excerpt_vi TEXT NOT NULL DEFAULT '',
  excerpt_en TEXT NOT NULL DEFAULT '',
  excerpt_zh TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'other',
  image_url TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE news ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read published news
CREATE POLICY "Public can read published news" ON news
  FOR SELECT USING (status = 'published');

-- Policy: authenticated users can do everything
CREATE POLICY "Auth users full access" ON news
  FOR ALL USING (auth.role() = 'authenticated');