import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Calendar, MapPin, Users } from "lucide-react"

export default function EventsPage() {
  const events: any[] = []
  const canEdit = true

  const today = new Date().toISOString().split("T")[0]
  const upcomingEvents = events?.filter((e) => e.event_date >= today) || []
  const pastEvents = events?.filter((e) => e.event_date < today) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Events</h1>
          <p className="mt-2 text-gray-600">Manage Tartan Talks events and attendance</p>
        </div>
        {canEdit && (
          <Button asChild>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                No upcoming events scheduled. Run SQL scripts to load events or create your first event to get started.
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {upcomingEvents.map((event) => (
                <Link key={event.event_id} href={`/dashboard/events/${event.event_id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{event.event_name}</CardTitle>
                        <Badge>Upcoming</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>
                          {event.event_attendees[0]?.count || 0}
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Past Events</h2>
          {pastEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">No past events</CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {pastEvents.map((event) => (
                <Link key={event.event_id} href={`/dashboard/events/${event.event_id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-xl">{event.event_name}</CardTitle>
                        <Badge variant="secondary">Past</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Users className="h-4 w-4" />
                        <span>{event.event_attendees[0]?.count || 0} attendees</span>
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
