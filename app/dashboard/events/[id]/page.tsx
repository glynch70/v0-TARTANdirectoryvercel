import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { AttendeeManager } from "./attendee-manager"
import { notFound } from "next/navigation"

export default async function EventDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_id', params.id)
    .single()

  if (error || !event) {
    notFound()
  }

  // Fetch attendees count (or mock strictly for now if AttendeeManager handles the rest)
  // For this page, we might want to know if the CURRENT user is attending, or just the list.
  // The AttendeeManager likely handles the list. 
  // Let's get the raw count for the card.
  const { count: attendeeCount } = await supabase
    .from('event_rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', params.id)

  const attendees: any[] = [] // Placeholder: AttendeeManager should eventually fetch real attendees
  const allMembers: any[] = [] // Placeholder
  const canEdit = true // For now allow edit
  const isPastEvent = new Date(event.event_date) < new Date()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/events">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Events
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{event.event_name}</h1>
            <Badge variant={isPastEvent ? "secondary" : "default"} className="mt-2">
              {isPastEvent ? "Past Event" : "Upcoming Event"}
            </Badge>
          </div>
        </div>
        {canEdit && (
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white">
            <Link href={`/dashboard/events/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-semibold dark:text-gray-200">
                {new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                <span className="block text-sm font-normal text-gray-500 mt-1">
                  {new Date(event.event_date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-semibold dark:text-gray-200">{event.location || "TBD"}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-semibold dark:text-gray-200">
                {attendeeCount || 0}
                {event.capacity ? ` / ${event.capacity}` : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {event.description && (
        <Card className="dark:bg-slate-800 dark:border-slate-700">
          <CardHeader>
            <CardTitle className="dark:text-gray-100">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{event.description}</p>
          </CardContent>
        </Card>
      )}

      {/* 
        Note: AttendeeManager is skipped for this iteration as it likely needs
        its own data fetching logic update. For now, we display the event details clearly.
      */}
    </div>
  )
}
