import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Users, Calendar, Mail, Settings, LayoutDashboard } from "lucide-react"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Events", href: "/dashboard/events", icon: Calendar },
    { name: "Messages", href: "/dashboard/messages", icon: Mail },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-gray-200">
            <Link href="/dashboard" className="block">
              <Image
                src="/images/tartan-talks-logo.jpg"
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
                  className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              )
            })}
          </nav>

          {/* User Info & Sign Out */}
          <div className="p-4 border-t border-gray-200">
            <div className="mb-3">
              <p className="text-sm font-medium text-gray-900">Admin Access</p>
              <p className="text-xs text-gray-600">Development Mode</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-8 max-w-7xl">{children}</div>
      </main>
    </div>
  )
}
