import { NextResponse } from "next/server"

export async function GET() {
  const members: any[] = []

  // Convert to CSV
  const headers = [
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Company",
    "Role/Trade",
    "Location",
    "Status",
    "Member Since",
    "Website",
    "Join Date",
    "Events Attended",
  ]

  const csvRows = [
    headers.join(","),
    ...members.map((member) =>
      [
        member.first_name,
        member.last_name,
        member.email || "",
        member.phone || "",
        member.company || "",
        member.role || "",
        member.location || "",
        member.status,
        member.member_since || "",
        member.website || "",
        member.join_date || "",
        member.events_attended,
      ]
        .map((field) => `"${String(field).replace(/"/g, '""')}"`)
        .join(","),
    ),
  ]

  const csv = csvRows.join("\n")

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="tartan-talks-members-${new Date().toISOString().split("T")[0]}.csv"`,
    },
  })
}
