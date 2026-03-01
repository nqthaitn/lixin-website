-- Migration: Create site_settings table
-- Run this in Supabase Dashboard > SQL Editor

CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(100) PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  ('admin_email',           'lixinvn.co.ltd@gmail.com'),
  ('admin_phone',           '0395 536 768'),
  ('contact_notify_email',  'lixinvn.co.ltd@gmail.com'),
  ('email_notifications',   'true'),
  ('auto_publish_news',     'false')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users (admin) to read and write
CREATE POLICY "Allow auth read settings" ON site_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow auth write settings" ON site_settings
  FOR ALL TO authenticated USING (true);
