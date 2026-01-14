"use client"

import { useState, useMemo, useEffect } from "react"
import { Search, MapPin, Loader2, Building2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
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
    if (!hasMounted || !members || members.length === 0) {
      return []
    }

    let filtered = members.filter((m) => m.status === "active")

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((member) => {
        const firstName = String(member.firstName || "").toLowerCase()
        const lastName = String(member.lastName || "").toLowerCase()
        const company = String(member.company || "").toLowerCase()
        const description = String(member.serviceDescription || "").toLowerCase()
        const trade = String(member.tradeOrBusinessType || "").toLowerCase()
        const category = String(member.businessCategory || "").toLowerCase()
        const location = String(member.location || "").toLowerCase()

        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          company.includes(query) ||
          description.includes(query) ||
          trade.includes(query) ||
          category.includes(query) ||
          location.includes(query)
        )
      })
    }

    return filtered
  }, [hasMounted, members, searchQuery])

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading directory...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Sticky Search Bar */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/80 border-b border-white/10 shadow-2xl"
      >
        <div className="px-4 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-3">Directory</h1>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="search"
              placeholder="Search name, trade, company..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 sm:py-4 text-base bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 transition-colors"
              style={{ fontSize: "16px" }}
            />
          </div>
          <div className="mt-2 text-xs sm:text-sm text-slate-400">
            {filteredMembers.length} {filteredMembers.length === 1 ? "member" : "members"}
          </div>
        </div>
      </motion.div>

      {/* Member Cards - Mobile-first responsive */}
      <div className="px-3 sm:px-4 py-4 pb-32 space-y-3 sm:space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredMembers.length > 0 ? (
            filteredMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/directory/${member.id}`}
                  className="block bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-xl hover:bg-slate-700/80 hover:border-white/20 transition-all duration-200"
                >
                  {/* Trade Badge - responsive sizing */}
                  <div className="mb-3">
                    <span className="inline-block px-2.5 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-xs sm:text-sm font-semibold rounded-md sm:rounded-lg shadow-lg">
                      {member.serviceDescription || member.tradeOrBusinessType}
                    </span>
                  </div>

                  {/* Name - responsive text sizing */}
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-2">
                    {member.firstName} {member.lastName}
                  </h3>

                  {/* Company */}
                  <div className="flex items-start gap-2 mb-2">
                    <Building2 className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                    <p className="text-slate-300 font-medium text-sm sm:text-base line-clamp-2">{member.company}</p>
                  </div>

                  {/* Location */}
                  <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{member.location}</span>
                  </div>
                </Link>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-8 sm:p-12 text-center mt-8"
            >
              <Search className="w-12 sm:w-16 h-12 sm:h-16 mx-auto text-slate-600 mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">No members found</h3>
              <p className="text-slate-400 text-sm sm:text-base">Try a different search term</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
