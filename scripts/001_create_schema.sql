-- Create admin users table
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL CHECK (role IN ('Super Admin', 'Admin', 'Read-only')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create members table
CREATE TABLE IF NOT EXISTS public.members (
  member_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  role TEXT,
  location TEXT,
  membership_type TEXT,
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Cancelled')),
  join_date DATE,
  renewal_date DATE,
  events_attended INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  website TEXT,
  member_since TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS public.events (
  event_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_date DATE NOT NULL,
  location TEXT,
  capacity INTEGER,
  description TEXT,
  created_by UUID REFERENCES public.admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create event_attendees table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS public.event_attendees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(event_id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(member_id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, member_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS public.messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  sent_by UUID REFERENCES public.admin_users(id),
  recipient_filter JSONB,
  sent_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for admin_users
CREATE POLICY "Admin users can view all admins"
  ON public.admin_users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Super Admin can manage admins"
  ON public.admin_users FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'Super Admin'
    )
  );

-- RLS Policies for members (all admin roles can view)
CREATE POLICY "Admins can view all members"
  ON public.members FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admin and Super Admin can insert members"
  ON public.members FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')
    )
  );

CREATE POLICY "Admin and Super Admin can update members"
  ON public.members FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')
    )
  );

CREATE POLICY "Super Admin can delete members"
  ON public.members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role = 'Super Admin'
    )
  );

-- RLS Policies for events
CREATE POLICY "Admins can view all events"
  ON public.events FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admin and Super Admin can manage events"
  ON public.events FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')
    )
  );

-- RLS Policies for event_attendees
CREATE POLICY "Admins can view event attendees"
  ON public.event_attendees FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admin and Super Admin can manage attendees"
  ON public.event_attendees FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')
    )
  );

-- RLS Policies for messages
CREATE POLICY "Admins can view messages"
  ON public.messages FOR SELECT
  USING (auth.uid() IN (SELECT id FROM public.admin_users));

CREATE POLICY "Admin and Super Admin can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE id = auth.uid() AND role IN ('Admin', 'Super Admin')
    )
  );

-- Create function to update events_attended count
CREATE OR REPLACE FUNCTION update_events_attended()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.attended = TRUE AND (OLD IS NULL OR OLD.attended = FALSE) THEN
    UPDATE public.members
    SET events_attended = events_attended + 1
    WHERE member_id = NEW.member_id;
  ELSIF NEW.attended = FALSE AND OLD.attended = TRUE THEN
    UPDATE public.members
    SET events_attended = GREATEST(events_attended - 1, 0)
    WHERE member_id = NEW.member_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for events_attended
DROP TRIGGER IF EXISTS update_events_attended_trigger ON public.event_attendees;
CREATE TRIGGER update_events_attended_trigger
AFTER INSERT OR UPDATE OF attended ON public.event_attendees
FOR EACH ROW
EXECUTE FUNCTION update_events_attended();

-- Create function to auto-create admin_user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_admin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.admin_users (id, email, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'role', 'Read-only')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_admin();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers to all tables
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON public.admin_users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
