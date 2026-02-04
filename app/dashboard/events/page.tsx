"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Calendar, MapPin, Users, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Event {
  event_id: string
  event_name: string
  event_date: string
  location: string | null
  capacity: number | null
  // We'll fetch attendee count manually or via a joined view, 
  // but for now let's use the rsvps table count
  attendee_count?: number
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const canEdit = true // Assuming all verified members can create events for now, or restrictive to admin

  const supabase = createClient()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: eventsData, error } = await supabase
          .from('events')
          .select('*')
          .order('event_date', { ascending: true })

        if (error) throw error

        if (eventsData) {
          // Fetch attendee counts for each event
          // Note: In a larger app, we'd use a view or a dedicated RPC, or .select('*, event_rsvps(count)')
          // But Supabase simple join count is .select('*, event_rsvps(count)')
          const eventsWithCounts = await Promise.all(eventsData.map(async (event) => {
            const { count } = await supabase
              .from('event_rsvps')
              .select('*', { count: 'exact', head: true })
              .eq('event_id', event.event_id)
            return {
              ...event,
              attendee_count: count || 0
            }
          }))
          setEvents(eventsWithCounts)
        }
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [supabase])

  const today = new Date().toISOString().split("T")[0]
  const upcomingEvents = events.filter((e) => e.event_date >= today)
  const pastEvents = events.filter((e) => e.event_date < today)

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Events</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Manage Tartan Talks events and attendance</p>
        </div>
        {canEdit && (
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link href="/dashboard/events/new">
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Link>
          </Button>
        )}
      </div>

      <div className="space-y-8">
        {/* Upcoming Events */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <Card className="bg-slate-50 dark:bg-slate-800/50 border-dashed">
              <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">
                No upcoming events scheduled. Create your first event to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <Link key={event.event_id} href={`/dashboard/events/${event.event_id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl dark:text-white">{event.event_name}</CardTitle>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400">Upcoming</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.attendee_count}
                          {event.capacity ? ` / ${event.capacity}` : ""} attendees
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Past Events */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Past Events</h2>
          {pastEvents.length === 0 ? (
            <Card className="bg-slate-50 dark:bg-slate-800/50 border-dashed">
              <CardContent className="py-12 text-center text-gray-500 dark:text-gray-400">No past events</CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pastEvents.map((event) => (
                <Link key={event.event_id} href={`/dashboard/events/${event.event_id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75 dark:bg-slate-800 dark:border-slate-700">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl dark:text-white">{event.event_name}</CardTitle>
                        <Badge variant="secondary">Past</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Users className="h-4 w-4" />
                        <span>{event.attendee_count} attendees</span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
