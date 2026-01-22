"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
// MOCK DATA FOR BUILD - TODO: Replace with Supabase
const generateId = () => Math.random().toString(36).substr(2, 9)
const saveEvent = (event: any) => { }
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewEventPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const event = {
      id: generateId(),
      ...formData,
      attendeeIds: [],
    }

    saveEvent(event)
    router.push("/events")
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/events" className="p-2 hover:bg-muted rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="font-display text-4xl font-bold text-foreground">Create Event</h1>
          <p className="text-lg text-muted-foreground mt-2">Schedule a new community event</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bento-card-lg space-y-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Event Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Monthly Networking Mixer"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Date & Time</label>
          <input
            type="datetime-local"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Location</label>
          <input
            type="text"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="The Tartan Pub, Edinburgh"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            placeholder="Join us for an evening of networking and community building..."
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            className="flex-1 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors"
          >
            Create Event
          </button>
          <Link
            href="/events"
            className="px-6 py-3 bg-muted text-foreground rounded-xl font-medium hover:bg-muted/80 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
