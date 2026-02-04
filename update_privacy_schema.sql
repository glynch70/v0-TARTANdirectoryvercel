-- 1. Add Privacy Columns
ALTER TABLE "public"."members" 
ADD COLUMN IF NOT EXISTS "is_email_public" boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS "is_phone_public" boolean DEFAULT false;

-- 2. Create Secure View for Public Directory
-- This view mocks the 'members' table structure but nullifies private fields
CREATE OR REPLACE VIEW "public"."directory_profiles" AS
SELECT
    member_id,
    first_name,
    last_name,
    company,
    trade,
    website,
    location,
    category,
    status,
    join_date,
    -- Conditional exposure of sensitive fields
    CASE 
        WHEN is_email_public = true THEN email 
        ELSE NULL 
    END as email,
    CASE 
        WHEN is_phone_public = true THEN phone 
        ELSE NULL 
    END as phone,
    -- Also expose the toggles themselves so UI knows state (optional, but good for debugging)
    is_email_public,
    is_phone_public
FROM "public"."members"
WHERE status = 'Active'; -- Ensure we only ever show active members in this view

-- Grant access to the view
GRANT SELECT ON "public"."directory_profiles" TO anon;
GRANT SELECT ON "public"."directory_profiles" TO authenticated;
GRANT SELECT ON "public"."directory_profiles" TO service_role;

-- 3. Update RLS on the main 'members' table
-- First, reset policies to be safe
ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."members";
DROP POLICY IF EXISTS "Enable read access for public" ON "public"."members";
DROP POLICY IF EXISTS "Public Read Access" ON "public"."members";
DROP POLICY IF EXISTS "Owner only update" ON "public"."members";
DROP POLICY IF EXISTS "Owner only select" ON "public"."members";

-- Policy: SELECT (Read)
-- Owners can read their own full data.
-- We do NOT allow public read on this table anymore (they must use the view).
CREATE POLICY "Owner only select"
ON "public"."members"
FOR SELECT
TO public
USING (auth.uid() = member_id);

-- Policy: UPDATE (Edit)
-- Only owners can update their own data.
CREATE POLICY "Owner only update"
ON "public"."members"
FOR UPDATE
TO public
USING (auth.uid() = member_id)
WITH CHECK (auth.uid() = member_id);

-- Policy: INSERT
-- Allow authenticated users to insert their *own* profile row (e.g. during onboarding).
CREATE POLICY "Enable insert for authenticated users"
ON "public"."members"
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = member_id);

-- Note: We are deliberately NOT creating a "Public Read" policy on 'members'.
-- Public/Directory access must go through 'directory_profiles'.
