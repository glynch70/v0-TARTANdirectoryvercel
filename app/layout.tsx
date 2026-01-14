import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { InitStorage } from "./components/init-storage"
import { FloatingNav } from "./components/floating-nav"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Tartan Talks - Member Directory",
  description: "Find trusted local businesses and trades in Edinburgh and the Lothians",
  generator: "v0.app",
  other: {
    "cache-control": "no-cache, no-store, must-revalidate",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta httpEquiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
        <meta httpEquiv="Pragma" content="no-cache" />
        <meta httpEquiv="Expires" content="0" />
      </head>
      <body className="font-apple antialiased bg-white">
        <InitStorage />
        <main className="leading-7 tracking-tighter pb-40">{children}</main>
        <footer className="text-center py-4 px-4 text-xs text-gray-500 mt-8">
          <p>© 2026 Tartan Talks</p>
          <p>
            Built by{" "}
            <Link
              href="https://www.bear-media.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              Bear Media
            </Link>
          </p>
        </footer>
        <FloatingNav />
      </body>
    </html>
  )
}
