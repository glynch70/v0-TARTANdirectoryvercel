import { MemberForm } from "../member-form"

export default function NewMemberPage() {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Add New Member</h1>
        <p className="mt-2 text-gray-600">Create a new member profile</p>
      </div>

      <MemberForm />
    </div>
  )
}
