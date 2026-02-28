-- Migration: Add AI News Agent columns to news table
-- Date: 2026-02-27
-- Description: Support AI-generated news with source tracking

ALTER TABLE news ADD COLUMN IF NOT EXISTS source_url TEXT DEFAULT '';
ALTER TABLE news ADD COLUMN IF NOT EXISTS source_type TEXT DEFAULT '';
ALTER TABLE news ADD COLUMN IF NOT EXISTS auto_generated BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN news.source_url IS 'Original article URL (only for gov sources)';
COMMENT ON COLUMN news.source_type IS 'Source type: gov | big4';
COMMENT ON COLUMN news.auto_generated IS 'true if created by AI News Agent';
