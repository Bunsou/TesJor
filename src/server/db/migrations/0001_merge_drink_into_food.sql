-- Migration: Merge 'drink' category into 'food'
-- This migration updates all listings with category='drink' to category='food'
-- and removes 'drink' from the category enum

-- Step 1: Update all existing listings with category='drink' to category='food'
UPDATE listings SET category = 'food' WHERE category = 'drink';

-- Step 2: Rename the old enum type
ALTER TYPE category RENAME TO category_old;

-- Step 3: Create new enum without 'drink'
CREATE TYPE category AS ENUM('place', 'food', 'souvenir', 'event');

-- Step 4: Update the listings table to use the new enum
ALTER TABLE listings 
  ALTER COLUMN category TYPE category USING category::text::category;

-- Step 5: Drop the old enum type
DROP TYPE category_old;
