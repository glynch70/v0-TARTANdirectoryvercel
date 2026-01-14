"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Home, Users } from "lucide-react"

export function Header() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: "/", label: "Home", icon: Home },
    { href: "/directory", label: "Directory", icon: Users },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/images/tartan-talks-logo-banner.png"
                alt="Tartan Talks - Fixers & Mixers"
                width={200}
                height={80}
                className="h-12 w-auto"
                priority
              />
              <span className="hidden sm:block text-xl md:text-2xl font-bold text-[rgb(20,47,84)]">
                Fixers & Mixers
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-medium transition-colors ${
                    pathname === link.href || pathname.startsWith(link.href + "/")
                      ? "text-[rgb(20,47,84)]"
                      : "text-gray-600 hover:text-[rgb(20,47,84)]"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 -mr-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <nav className="fixed top-[65px] left-0 right-0 bg-white border-b border-gray-200 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 py-4 px-2 rounded-lg transition-colors ${
                      pathname === link.href || pathname.startsWith(link.href + "/")
                        ? "bg-primary/10 text-primary font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-lg">{link.label}</span>
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      )}
    </>
  )
}
