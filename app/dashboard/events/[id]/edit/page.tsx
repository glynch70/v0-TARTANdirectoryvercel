import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { EventForm } from "../../event-form"

export default async function EditEventPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('event_id', params.id)
    .single()

  if (error || !event) notFound()

  // Verify ownership (optional but recommended)
  if (event.created_by !== user.id) {
    // For now, depending on requirements, might want to restrict editing to creator
    // redirect("/dashboard/events") 
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Edit Event</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Update event details</p>
      </div>

      <EventForm userId={user.id} event={event} />
    </div>
  )
}
