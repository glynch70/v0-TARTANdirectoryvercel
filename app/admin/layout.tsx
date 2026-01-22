import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect("/login")
    }

    // Check if user is in the admin_users table
    const { data: adminUser } = await supabase
        .from("admin_users")
        .select("role")
        .eq("email", user.email)
        .single()

    if (!adminUser) {
        redirect("/dashboard")
    }

    return <>{children}</>
}
