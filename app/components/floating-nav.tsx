"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, Grid3x3, Search, Info } from "lucide-react"

export function FloatingNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/trades", icon: Grid3x3, label: "Trades" },
    { href: "/directory", icon: Search, label: "Directory" },
    { href: "/about", icon: Info, label: "About" },
  ]

  return (
    <nav className="fixed bottom-safe left-4 right-4 bg-white rounded-2xl shadow-lg border border-gray-200 z-50 md:max-w-md md:mx-auto">
      <div className="flex items-center justify-around px-2 py-3">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
                isActive ? "bg-[rgb(20,47,84)] text-white" : "text-gray-600 hover:bg-gray-100 active:scale-95"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
