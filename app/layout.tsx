import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { FloatingNav } from "./components/floating-nav"
import { Toaster } from "@/components/ui/sonner"

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
      <body className="font-apple antialiased bg-slate-950">
        <main className="leading-7 tracking-tighter min-h-screen">{children}</main>
        <FloatingNav />
        <Toaster />
      </body>
    </html>
  )
}
