"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getEvents, getMembers, saveEvent, deleteEvent } from "@/lib/storage"
import type { Event, Member } from "@/lib/storage"
import { Calendar, MapPin, Users, ArrowLeft, Trash2, UserPlus } from "lucide-react"
import Link from "next/link"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [members, setMembers] = useState<Member[]>([])
  const [showAddAttendee, setShowAddAttendee] = useState(false)

  useEffect(() => {
    const events = getEvents()
    const foundEvent = events.find((e) => e.id === params.id)
    setEvent(foundEvent || null)
    setMembers(getMembers())
  }, [params.id])

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this event?")) {
      deleteEvent(params.id as string)
      router.push("/events")
    }
  }

  const handleAddAttendee = (memberId: string) => {
    if (!event) return

    const updatedEvent = {
      ...event,
      attendeeIds: [...event.attendeeIds, memberId],
    }
    saveEvent(updatedEvent)
    setEvent(updatedEvent)
    setShowAddAttendee(false)
  }

  const handleRemoveAttendee = (memberId: string) => {
    if (!event) return

    const updatedEvent = {
      ...event,
      attendeeIds: event.attendeeIds.filter((id) => id !== memberId),
    }
    saveEvent(updatedEvent)
    setEvent(updatedEvent)
  }

  if (!event) {
    return (
      <div className="bento-card-lg text-center py-16">
        <p className="text-xl text-muted-foreground">Event not found</p>
      </div>
    )
  }

  const attendees = members.filter((m) => event.attendeeIds.includes(m.id))
  const availableMembers = members.filter((m) => !event.attendeeIds.includes(m.id))

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/events" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div className="flex-1">
          <h1 className="font-display text-4xl font-bold text-foreground">{event.title}</h1>
        </div>
        <button onClick={handleDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="bento-card-lg space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white">
            <Calendar className="w-8 h-8" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">
              {new Date(event.date).toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
            <p className="text-lg text-muted-foreground">
              {new Date(event.date).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 text-muted-foreground">
            <MapPin className="w-5 h-5" />
            <span className="text-lg">{event.location}</span>
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <Users className="w-5 h-5" />
            <span className="text-lg">{event.attendeeIds.length} attending</span>
          </div>
        </div>

        {event.description && (
          <div className="pt-4 border-t">
            <h3 className="font-semibold text-foreground mb-2">Description</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>
        )}
      </div>

      {/* Attendees */}
      <div className="bento-card-lg space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-foreground">Attendees</h2>
          <button
            onClick={() => setShowAddAttendee(!showAddAttendee)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors text-sm"
          >
            <UserPlus className="w-4 h-4" />
            Add Attendee
          </button>
        </div>

        {showAddAttendee && (
          <div className="p-4 bg-muted/50 rounded-xl space-y-2 max-h-64 overflow-y-auto">
            {availableMembers.map((member) => (
              <button
                key={member.id}
                onClick={() => handleAddAttendee(member.id)}
                className="w-full flex items-center gap-3 p-3 bg-card hover:bg-muted rounded-lg transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </div>
                <div className="flex-1">
                  <p className="font-medium">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.company}</p>
                </div>
              </button>
            ))}
            {availableMembers.length === 0 && (
              <p className="text-center text-sm text-muted-foreground py-4">All members added</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          {attendees.map((member) => (
            <div key={member.id} className="flex items-center gap-3 p-4 bg-muted/30 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                {member.firstName[0]}
                {member.lastName[0]}
              </div>
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-sm text-muted-foreground">{member.company}</p>
              </div>
              <button
                onClick={() => handleRemoveAttendee(member.id)}
                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
          {attendees.length === 0 && <p className="text-center text-muted-foreground py-8">No attendees yet</p>}
        </div>
      </div>
    </div>
  )
}
