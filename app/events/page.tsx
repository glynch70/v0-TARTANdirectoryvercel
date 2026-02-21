"use client"

import { useEffect, useState } from "react"
// MOCK DATA FOR BUILD - TODO: Replace with Supabase
interface Event {
  id: string
  title: string
  date: string
  location: string
  description?: string
  attendeeIds: string[]
}

interface Member {
  id: string
  firstName: string
  lastName: string
  company: string
  trade: string
  email: string
  phone: string
  website: string
  joinedDate: string
}

const getEvents = (): Event[] => []
const getMembers = (): Member[] => []
import { Calendar, MapPin, Users, Plus } from "lucide-react"
import Link from "next/link"

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    setEvents(getEvents())
    setMembers(getMembers())
  }, [])

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const pastEvents = events
    .filter((e) => new Date(e.date) < new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground">Events</h1>
          <p className="text-lg text-muted-foreground mt-2">{events.length} total events</p>
        </div>
        <Link
          href="/events/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Create Event
        </Link>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">Upcoming</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bento-card group hover:scale-[1.02] transition-all bg-gradient-to-br from-blue-50 to-purple-50"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                    <p className="font-semibold text-foreground">
                      {new Date(event.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{event.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.attendeeIds.length} attending</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-bold text-foreground">Past Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pastEvents.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="bento-card group hover:scale-[1.02] transition-all opacity-75"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gray-200 flex items-center justify-center text-gray-600">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                      })}
                    </p>
                  </div>
                </div>
                <h3 className="font-display text-xl font-bold text-foreground mb-2">{event.title}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{event.attendeeIds.length} attended</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <div className="bento-card-lg text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-2xl font-bold text-foreground mb-2">No events yet</h3>
          <p className="text-muted-foreground mb-6">Create your first event to get started</p>
          <Link
            href="/events/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Event
          </Link>
        </div>
      )}
    </div>
  )
}
