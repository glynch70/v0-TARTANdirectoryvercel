export type Database = {
  public: {
    Tables: {
      admin_users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          role: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string
        }
      }
      members: {
        Row: {
          member_id: string
          first_name: string
          last_name: string
          email: string | null
          phone: string | null
          company: string | null
          role: string | null
          location: string | null
          membership_type: string | null
          status: string
          join_date: string | null
          renewal_date: string | null
          events_attended: number
          tags: string[] | null
          notes: string | null
          website: string | null
          member_since: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          member_id?: string
          first_name: string
          last_name: string
          email?: string | null
          phone?: string | null
          company?: string | null
          role?: string | null
          location?: string | null
          membership_type?: string | null
          status?: string
          join_date?: string | null
          renewal_date?: string | null
          events_attended?: number
          tags?: string[] | null
          notes?: string | null
          website?: string | null
          member_since?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          member_id?: string
          first_name?: string
          last_name?: string
          email?: string | null
          phone?: string | null
          company?: string | null
          role?: string | null
          location?: string | null
          membership_type?: string | null
          status?: string
          join_date?: string | null
          renewal_date?: string | null
          events_attended?: number
          tags?: string[] | null
          notes?: string | null
          website?: string | null
          member_since?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          event_id: string
          event_name: string
          event_date: string
          location: string | null
          capacity: number | null
          description: string | null
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          event_id?: string
          event_name: string
          event_date: string
          location?: string | null
          capacity?: number | null
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          event_id?: string
          event_name?: string
          event_date?: string
          location?: string | null
          capacity?: number | null
          description?: string | null
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      event_attendees: {
        Row: {
          id: string
          event_id: string
          member_id: string
          attended: boolean
          created_at: string
        }
        Insert: {
          id?: string
          event_id: string
          member_id: string
          attended?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          member_id?: string
          attended?: boolean
          created_at?: string
        }
      }
      messages: {
        Row: {
          message_id: string
          subject: string
          body: string
          sent_by: string | null
          recipient_filter: any
          sent_at: string
          created_at: string
        }
        Insert: {
          message_id?: string
          subject: string
          body: string
          sent_by?: string | null
          recipient_filter?: any
          sent_at?: string
          created_at?: string
        }
        Update: {
          message_id?: string
          subject?: string
          body?: string
          sent_by?: string | null
          recipient_filter?: any
          sent_at?: string
          created_at?: string
        }
      }
    }
  }
}
