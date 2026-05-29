-- Add latitude and longitude columns to the demands table
ALTER TABLE demands ADD COLUMN IF NOT EXISTS lat float8;
ALTER TABLE demands ADD COLUMN IF NOT EXISTS lng float8;
