-- Add password protection columns to wraps table
ALTER TABLE wraps ADD COLUMN IF NOT EXISTS has_password BOOLEAN DEFAULT false;
ALTER TABLE wraps ADD COLUMN IF NOT EXISTS password TEXT;
