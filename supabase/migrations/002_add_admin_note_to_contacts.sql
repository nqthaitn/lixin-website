-- Add admin_note column to contacts table for internal notes
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS admin_note TEXT DEFAULT NULL;
