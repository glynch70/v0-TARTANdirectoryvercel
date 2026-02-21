"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"
import type { Database } from "@/lib/database.types"

type Member = Database["public"]["Tables"]["members"]["Row"]

interface MessageFormProps {
  userId: string
  members: Member[]
}

export function MessageForm({ userId, members }: MessageFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterValue, setFilterValue] = useState<string>("")
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())

  // Get unique values for filters
  const statuses = Array.from(new Set(members.map((m) => m.status)))
  const locations = Array.from(new Set(members.map((m) => m.location).filter(Boolean)))

  // Filter members based on selection
  const getFilteredMembers = () => {
    if (filterType === "all") return members

    switch (filterType) {
      case "status":
        return members.filter((m) => m.status === filterValue)
      case "location":
        return members.filter((m) => m.location === filterValue)
      case "custom":
        return members.filter((m) => selectedMembers.has(m.member_id))
      default:
        return members
    }
  }

  const filteredMembers = getFilteredMembers()
  const recipientCount = filteredMembers.filter((m) => m.email).length

  const toggleMember = (memberId: string) => {
    const newSelected = new Set(selectedMembers)
    if (newSelected.has(memberId)) {
      newSelected.delete(memberId)
    } else {
      newSelected.add(memberId)
    }
    setSelectedMembers(newSelected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      alert("Database operations disabled. Please run SQL scripts to set up the database.")
      router.push("/dashboard/messages")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-6">
        <div className="flex gap-2">
          <Button variant="outline" asChild type="button">
            <Link href="/dashboard/messages">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Cancel
            </Link>
          </Button>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}

        <Card>
          <CardHeader>
            <CardTitle>Filter Recipients</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="filterType">Filter By</Label>
              <Select
                value={filterType}
                onValueChange={(value) => {
                  setFilterType(value)
                  setFilterValue("")
                  setSelectedMembers(new Set())
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Members</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="location">Location</SelectItem>
                  <SelectItem value="custom">Custom Selection</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {filterType === "status" && (
              <div>
                <Label htmlFor="status">Select Status</Label>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose status" />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === "location" && (
              <div>
                <Label htmlFor="location">Select Location</Label>
                <Select value={filterValue} onValueChange={setFilterValue}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location!}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filterType === "custom" && (
              <div className="max-h-64 overflow-y-auto border rounded p-4 space-y-2">
                {members.map((member) => (
                  <div key={member.member_id} className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedMembers.has(member.member_id)}
                      onCheckedChange={() => toggleMember(member.member_id)}
                    />
                    <span>
                      {member.first_name} {member.last_name} - {member.company}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {recipientCount} recipient{recipientCount !== 1 ? "s" : ""} with email addresses
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Message Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="subject">Subject *</Label>
              <Input
                id="subject"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div>
              <Label htmlFor="body">Message *</Label>
              <Textarea
                id="body"
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                placeholder="Compose your message here..."
              />
            </div>
          </CardContent>
        </Card>

        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> This is a demonstration version. In production, this would integrate with an email
            service (e.g., SendGrid, Mailgun) to actually send emails to the selected recipients.
          </p>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isLoading || recipientCount === 0}>
            <Mail className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : `Send to ${recipientCount} Member${recipientCount !== 1 ? "s" : ""}`}
          </Button>
          <Button variant="outline" asChild type="button">
            <Link href="/dashboard/messages">Cancel</Link>
          </Button>
        </div>
      </div>
    </form>
  )
}
