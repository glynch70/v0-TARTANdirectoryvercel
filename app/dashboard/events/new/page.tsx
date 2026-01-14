import { EventForm } from "../event-form"

export default function NewEventPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Create Event</h1>
        <p className="mt-2 text-gray-600">Schedule a new Tartan Talks event</p>
      </div>

      <EventForm userId="demo-user" />
    </div>
  )
}
