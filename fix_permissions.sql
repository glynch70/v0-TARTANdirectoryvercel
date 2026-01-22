-- Enable Row Level Security
ALTER TABLE "public"."members" ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to handle any conflicts/bad states
DROP POLICY IF EXISTS "Enable read access for all users" ON "public"."members";
DROP POLICY IF EXISTS "Enable read access for public" ON "public"."members";
DROP POLICY IF EXISTS "Public Read Access" ON "public"."members";

-- Create a permissive policy for reading
CREATE POLICY "Enable read access for all users"
ON "public"."members"
AS PERMISSIVE
FOR SELECT
TO public
USING (true);

-- Ensure public role has usage on schema (standard check)
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Ensure public role has select access on table
GRANT SELECT ON TABLE "public"."members" TO anon;
GRANT SELECT ON TABLE "public"."members" TO authenticated;
