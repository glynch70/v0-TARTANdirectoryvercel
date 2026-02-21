import { MessageForm } from "../message-form"

export default function NewMessagePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Send Message</h1>
        <p className="mt-2 text-gray-600">Compose and send an email to selected members</p>
      </div>

      <MessageForm userId="demo-user" members={[]} />
    </div>
  )
}
