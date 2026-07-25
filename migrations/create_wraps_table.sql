-- Create wraps table for storing completed, shareable wraps
CREATE TABLE IF NOT EXISTS wraps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Link back to lead (optional)
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,

  -- Unique URL slug: "zeynep-a1b2c3" — used in the personal URL
  slug text UNIQUE NOT NULL,

  -- User input data (the WrapData fields needed to render)
  name text NOT NULL,
  purpose text NOT NULL,
  user_names text,
  anniversary_date text,
  destination_city text,
  travel_hours text,
  delusional_habit text,
  birth_year text,
  story_paragraph text,
  photo_urls text[],          -- Supabase Storage public URLs

  -- Song data
  song_video_id text,
  song_title text,
  song_artist text,
  song_thumbnail text,

  -- The full AI-generated content (stored as JSONB)
  ai_content jsonb NOT NULL,

  -- Personality card generated image (Supabase Storage URL)
  personality_image_url text,

  -- Metadata
  views integer DEFAULT 0,
  is_public boolean DEFAULT true,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Fast lookup by slug (the personal URL key)
CREATE UNIQUE INDEX IF NOT EXISTS wraps_slug_idx ON wraps(slug);

-- Index on lead_id for quick lookups
CREATE INDEX IF NOT EXISTS wraps_lead_id_idx ON wraps(lead_id);

-- Enable RLS
ALTER TABLE wraps ENABLE ROW LEVEL SECURITY;

-- Anyone can view public wraps (for the personal URL viewer)
CREATE POLICY "Anyone can view public wraps" ON wraps
  FOR SELECT USING (is_public = true);

-- Anyone can insert wraps (from the API)
CREATE POLICY "Anyone can insert wraps" ON wraps
  FOR INSERT WITH CHECK (true);

-- Anyone can update wraps (for view count increment)
CREATE POLICY "Anyone can update wraps" ON wraps
  FOR UPDATE USING (true);
