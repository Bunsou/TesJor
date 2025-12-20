-- Migration: Unify listings schema
-- This migration completes the unified listings strategy by:
-- 1. Cleaning up user_progress to use single listing_id
-- 2. Ensuring all indexes are in place

-- Clear user_progress data since we're changing the structure
TRUNCATE TABLE user_progress CASCADE;

-- Drop old foreign key columns from user_progress
ALTER TABLE user_progress DROP COLUMN IF EXISTS place_id;
ALTER TABLE user_progress DROP COLUMN IF EXISTS event_id;
ALTER TABLE user_progress DROP COLUMN IF EXISTS food_id;
ALTER TABLE user_progress DROP COLUMN IF EXISTS drink_id;
ALTER TABLE user_progress DROP COLUMN IF EXISTS souvenir_id;

-- Add listing_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'user_progress' AND column_name = 'listing_id') THEN
    ALTER TABLE user_progress ADD COLUMN listing_id uuid NOT NULL;
  END IF;
END $$;

-- Add foreign key constraint to listings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'user_progress_listing_id_listings_id_fk') THEN
    ALTER TABLE user_progress 
    ADD CONSTRAINT user_progress_listing_id_listings_id_fk 
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE cascade;
  END IF;
END $$;

-- Create indexes on listing_photos if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'listing_photos_listing_id_idx') THEN
    CREATE INDEX listing_photos_listing_id_idx ON listing_photos USING btree (listing_id);
  END IF;
END $$;

-- Create indexes on listings if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'listings_category_idx') THEN
    CREATE INDEX listings_category_idx ON listings USING btree (category);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'listings_slug_idx') THEN
    CREATE INDEX listings_slug_idx ON listings USING btree (slug);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'listings_title_idx') THEN
    CREATE INDEX listings_title_idx ON listings USING btree (title);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'listings_lat_lng_idx') THEN
    CREATE INDEX listings_lat_lng_idx ON listings USING btree (lat, lng);
  END IF;
END $$;

-- Create indexes on reviews if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'reviews_listing_id_idx') THEN
    CREATE INDEX reviews_listing_id_idx ON reviews USING btree (listing_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'reviews_user_id_idx') THEN
    CREATE INDEX reviews_user_id_idx ON reviews USING btree (user_id);
  END IF;
END $$;

-- Create indexes on user_progress if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'user_progress_listing_id_idx') THEN
    CREATE INDEX user_progress_listing_id_idx ON user_progress USING btree (listing_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'user_progress_user_listing_idx') THEN
    CREATE INDEX user_progress_user_listing_idx ON user_progress USING btree (user_id, listing_id);
  END IF;
END $$;

-- Add foreign key constraints to listing_photos if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'listing_photos_listing_id_listings_id_fk') THEN
    ALTER TABLE listing_photos 
    ADD CONSTRAINT listing_photos_listing_id_listings_id_fk 
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE cascade;
  END IF;
END $$;

-- Add foreign key constraints to reviews if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'reviews_listing_id_listings_id_fk') THEN
    ALTER TABLE reviews 
    ADD CONSTRAINT reviews_listing_id_listings_id_fk 
    FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE cascade;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints 
                 WHERE constraint_name = 'reviews_user_id_users_id_fk') THEN
    ALTER TABLE reviews 
    ADD CONSTRAINT reviews_user_id_users_id_fk 
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE cascade;
  END IF;
END $$;
