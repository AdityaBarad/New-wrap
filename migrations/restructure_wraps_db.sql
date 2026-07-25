-- 1. Create the true Users table where phone is the Primary Key
CREATE TABLE IF NOT EXISTS users (
  phone text PRIMARY KEY,
  name text,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Anyone can view users" ON users FOR SELECT USING (true);

-- Clean up any old test data in wraps that doesn't have a phone number (prevents foreign key errors)
DELETE FROM wraps WHERE phone IS NULL;

-- 2. Populate users table from existing wraps
INSERT INTO users (phone, name)
SELECT DISTINCT phone, name FROM wraps
ON CONFLICT (phone) DO NOTHING;

-- 3. Modify the wraps table to remove UUIDs and establish the relation
-- First, drop the old UUID primary key constraint and the column itself
ALTER TABLE wraps DROP CONSTRAINT IF EXISTS wraps_pkey CASCADE;
ALTER TABLE wraps DROP COLUMN IF EXISTS id;

-- Second, promote `slug` to be the true Primary Key of the wraps table
ALTER TABLE wraps ADD PRIMARY KEY (slug);

-- Third, establish the strict Foreign Key relationship to the new users table
ALTER TABLE wraps
ADD CONSTRAINT wraps_phone_fkey
FOREIGN KEY (phone) 
REFERENCES users(phone)
ON DELETE CASCADE;
