import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, Calendar, Mail, Settings, LayoutDashboard } from "lucide-react"

import { createClient } from "@/lib/supabase/server"
import { ShieldAlert } from "lucide-react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // Check if user is admin
  let isAdmin = false
  if (user) {
    const { data } = await supabase
      .from('admin_users')
      .select('role')
      .eq('email', user.email)
      .single()
    if (data) isAdmin = true
  }

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/trades", icon: Users }, // Redirect Members to /trades for better view
    { name: "Events", href: "/dashboard/events", icon: Calendar },
    { name: "Messages", href: "/dashboard/messages", icon: Mail },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 hidden md:block">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-slate-800">
            <Link href="/dashboard" className="block">
              <Image
                src="/images/tartan-talks-logo.png"
                alt="Tartan Talks"
                width={200}
                height={100}
                className="w-full h-auto"
                priority
              />
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-slate-300 rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* Admin Link (Only for Admins) */}
          {isAdmin && (
            <div className="p-4 border-t border-slate-800">
              <Link
                href="/admin"
                className="flex items-center gap-3 px-4 py-3 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors shadow-sm"
              >
                <ShieldAlert className="h-5 w-5" />
                <span className="font-medium">Admin Panel</span>
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
