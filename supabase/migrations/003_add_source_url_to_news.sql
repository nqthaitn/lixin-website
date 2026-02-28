-- Add source_url column to news table (for admin reference only, not displayed to users)
ALTER TABLE news ADD COLUMN IF NOT EXISTS source_url TEXT DEFAULT NULL;
