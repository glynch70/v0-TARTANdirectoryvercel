"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Users, Loader2, ChevronRight } from "lucide-react"

interface Member {
  id: string
  firstName: string
  lastName: string
  company: string
  businessCategory: string
  serviceDescription: string
  tradeOrBusinessType: string
  status: string
}

export default function TradesPage() {
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tartan_talks_members")
      if (stored) {
        const loadedMembers = JSON.parse(stored)
        console.log("[v0] Loaded members for trades:", loadedMembers.length)
        setMembers(loadedMembers)
      }
    } catch (error) {
      console.error("Failed to load members:", error)
    } finally {
      setHasMounted(true)
    }
  }, [])

  const categorizedMembers = useMemo(() => {
    const activeMembers = members.filter((m) => m.status === "active")

    const grouped = activeMembers.reduce(
      (acc, member) => {
        const category = member.businessCategory || "Other Services"
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(member)
        return acc
      },
      {} as Record<string, Member[]>,
    )

    return Object.entries(grouped)
      .map(([category, members]) => ({
        category,
        members,
        count: members.length,
      }))
      .sort((a, b) => b.count - a.count)
  }, [members])

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[rgb(20,47,84)] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading trades...</p>
        </div>
      </div>
    )
  }

  const totalMembers = members.filter((m) => m.status === "active").length

  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Trades</h1>
          <p className="text-sm text-gray-600">
            {categorizedMembers.length} categories • {totalMembers} members
          </p>
        </div>
      </div>

      <div className="px-4 py-4 space-y-3">
        {categorizedMembers.map((group) => {
          const isExpanded = expandedCategory === group.category

          return (
            <div key={group.category} className="border-2 border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleCategory(group.category)}
                className="w-full px-5 py-4 bg-white hover:bg-gray-50 active:bg-gray-100 transition-colors flex items-center justify-between"
              >
                <div className="text-left">
                  <h2 className="text-lg font-bold text-gray-900">{group.category}</h2>
                  <div className="flex items-center gap-1 mt-1 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{group.count} members</span>
                  </div>
                </div>
                <ChevronRight
                  className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? "rotate-90" : ""}`}
                />
              </button>

              {isExpanded && (
                <div className="border-t-2 border-gray-200 bg-gray-50">
                  {group.members.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => router.push(`/directory/${member.id}`)}
                      className="w-full px-5 py-4 border-b border-gray-200 last:border-b-0 hover:bg-white active:bg-gray-100 transition-colors text-left"
                    >
                      <div className="mb-2">
                        <span className="inline-block px-2.5 py-1 bg-[rgb(20,47,84)] text-white text-xs font-semibold rounded">
                          {member.serviceDescription || member.tradeOrBusinessType}
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">{member.company}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
