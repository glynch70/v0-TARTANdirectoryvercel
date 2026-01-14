import { EventForm } from "../../event-form"

export default function EditEventPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Event</h1>
        <p className="mt-2 text-gray-600">Update event details</p>
      </div>

      <EventForm userId="demo-user" />
    </div>
  )
}
