import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function getRecreateViewSql() {
    // Query information schema for existing columns in directory_profiles
    const { data: viewData, error: viewError } = await supabase
        .from('directory_profiles')
        .select('*')
        .limit(1)

    if (viewError && !viewError.message.includes('column directory_profiles.avatar_url does not exist')) {
        console.error('Failed to get view structure via limit', viewError)
        console.error('Attempting manual DROP query generation.')
    }

    // Generate safe drop-and-create SQL
    const sql = `
  -- Safely drop the view to bypass PostgreSQL column mismatch errors (42P16)
  DROP VIEW IF EXISTS public.directory_profiles CASCADE;

  -- Recreate it with ALL columns
  CREATE VIEW public.directory_profiles AS
  SELECT 
      m.member_id,
      m.first_name,
      m.last_name,
      m.company,
      m.trade,
      m.website,
      m.location,
      m.status,
      m.category,
      m.tags,
      m.email,
      m.phone,
      m.membership_type,
      m.avatar_url,
      m.social_media
  FROM public.members m
  WHERE m.status = 'Active';

  -- Ensure the new view has the correct permissions
  GRANT SELECT ON public.directory_profiles TO anon, authenticated;

  -- Reload PostgREST API
  NOTIFY pgrst, 'reload schema';
  `;

    console.log('\n⚠️ THE FIX FOR ERROR 42P16:')
    console.log('Copy and paste this new script. It will DROP the old confusing view before making the new one:')
    console.log('--------------------------------------------------')
    console.log(sql)
    console.log('--------------------------------------------------')
    console.log('✅ Done.')
}

getRecreateViewSql()
