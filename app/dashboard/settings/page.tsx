import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function SettingsPage() {
  // const supabase = await createClient()

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser()

  // if (!user) {
  //   redirect("/auth/login")
  // }

  // const { data: adminUser } = await supabase.from("admin_users").select("*").eq("id", user.id).single()

  const adminUser = {
    email: "admin@tartantalks.co.uk",
    role: "Super Admin",
    created_at: new Date().toISOString(),
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Your admin account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Email</p>
            <p className="font-medium">{adminUser.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Role</p>
            <Badge>{adminUser.role}</Badge>
          </div>
          <div>
            <p className="text-sm text-gray-600">Account Created</p>
            <p className="font-medium">{new Date(adminUser.created_at).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Permissions</CardTitle>
          <CardDescription>What you can do with your {adminUser.role} role</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span>Full access to all features</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span>Create, edit, and delete members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span>Manage events and attendance</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span>Send messages to members</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-green-500 rounded-full" />
              <span>Manage admin users</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
