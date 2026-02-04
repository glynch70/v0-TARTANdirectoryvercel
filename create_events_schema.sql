-- Create Events Table
CREATE TABLE If NOT EXISTS public.events (
    event_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_name text NOT NULL,
    event_date timestamp with time zone NOT NULL,
    location text,
    description text,
    capacity int,
    image_url text,
    created_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Create RSVPs Table
CREATE TABLE IF NOT EXISTS public.event_rsvps (
    rsvp_id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    event_id uuid REFERENCES public.events(event_id) ON DELETE CASCADE,
    member_id uuid REFERENCES public.members(member_id) ON DELETE CASCADE,
    status text DEFAULT 'going',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(event_id, member_id)
);

-- Enable RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_rsvps ENABLE ROW LEVEL SECURITY;

-- Events Policies
-- Everyone can view events
CREATE POLICY "Enable read access for all users" ON public.events
    FOR SELECT USING (true);

-- Only authenticated users can insert/update events (assuming all auth users are trusted for now as per previous context, or we can restrict to specific IDs later)
CREATE POLICY "Enable insert for authenticated users" ON public.events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users" ON public.events
    FOR UPDATE USING (auth.role() = 'authenticated');

-- RSVP Policies
-- Members can view their own RSVPs and RSVPs for events
CREATE POLICY "Enable read access for authenticated users" ON public.event_rsvps
    FOR SELECT USING (auth.role() = 'authenticated');

-- Members can RSVP for themselves (linking auth.uid() to member_id is tricky if they aren't 1:1, but usually auth.uid() = member_id based on previous file viewing)
-- Validating from previous turn: "Owner only select... USING (auth.uid() = member_id)"
CREATE POLICY "Enable insert for owners" ON public.event_rsvps
    FOR INSERT WITH CHECK (auth.uid() = member_id);

CREATE POLICY "Enable delete for owners" ON public.event_rsvps
    FOR DELETE USING (auth.uid() = member_id);

-- Storage Bucket for Event Images
INSERT INTO storage.buckets (id, name, public) VALUES ('event-images', 'event-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Give public access to event images" ON storage.objects
  FOR SELECT USING (bucket_id = 'event-images');

CREATE POLICY "Enable upload for authenticated users" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'event-images' AND auth.role() = 'authenticated');
