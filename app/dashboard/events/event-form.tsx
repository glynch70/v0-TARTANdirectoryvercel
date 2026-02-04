"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Upload, X } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface EventFormProps {
  event?: any // Using any for now to bypass strict typing if database types aren't fully sync'd
  userId: string
}

export function EventForm({ event, userId }: EventFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    event_name: event?.event_name || "",
    event_date: event?.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : "", // Format for datetime-local
    location: event?.location || "",
    capacity: event?.capacity?.toString() || "",
    description: event?.description || "",
    image_url: event?.image_url || "",
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error('You must select an image to upload.')
      }

      const file = e.target.files[0]
      const fileExt = file.name.split('.').pop()
      const filePath = `${Math.random()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('event-images')
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data } = supabase.storage
        .from('event-images')
        .getPublicUrl(filePath)

      setFormData({ ...formData, image_url: data.publicUrl })
      toast.success('Image uploaded successfully')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const eventData = {
        event_name: formData.event_name,
        event_date: new Date(formData.event_date).toISOString(),
        location: formData.location,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        description: formData.description,
        image_url: formData.image_url,
        created_by: userId
      }

      const { error } = event
        ? await supabase
          .from('events')
          .update(eventData)
          .eq('event_id', event.event_id)
        : await supabase
          .from('events')
          .insert([eventData])

      if (error) throw error

      toast.success(event ? "Event updated!" : "Event created!")
      router.push("/dashboard/events")
      router.refresh()
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to save event")
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

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Event Image</Label>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-slate-200">
                    <Image
                      src={formData.image_url}
                      alt="Event preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image_url: "" })}
                      className="absolute top-1 right-1 bg-black/50 hover:bg-black/70 text-white rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <div className="flex-1">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                  {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="event_date">Date & Time *</Label>
                <Input
                  id="event_date"
                  type="datetime-local"
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
              <Select
                value={formData.location}
                onValueChange={(value) => setFormData({ ...formData, location: value })}
              >
                <SelectTrigger id="location">
                  <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Edinburgh">Edinburgh</SelectItem>
                  <SelectItem value="Glasgow">Glasgow</SelectItem>
                </SelectContent>
              </Select>
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
          <Button type="submit" disabled={isLoading || uploading} className="bg-orange-500 hover:bg-orange-600 text-white">
            {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
          </Button>
          <Button variant="outline" asChild type="button">
            <Link href="/dashboard/events">Cancel</Link>
          </Button>
        </div>
      </div>
    </form>
  )
}

