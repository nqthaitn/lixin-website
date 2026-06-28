-- Migration: Add homepage stat settings + public (anon) read for them
-- Run this in Supabase Dashboard > SQL Editor

-- Seed the 4 homepage stats (display strings: "200+", "7+", "9", "29+")
INSERT INTO site_settings (key, value) VALUES
  ('stat_clients',  '200+'),
  ('stat_years',    '7+'),
  ('stat_services', '9'),
  ('stat_experts',  '29+')
ON CONFLICT (key) DO NOTHING;

-- The homepage is public (anon), so anon must be able to read the stat values.
-- Scope the policy to ONLY the stat keys — other settings (emails, toggles)
-- stay readable by authenticated admins only.
CREATE POLICY "Allow anon read home stats" ON site_settings
  FOR SELECT TO anon
  USING (key IN ('stat_clients', 'stat_years', 'stat_services', 'stat_experts'));
