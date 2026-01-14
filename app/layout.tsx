import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { InitStorage } from "./components/init-storage"
import { FloatingNav } from "./components/floating-nav"

export const metadata: Metadata = {
  title: "Tartan Talks - Member Directory",
  description: "Find trusted local businesses and trades in Edinburgh and the Lothians",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-apple antialiased bg-white">
        <InitStorage />
        <main className="leading-7 tracking-tighter">{children}</main>
        <footer className="pt-6 text-center pb-20 text-xs text-gray-500">
          <p>© 2026 Tartan Talks</p>
          <p>Built by Bear Media</p>
        </footer>
        <FloatingNav />
      </body>
    </html>
  )
}
