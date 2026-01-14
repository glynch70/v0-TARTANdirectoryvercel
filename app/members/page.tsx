"use client"

import { useEffect, useState } from "react"
import { getMembers } from "@/lib/storage"
import type { Member } from "@/lib/storage"
import { Search, Grid3x3, TableIcon, Filter, Phone, MapPin } from "lucide-react"
import Link from "next/link"

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTrade, setSelectedTrade] = useState<string>("all")
  const [view, setView] = useState<"cards" | "table" | "trades">("cards")

  useEffect(() => {
    setMembers(getMembers())
  }, [])

  // Filter members
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchQuery === "" ||
      member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.tradeOrBusinessType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTrade = selectedTrade === "all" || member.tradeOrBusinessType === selectedTrade

    return matchesSearch && matchesTrade
  })

  // Get unique trades
  const trades = Array.from(new Set(members.map((m) => m.tradeOrBusinessType))).sort()

  // Trade counts for trade explorer
  const tradeCounts = members.reduce(
    (acc, m) => {
      acc[m.tradeOrBusinessType] = (acc[m.tradeOrBusinessType] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-4xl font-bold text-foreground">Members</h1>
          <p className="text-sm sm:text-lg text-muted-foreground mt-1 sm:mt-2">
            {filteredMembers.length} of {members.length} members
          </p>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 bg-muted p-1 rounded-lg self-start">
          <button
            onClick={() => setView("cards")}
            className={`p-2.5 sm:p-2 rounded-md transition-colors ${
              view === "cards" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-white"
            }`}
            aria-label="Card view"
          >
            <Grid3x3 className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("table")}
            className={`p-2.5 sm:p-2 rounded-md transition-colors ${
              view === "table" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-white"
            }`}
            aria-label="Table view"
          >
            <TableIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => setView("trades")}
            className={`p-2.5 sm:p-2 rounded-md transition-colors ${
              view === "trades"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-white"
            }`}
            aria-label="Trade view"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bento-card !p-0">
        <div className="relative">
          <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 sm:pl-12 pr-4 py-3.5 sm:py-4 text-base sm:text-lg bg-transparent border-0 outline-none focus:ring-0 rounded-2xl"
          />
        </div>
      </div>

      {/* Trade Explorer View */}
      {view === "trades" && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
          <button
            onClick={() => setSelectedTrade("all")}
            className={`bento-card text-left transition-all active:scale-95 hover:scale-105 ${
              selectedTrade === "all" ? "ring-2 ring-primary" : ""
            }`}
          >
            <p className="font-display text-base sm:text-xl font-bold text-foreground mb-1 sm:mb-2">All</p>
            <p className="text-xl sm:text-3xl font-bold text-muted-foreground">{members.length}</p>
          </button>
          {trades.map((trade) => (
            <button
              key={trade}
              onClick={() => setSelectedTrade(trade)}
              className={`bento-card text-left transition-all active:scale-95 hover:scale-105 ${
                selectedTrade === trade ? "ring-2 ring-primary" : ""
              }`}
            >
              <p className="font-medium text-xs sm:text-sm text-foreground mb-1 sm:mb-2 line-clamp-2">{trade}</p>
              <p className="text-lg sm:text-2xl font-bold text-muted-foreground">{tradeCounts[trade]}</p>
            </button>
          ))}
        </div>
      )}

      {view === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredMembers.map((member) => (
            <Link
              key={member.id}
              href={`/members/${member.id}`}
              className="bento-card group active:scale-[0.98] hover:scale-[1.02] transition-all"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-base sm:text-lg shrink-0">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </div>
                <span
                  className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                    member.status === "active"
                      ? "bg-green-100 text-green-700"
                      : member.status === "paused"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {member.status}
                </span>
              </div>
              <h3 className="font-display text-lg sm:text-xl font-bold text-foreground mb-0.5 sm:mb-1">
                {member.firstName} {member.lastName}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">{member.company}</p>
              <div className="inline-block px-2 sm:px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs sm:text-sm font-medium mb-2 sm:mb-3">
                {member.tradeOrBusinessType}
              </div>
              <div className="space-y-1 text-xs sm:text-sm">
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {member.location}
                </p>
                <p className="text-muted-foreground flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5" />
                  {member.phone}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {view === "table" && (
        <div className="bento-card overflow-x-auto -mx-4 sm:mx-0 rounded-none sm:rounded-2xl">
          <table className="w-full min-w-[600px]">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm">Name</th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm">Company</th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm">Trade</th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm">Location</th>
                <th className="text-left py-3 px-3 sm:px-4 font-semibold text-xs sm:text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-3 sm:px-4">
                    <Link href={`/members/${member.id}`} className="font-medium text-sm hover:text-primary">
                      {member.firstName} {member.lastName}
                    </Link>
                  </td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground">{member.company}</td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm">{member.tradeOrBusinessType}</td>
                  <td className="py-3 px-3 sm:px-4 text-xs sm:text-sm text-muted-foreground">{member.location}</td>
                  <td className="py-3 px-3 sm:px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium ${
                        member.status === "active"
                          ? "bg-green-100 text-green-700"
                          : member.status === "paused"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {member.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredMembers.length === 0 && (
        <div className="bento-card-lg text-center py-8 sm:py-12">
          <p className="text-lg sm:text-xl text-muted-foreground">No members found</p>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  )
}
