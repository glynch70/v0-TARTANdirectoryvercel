"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/lib/database.types"

type Event = Database["public"]["Tables"]["events"]["Row"]

interface EventFormProps {
  event?: Event
  userId: string
}

export function EventForm({ event, userId }: EventFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    event_name: event?.event_name || "",
    event_date: event?.event_date || "",
    location: event?.location || "",
    capacity: event?.capacity?.toString() || "",
    description: event?.description || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      alert("Database operations disabled. Please run SQL scripts to set up the database.")
      if (event) {
        router.push(`/dashboard/events/${event.event_id}`)
      } else {
        router.push("/dashboard/events")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button variant="outline" asChild type="button">
            <Link href={event ? `/dashboard/events/${event.event_id}` : "/dashboard/events"}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </Button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="event_name">Event Name *</Label>
              <Input
                id="event_name"
                required
                value={formData.event_name}
                onChange={(e) => setFormData({ ...formData, event_name: e.target.value })}
                placeholder="e.g., Monthly Networking Meeting"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_date">Date *</Label>
                <Input
                  id="event_date"
                  type="date"
                  required
                  value={formData.event_date}
                  onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  placeholder="Optional"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Ravelston House Hotel"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Event details and agenda..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
          </Button>
          <Button variant="outline" asChild type="button">
            <Link href={event ? `/dashboard/events/${event.event_id}` : "/dashboard/events"}>Cancel</Link>
          </Button>
        </div>
      </div>
    </form>
  )
}
