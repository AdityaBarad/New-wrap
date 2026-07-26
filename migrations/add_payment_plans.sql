-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  price numeric NOT NULL,
  features jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Insert default plans
INSERT INTO plans (name, price, features) VALUES
('basic', 700, '{"hosting": "6_months", "delivery": "1-2_days", "has_song": false, "all_images": false, "full_slides": false}'::jsonb),
('elite', 1500, '{"hosting": "1_year", "delivery": "instant", "has_song": true, "all_images": true, "full_slides": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

-- Modify wraps table to support drafts, plans, and active status
ALTER TABLE wraps ADD COLUMN IF NOT EXISTS status text DEFAULT 'draft';
ALTER TABLE wraps ADD COLUMN IF NOT EXISTS plan_id uuid REFERENCES plans(id);
ALTER TABLE wraps ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

-- Make ai_content nullable for drafts
ALTER TABLE wraps ALTER COLUMN ai_content DROP NOT NULL;

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wrap_slug text NOT NULL REFERENCES wraps(slug) ON DELETE CASCADE,
  razorpay_order_id text NOT NULL,
  razorpay_payment_id text,
  amount numeric NOT NULL,
  status text DEFAULT 'pending',
  plan_id uuid REFERENCES plans(id),
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on new tables (if needed)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view plans" ON plans FOR SELECT USING (true);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can insert payments" ON payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can view their payments" ON payments FOR SELECT USING (true);
CREATE POLICY "Anyone can update payments" ON payments FOR UPDATE USING (true);
