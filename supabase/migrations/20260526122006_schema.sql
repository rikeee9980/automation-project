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
