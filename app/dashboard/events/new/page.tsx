import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { EventForm } from "../event-form"

export default async function NewEventPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Create Event</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Schedule a new Tartan Talks event</p>
      </div>

      <EventForm userId={user.id} />
    </div>
  )
}
