import { ImportForm } from "./import-form"

export default function ImportMembersPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Import Members</h1>
        <p className="mt-2 text-gray-600">Bulk import members from a CSV file</p>
      </div>

      <ImportForm />
    </div>
  )
}
