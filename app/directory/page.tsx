"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, MapPin, Loader2, Building2 } from "lucide-react"
import Link from "next/link"

interface Member {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  businessCategory: string
  serviceDescription: string
  tradeOrBusinessType: string
  location: string
  membershipType: string
  status: string
  tags: string[]
  website?: string
}

export default function DirectoryPage() {
  const [hasMounted, setHasMounted] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const loadMembers = () => {
      try {
        const stored = localStorage.getItem("tartan_talks_members")
        if (stored) {
          const parsedMembers = JSON.parse(stored)
          console.log("[v0] Loaded members count:", parsedMembers.length)
          setMembers(parsedMembers)
        }
      } catch (error) {
        console.error("Failed to load members:", error)
      } finally {
        setHasMounted(true)
      }
    }

    loadMembers()
  }, [])

  const filteredMembers = useMemo(() => {
    let filtered = members.filter((m) => m.status === "active")

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (member) =>
          member.firstName.toLowerCase().includes(query) ||
          member.lastName.toLowerCase().includes(query) ||
          member.company.toLowerCase().includes(query) ||
          member.serviceDescription.toLowerCase().includes(query) ||
          member.tradeOrBusinessType.toLowerCase().includes(query) ||
          member.businessCategory.toLowerCase().includes(query) ||
          member.location.toLowerCase().includes(query),
      )
    }

    return filtered
  }, [members, searchQuery])

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[rgb(20,47,84)] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading directory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Sticky Search Bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Directory</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search name, trade, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-[rgb(20,47,84)] focus:border-transparent"
              style={{ fontSize: "16px" }}
            />
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
          </div>
        </div>
      </div>

      {/* Member Cards */}
      <div className="px-4 py-4 space-y-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/directory/${member.id}`}
              className="block bg-white border-2 border-gray-200 rounded-xl p-5 active:scale-[0.98] transition-transform"
            >
              {/* Trade - Most Prominent */}
              <div className="mb-3">
                <span className="inline-block px-3 py-1.5 bg-[rgb(20,47,84)] text-white text-sm font-semibold rounded-lg">
                  {member.serviceDescription || member.tradeOrBusinessType}
                </span>
              </div>

              {/* Name */}
              <h3 className="text-xl font-bold text-gray-900 mb-1">
                {member.firstName} {member.lastName}
              </h3>

              {/* Company */}
              <div className="flex items-start gap-2 mb-2">
                <Building2 className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                <p className="text-gray-700 font-medium">{member.company}</p>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{member.location}</span>
              </div>
            </Link>
          ))
        ) : (
          <div className="bg-gray-50 rounded-xl p-12 text-center">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No members found</h3>
            <p className="text-gray-600">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  )
}
