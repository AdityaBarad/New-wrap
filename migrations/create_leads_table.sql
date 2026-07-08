-- Create leads table for the wrapped app
CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  whats_this_for text,
  promo_code text,
  purpose text NOT NULL,
  stage integer DEFAULT 1,
  user_names text,
  chat_export_name text,
  vibe text,
  anthem_title text,
  anniversary_date text,
  destination_city text,
  travel_hours text,
  delusional_habit text,
  birth_year text,
  photos text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create an index on created_at for better query performance
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads(created_at DESC);

-- Enable RLS (Row Level Security) on the table
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to insert (for the public form)
CREATE POLICY "Anyone can insert leads" ON leads
  FOR INSERT WITH CHECK (true);

-- Create a policy that allows anyone to select their own leads
CREATE POLICY "Anyone can view their own leads" ON leads
  FOR SELECT USING (true);
