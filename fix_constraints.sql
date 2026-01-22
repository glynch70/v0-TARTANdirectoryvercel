-- Drop the strict foreign key link to auth.users (or public.users)
-- This allows us to create 'directory-only' members who haven't signed up yet.
ALTER TABLE "public"."members" DROP CONSTRAINT IF EXISTS "members_member_id_fkey";
ALTER TABLE "public"."members" DROP CONSTRAINT IF EXISTS "members_user_id_fkey"; -- Just in case

-- Optional: Ensure member_id is still the Primary Key
-- (Existing PK constraint should remain untouched)
