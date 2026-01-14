import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Mail } from "lucide-react"

export default function MessagesPage() {
  const messages: any[] = []
  const canSend = true

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <p className="mt-2 text-gray-600">Send emails to members and view message history</p>
        </div>
        {canSend && (
          <Button asChild>
            <Link href="/dashboard/messages/new">
              <Plus className="h-4 w-4 mr-2" />
              New Message
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Message History</CardTitle>
        </CardHeader>
        <CardContent>
          {!messages || messages.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No messages sent yet. Run SQL scripts to load data or click "New Message" to send your first message.
            </p>
          ) : (
            <div className="space-y-3">
              {messages.map((message) => (
                <Link key={message.message_id} href={`/dashboard/messages/${message.message_id}`}>
                  <div className="flex items-start gap-4 p-4 border rounded hover:bg-gray-50 cursor-pointer">
                    <div className="p-2 bg-blue-100 rounded">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{message.subject}</h3>
                      <p className="text-sm text-gray-600 truncate">{message.body.substring(0, 100)}...</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>Sent by: {message.admin_users?.email}</span>
                        <span>{new Date(message.sent_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
