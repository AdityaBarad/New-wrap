-- Add phone column to wraps table and drop lead_id

ALTER TABLE wraps
ADD COLUMN IF NOT EXISTS phone text;

-- Create an index on phone for fast lookups in the My Wraps dashboard
CREATE INDEX IF NOT EXISTS wraps_phone_idx ON wraps(phone);

-- Drop lead_id as we no longer use UUIDs for relationships
ALTER TABLE wraps
DROP COLUMN IF NOT EXISTS lead_id;
