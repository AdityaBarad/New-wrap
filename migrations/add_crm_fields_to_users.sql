-- Add CRM tracking fields to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS called boolean DEFAULT false;
ALTER TABLE users ADD COLUMN IF NOT EXISTS call_status text DEFAULT 'pending';
ALTER TABLE users ADD COLUMN IF NOT EXISTS admin_notes text;
