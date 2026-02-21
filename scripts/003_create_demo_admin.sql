-- Create a demo Super Admin account
-- Note: This is for development only. In production, admins should sign up through the auth flow.
-- Password: tartantalks2025

-- First, you'll need to sign up through the UI to create the auth.users record
-- Then run this script to grant Super Admin privileges

-- Update an existing user to Super Admin (replace with actual user email)
-- UPDATE public.admin_users
-- SET role = 'Super Admin'
-- WHERE email = 'admin@tartantalks.co.uk';

-- Note: To create the first admin, sign up through /auth/sign-up
-- Then manually update the role in the database or use the Supabase dashboard
