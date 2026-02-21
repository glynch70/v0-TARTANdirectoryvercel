"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MapPin, Search, Building2, User, Share2, Loader2, ArrowLeft } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

interface Member {
  member_id: string
  first_name: string
  last_name: string
  company: string | null
  trade: string | null
  location: string | null
  status: string
  category: string | null
  website: string | null
  email?: string
  phone?: string
  membership_type?: string
  avatar_url?: string | null
  social_media?: string | null
}

export default function DirectoryPage() {
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("All")

  useEffect(() => {
    const fetchMembers = async () => {
      const supabase = createClient()
      try {
        const { data, error } = await supabase
          .from('directory_profiles')
          .select('*')
          .eq('status', 'Active')

        if (error) {
          console.error('Error fetching members:', error)
        } else if (data) {
          // @ts-ignore - Supabase return types match but casing differs from old interface if not careful
          setMembers(data as Member[])
        }
      } catch (error) {
        console.error("Failed to load members:", error)
      } finally {
        setHasMounted(true)
      }
    }

    fetchMembers()
  }, [])

  const filteredMembers = useMemo(() => {
    if (!hasMounted || !members || members.length === 0) {
      return []
    }

    let filtered = members

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((member) => {
        const firstName = String(member.first_name || "").toLowerCase()
        const lastName = String(member.last_name || "").toLowerCase()
        const company = String(member.company || "").toLowerCase()
        const trade = String(member.trade || "").toLowerCase()
        const category = String(member.category || "").toLowerCase()
        const location = String(member.location || "").toLowerCase()

        return (
          firstName.includes(query) ||
          lastName.includes(query) ||
          company.includes(query) ||
          trade.includes(query) ||
          category.includes(query) ||
          location.includes(query)
        )
      })
    }

    // Apply Location Filter
    if (locationFilter !== "All") {
      filtered = filtered.filter((member) => {
        const loc = String(member.location || "")
        if (locationFilter === "Glasgow") {
          return loc === "Glasgow" || loc === "Glasgow & Edinburgh"
        }
        if (locationFilter === "Edinburgh") {
          return loc === "Edinburgh" || loc === "Glasgow & Edinburgh"
        }
        return true
      })
    }

    return filtered
  }, [hasMounted, members, searchQuery, locationFilter])

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
          <div className="flex items-center gap-3 mb-2 sm:mb-0">
            <button
              onClick={() => router.push("/")}
              className="sm:hidden inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h1 className="text-xl sm:text-2xl font-bold text-white">Directory</h1>

            {/* Location Filter Tabs */}
            <div className="flex p-1 bg-slate-800/50 rounded-lg border border-white/10 w-full sm:w-auto">
              <button
                onClick={() => setLocationFilter("All")}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${locationFilter === "All"
                  ? "bg-amber-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setLocationFilter("Edinburgh")}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${locationFilter === "Edinburgh"
                  ? "bg-amber-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                Edinburgh
              </button>
              <button
                onClick={() => setLocationFilter("Glasgow")}
                className={`flex-1 sm:flex-none px-4 py-1.5 text-sm font-medium rounded-md transition-all ${locationFilter === "Glasgow"
                  ? "bg-amber-500 text-white shadow-lg"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
              >
                Glasgow
              </button>
            </div>
          </div>

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
                key={member.member_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={`/directory/${member.member_id}`}
                  className="block bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 shadow-md sm:shadow-xl hover:bg-slate-700/80 hover:border-white/20 transition-all duration-200"
                >
                  {/* Header Row: Avatar, Name, and Company */}
                  <div className="flex items-start gap-4 mb-3">
                    {/* Avatar */}
                    <div className="flex-shrink-0">
                      {member.avatar_url ? (
                        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-slate-600 bg-slate-800">
                          <Image
                            src={member.avatar_url}
                            alt={`${member.first_name} ${member.last_name}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-slate-600 bg-slate-800 text-slate-400 flex items-center justify-center">
                          <User className="w-6 h-6 sm:w-8 sm:h-8" />
                        </div>
                      )}
                    </div>

                    {/* Name and Company details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1">
                        {member.first_name} {member.last_name}
                      </h3>
                      <div className="flex items-start gap-2">
                        <Building2 className="w-4 h-4 text-slate-400 mt-[2px] flex-shrink-0" />
                        <p className="text-slate-300 font-medium text-sm sm:text-base line-clamp-1">{member.company}</p>
                      </div>
                    </div>
                  </div>

                  {/* Description Section */}
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description</p>
                    <p className="text-orange-400 text-sm font-medium line-clamp-3">
                      {member.trade || 'Member'}
                    </p>
                  </div>

                  {/* Footer Row: Location and Social */}
                  <div className="flex items-center justify-between text-slate-400 text-xs sm:text-sm mt-auto">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{member.location}</span>
                    </div>
                    {member.social_media && (
                      <div className="flex items-center gap-1.5 text-pink-400 font-medium z-10 transition-colors hover:text-pink-300"
                        onClick={(e) => {
                          // Stop propagation to prevent exactly matching the Next `<Link>` wrap
                          e.stopPropagation();
                        }}>
                        <a href={member.social_media.startsWith("http") ? member.social_media : `https://${member.social_media}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Social</span>
                        </a>
                      </div>
                    )}
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
    </div >
  )
}
