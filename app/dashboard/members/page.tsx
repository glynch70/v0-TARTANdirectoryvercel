import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Upload, Download } from "lucide-react"
import { MembersTable } from "./members-table"

export default function MembersPage() {
  const members: any[] = []
  const canEdit = true

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Members</h1>
          <p className="mt-2 text-gray-600">Manage your Tartan Talks member directory</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/members/export">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Link>
          </Button>
          {canEdit && (
            <>
              <Button variant="outline" asChild>
                <Link href="/dashboard/members/import">
                  <Upload className="h-4 w-4 mr-2" />
                  Import CSV
                </Link>
              </Button>
              <Button asChild>
                <Link href="/dashboard/members/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Member
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>

      <MembersTable initialMembers={members || []} canEdit={canEdit} />
    </div>
  )
}
