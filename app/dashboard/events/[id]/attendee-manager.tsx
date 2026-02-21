"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { UserPlus } from "lucide-react"
import type { Database } from "@/lib/database.types"

type Member = Database["public"]["Tables"]["members"]["Row"]
type EventAttendee = Database["public"]["Tables"]["event_attendees"]["Row"] & {
  members: Member
}

interface AttendeeManagerProps {
  eventId: string
  attendees: EventAttendee[]
  allMembers: Member[]
  canEdit: boolean
}

export function AttendeeManager({ eventId, attendees, allMembers, canEdit }: AttendeeManagerProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const attendeeIds = new Set(attendees.map((a) => a.member_id))
  const availableMembers = allMembers.filter((m) => !attendeeIds.has(m.member_id))

  const filteredMembers = availableMembers.filter(
    (m) =>
      m.first_name.toLowerCase().includes(search.toLowerCase()) ||
      m.last_name.toLowerCase().includes(search.toLowerCase()) ||
      m.company?.toLowerCase().includes(search.toLowerCase()),
  )

  const handleAddAttendee = async (memberId: string) => {
    setIsUpdating(memberId)
    alert("Database operations disabled. Please run SQL scripts to set up the database.")
    setIsUpdating(null)
  }

  const handleToggleAttendance = async (attendeeId: string, currentStatus: boolean) => {
    setIsUpdating(attendeeId)
    alert("Database operations disabled. Please run SQL scripts to set up the database.")
    setIsUpdating(null)
  }

  const handleRemoveAttendee = async (attendeeId: string) => {
    setIsUpdating(attendeeId)
    alert("Database operations disabled. Please run SQL scripts to set up the database.")
    setIsUpdating(null)
  }

  const attendedCount = attendees.filter((a) => a.attended).length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Attendees</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              {attendedCount} of {attendees.length} marked as attended
            </p>
          </div>
          {canEdit && (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Attendee
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[600px] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add Attendees</DialogTitle>
                  <DialogDescription>Select members to add to this event</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Search members..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mb-4"
                  />
                  <div className="space-y-2">
                    {filteredMembers.length === 0 ? (
                      <p className="text-center text-gray-500 py-4">
                        {availableMembers.length === 0 ? "All members are already added" : "No members found"}
                      </p>
                    ) : (
                      filteredMembers.map((member) => (
                        <div
                          key={member.member_id}
                          className="flex items-center justify-between p-3 border rounded hover:bg-gray-50"
                        >
                          <div>
                            <p className="font-medium">
                              {member.first_name} {member.last_name}
                            </p>
                            <p className="text-sm text-gray-600">{member.company}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={() => handleAddAttendee(member.member_id)}
                            disabled={isUpdating === member.member_id}
                          >
                            {isUpdating === member.member_id ? "Adding..." : "Add"}
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {attendees.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No attendees yet</p>
        ) : (
          <div className="space-y-2">
            {attendees.map((attendee) => (
              <div key={attendee.id} className="flex items-center justify-between p-3 border rounded">
                <div className="flex items-center gap-3">
                  {canEdit ? (
                    <Checkbox
                      checked={attendee.attended}
                      onCheckedChange={() => handleToggleAttendance(attendee.id, attendee.attended)}
                      disabled={isUpdating === attendee.id}
                    />
                  ) : (
                    <Checkbox checked={attendee.attended} disabled />
                  )}
                  <div>
                    <p className="font-medium">
                      {attendee.members.first_name} {attendee.members.last_name}
                    </p>
                    <p className="text-sm text-gray-600">{attendee.members.company}</p>
                  </div>
                </div>
                {canEdit && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemoveAttendee(attendee.id)}
                    disabled={isUpdating === attendee.id}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
