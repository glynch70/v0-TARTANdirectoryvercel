"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Grid3x3, Home, Settings } from "lucide-react"

export function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: "/directory", label: "Directory", icon: Search },
    { href: "/trades", label: "Trades", icon: Grid3x3 },
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/admin", label: "Admin", icon: Settings },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-border shadow-lg safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all active:scale-95 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "scale-110" : ""}`} />
              <span className={`text-xs font-medium ${isActive ? "font-semibold" : ""}`}>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
