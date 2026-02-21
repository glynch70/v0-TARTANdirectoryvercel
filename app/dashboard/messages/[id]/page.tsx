import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Mail, User, Calendar } from "lucide-react"
import Link from "next/link"

export default function MessageDetailPage({ params }: { params: { id: string } }) {
  const message = {
    message_id: params.id,
    subject: "Demo Message",
    body: "This is a demo message. Please run SQL scripts to load real messages.",
    sent_at: new Date().toISOString(),
    admin_users: { email: "admin@example.com" },
    recipient_filter: { type: "all", count: 0 },
  }

  const recipientFilter = message.recipient_filter as any

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Button variant="outline" asChild>
          <Link href="/dashboard/messages">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Messages
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Mail className="h-6 w-6 text-blue-600" />
            <CardTitle className="text-2xl">{message.subject}</CardTitle>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>From: {message.admin_users?.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Sent: {new Date(message.sent_at).toLocaleString()}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Recipients</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>
                {recipientFilter?.count || 0} recipient{recipientFilter?.count !== 1 ? "s" : ""}
              </Badge>
              <Badge variant="outline">
                Filter: {recipientFilter?.type === "all" ? "All Members" : recipientFilter?.type}
              </Badge>
              {recipientFilter?.value && <Badge variant="outline">Value: {recipientFilter.value}</Badge>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Message</h3>
            <div className="bg-gray-50 p-6 rounded-lg">
              <p className="whitespace-pre-wrap text-gray-800">{message.body}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
