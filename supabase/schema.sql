-- ============================================================
-- Aetheria Real Estate Platform — Supabase Database Schema
-- Run this SQL in your Supabase SQL Editor (supabase.com → SQL)
-- ============================================================

-- 1. Enable Storage for image uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('property-images', 'property-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Properties Table (admin-managed listings)
CREATE TABLE IF NOT EXISTS properties (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price BIGINT NOT NULL,
  location JSONB NOT NULL DEFAULT '{}',
  details JSONB NOT NULL DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  image TEXT,
  before_image TEXT,
  after_image TEXT,
  tagline TEXT,
  ai_score INTEGER DEFAULT 90,
  ai_price_prediction JSONB DEFAULT '{}',
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'delisted')),
  agent_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Inquiries Table (public users can submit)
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  property_title TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'pending')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Seller Submissions Table (public submit, admin reviews)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_name TEXT NOT NULL,
  seller_email TEXT NOT NULL,
  seller_phone TEXT,
  title TEXT NOT NULL,
  price BIGINT NOT NULL,
  location JSONB DEFAULT '{}',
  details JSONB DEFAULT '{}',
  amenities TEXT[] DEFAULT '{}',
  image TEXT,
  description TEXT,
  review_status TEXT DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
  reviewer_notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Properties: Anyone can READ, only authenticated users can INSERT/UPDATE/DELETE
CREATE POLICY "Public can read properties"
  ON properties FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert properties"
  ON properties FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update properties"
  ON properties FOR UPDATE
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete properties"
  ON properties FOR DELETE
  USING (auth.role() = 'authenticated');

-- Inquiries: Anyone can INSERT, only authenticated can READ/UPDATE
CREATE POLICY "Public can insert inquiries"
  ON inquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read inquiries"
  ON inquiries FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update inquiries"
  ON inquiries FOR UPDATE
  USING (auth.role() = 'authenticated');

-- Submissions: Anyone can INSERT, only authenticated can READ/UPDATE
CREATE POLICY "Public can insert submissions"
  ON submissions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read submissions"
  ON submissions FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update submissions"
  ON submissions FOR UPDATE
  USING (auth.role() = 'authenticated');

-- ============================================================
-- STORAGE POLICIES (for property-images bucket)
-- ============================================================

-- Anyone can upload images (for seller submissions)
CREATE POLICY "Anyone can upload property images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'property-images');

-- Anyone can view images (public bucket)
CREATE POLICY "Anyone can view property images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'property-images');

-- Only authenticated users can delete images
CREATE POLICY "Authenticated users can delete property images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'property-images' AND auth.role() = 'authenticated');

-- ============================================================
-- SEED DATA (optional — matches current mockProperties)
-- ============================================================

-- You can run this after creating your admin user to seed initial data.
-- Replace 'YOUR_USER_ID' with your actual auth.users id.

/*
INSERT INTO properties (title, slug, price, location, details, amenities, image, before_image, after_image, tagline, ai_score, ai_price_prediction, status)
VALUES
  (
    'The Helix Penthouse',
    'the-helix-penthouse',
    8500000,
    '{"lat": 40.7128, "lng": -74.006, "address": "88 Obsidian Crest, Sector 4", "city": "Neo Metropolis", "state": "NM", "zip": "10001"}',
    '{"bedrooms": 4, "bathrooms": 4.5, "area": 5200, "floors": 2, "parking": 3}',
    ARRAY['Gravity Pool', 'Holographic Home Theater', 'Automated Security Node', 'AI Chef Station', 'Skydeck'],
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?auto=format&fit=crop&w=800&q=80',
    'Ultra-luxury sky living with 360-degree holographic glass panels.',
    98,
    '{"sixMonth": 8800000, "oneYear": 9200000, "threeYear": 10500000}',
    'available'
  ),
  (
    'Aetheria Eco-Villa',
    'aetheria-eco-villa',
    4200000,
    '{"lat": 40.725, "lng": -74.015, "address": "12 Biophilic Oasis Lane", "city": "Neo Metropolis", "state": "NM", "zip": "10002"}',
    '{"bedrooms": 3, "bathrooms": 3, "area": 3400, "floors": 1, "parking": 2}',
    ARRAY['Self-sustaining Solar Mesh', 'Rainwater Fusion Cell', 'Indoor Vertical Forest', 'Smart Glass Insulation'],
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80',
    'Zero-emission biophilic pod utilizing solar carbon skin technology.',
    94,
    '{"sixMonth": 4400000, "oneYear": 4700000, "threeYear": 5300000}',
    'available'
  ),
  (
    'Nebula Heights Duplex',
    'nebula-heights-duplex',
    6100000,
    '{"lat": 40.7, "lng": -73.99, "address": "42 Chrome Spires, Floor 62", "city": "Neo Metropolis", "state": "NM", "zip": "10003"}',
    '{"bedrooms": 3, "bathrooms": 3.5, "area": 4100, "floors": 2, "parking": 2}',
    ARRAY['Quantum HVAC', 'Smart-Tint Windows', 'Cyber Security Shield', 'Biometric Elevator'],
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1616046229478-9901c5536a45?auto=format&fit=crop&w=800&q=80',
    'Dynamic smart home with cyber-defense shields and high-altitude sky terraces.',
    91,
    '{"sixMonth": 6250000, "oneYear": 6500000, "threeYear": 7200000}',
    'available'
  );
*/
