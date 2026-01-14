import { MemberForm } from "../../member-form"

export default function EditMemberPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Edit Member</h1>
        <p className="mt-2 text-gray-600">Update member profile</p>
      </div>

      <MemberForm />
    </div>
  )
}
