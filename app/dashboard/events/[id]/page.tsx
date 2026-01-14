import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, ArrowLeft, Edit } from "lucide-react"
import Link from "next/link"
import { AttendeeManager } from "./attendee-manager"

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = {
    event_id: params.id,
    event_name: "Demo Event",
    event_date: new Date().toISOString(),
    location: "Demo Location",
    capacity: 50,
    description: "This is a demo event. Please run SQL scripts to load real data.",
  }

  const attendees: any[] = []
  const allMembers: any[] = []
  const canEdit = true
  const isPastEvent = false

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
            <h1 className="text-3xl font-bold text-gray-900">{event.event_name}</h1>
            <Badge variant={isPastEvent ? "secondary" : "default"} className="mt-2">
              {isPastEvent ? "Past Event" : "Upcoming Event"}
            </Badge>
          </div>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href={`/dashboard/events/${params.id}/edit`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Event
            </Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-semibold">{new Date(event.event_date).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-semibold">{event.location || "TBD"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-600">Attendees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-400" />
              <span className="text-lg font-semibold">
                {attendees?.length || 0}
                {event.capacity ? ` / ${event.capacity}` : ""}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {event.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap text-gray-700">{event.description}</p>
          </CardContent>
        </Card>
      )}

      <AttendeeManager
        eventId={params.id}
        attendees={attendees || []}
        allMembers={allMembers || []}
        canEdit={canEdit}
      />
    </div>
  )
}
