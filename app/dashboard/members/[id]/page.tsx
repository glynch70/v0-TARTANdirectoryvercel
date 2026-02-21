import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Globe, Calendar, Tag, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function MemberProfilePage({ params }: { params: { id: string } }) {
  const member = {
    member_id: params.id,
    first_name: "Demo",
    last_name: "Member",
    company: "Demo Company",
    email: "demo@example.com",
    phone: "07123456789",
    website: "www.example.com",
    status: "Active",
    member_since: "January 2025",
    join_date: new Date().toISOString(),
    events_attended: 0,
    role: "Demo Role",
    location: "Demo Location",
    notes: "This is demo data. Please run SQL scripts to load real members.",
    tags: [],
  }

  const canEdit = true

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" asChild>
            <Link href="/dashboard/members">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Members
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {member.first_name} {member.last_name}
            </h1>
            <p className="text-gray-600">{member.company}</p>
          </div>
        </div>
        {canEdit && (
          <Button asChild>
            <Link href={`/dashboard/members/${params.id}/edit`}>Edit Member</Link>
          </Button>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {member.email && (
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <a href={`mailto:${member.email}`} className="text-blue-600 hover:underline">
                  {member.email}
                </a>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <a href={`tel:${member.phone}`} className="text-blue-600 hover:underline">
                  {member.phone}
                </a>
              </div>
            )}
            {member.website && (
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-gray-400" />
                <a
                  href={member.website.startsWith("http") ? member.website : `https://${member.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {member.website}
                </a>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Membership Details */}
        <Card>
          <CardHeader>
            <CardTitle>Membership Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status</span>
              <Badge variant={member.status === "Active" ? "default" : "secondary"}>{member.status}</Badge>
            </div>
            {member.member_since && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">{member.member_since}</span>
              </div>
            )}
            {member.join_date && (
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-gray-400" />
                <span className="text-gray-600">Joined: {new Date(member.join_date).toLocaleDateString()}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Events Attended</span>
              <span className="font-bold text-lg">{member.events_attended}</span>
            </div>
          </CardContent>
        </Card>

        {/* Business Information */}
        <Card>
          <CardHeader>
            <CardTitle>Business Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Company</p>
              <p className="font-medium">{member.company || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Role/Trade</p>
              <p className="font-medium">{member.role || "-"}</p>
            </div>
            {member.location && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="font-medium">{member.location}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin Notes */}
        {(member.notes || member.tags) && (
          <Card>
            <CardHeader>
              <CardTitle>Admin Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {member.tags && member.tags.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {member.tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {member.notes && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Notes</span>
                  </div>
                  <p className="text-sm whitespace-pre-wrap">{member.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
