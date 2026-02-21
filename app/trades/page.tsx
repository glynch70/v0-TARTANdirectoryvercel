"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import {
  Users,
  Loader2,
  ChevronRight,
  Building2,
  Wrench,
  Calculator,
  Zap,
  Home,
  HeartPulse,
  UserCheck,
  Briefcase,
  ArrowLeft,
  MapPin,
  Search,
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"

interface Member {
  member_id: string
  first_name: string
  last_name: string
  company: string | null
  category: string | null
  trade: string | null
  status: string
  location: string | null
}

const CATEGORY_ICONS: Record<string, any> = {
  "Construction & Building": Building2,
  "Electrical, Gas & Renewables": Zap,
  "Finance & Legal": Calculator,
  "Technology & Digital": Home,
  "Property, Cleaning & Maintenance": Home,
  "Health & Wellbeing": HeartPulse,
  "Recruitment & HR": UserCheck,
  "Other Services": Briefcase,
}

const CATEGORY_COLORS: Record<string, string> = {
  "Construction & Building": "from-amber-500 to-orange-600",
  "Electrical, Gas & Renewables": "from-yellow-500 to-amber-600",
  "Finance & Legal": "from-emerald-500 to-teal-600",
  "Technology & Digital": "from-purple-500 to-pink-600",
  "Property, Cleaning & Maintenance": "from-cyan-500 to-blue-600",
  "Health & Wellbeing": "from-rose-500 to-red-600",
  "Recruitment & HR": "from-indigo-500 to-purple-600",
  "Other Services": "from-blue-500 to-indigo-600",
}

export default function TradesPage() {
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  useEffect(() => {
    const fetchMembers = async () => {
      const supabase = createClient()
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')
          .eq('status', 'Active')

        if (error) {
          console.error('Error fetching members:', error)
        } else if (data) {
          // @ts-ignore - Supabase types are strict
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

  const categorizedMembers = useMemo(() => {
    const grouped = members.reduce(
      (acc, member) => {
        const category = member.category || "Other Services"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-amber-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-300">Loading trades...</p>
        </div>
      </div>
    )
  }

  const totalMembers = members.length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
          <h1 className="text-2xl font-bold text-white mb-1">Trades</h1>
          <p className="text-sm text-slate-400">
            {categorizedMembers.length} categories • {totalMembers} members
          </p>
        </div>
      </motion.div>

      <div className="px-4 py-4 space-y-3 pb-32">
        {categorizedMembers.map((group, index) => {
          const isExpanded = expandedCategory === group.category
          const Icon = CATEGORY_ICONS[group.category] || Wrench
          const colorClass = CATEGORY_COLORS[group.category] || "from-slate-600 to-slate-700"

          return (
            <motion.div
              key={group.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-xl"
            >
              <motion.button
                onClick={() => toggleCategory(group.category)}
                className="w-full px-5 py-4 hover:bg-white/10 transition-colors flex items-center justify-between"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${colorClass} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <h2 className="text-lg font-bold text-white">{group.category}</h2>
                    <div className="flex items-center gap-1 mt-1 text-slate-400">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{group.count} members</span>
                    </div>
                  </div>
                </div>
                <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronRight className="w-6 h-6 text-slate-400" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/10 bg-slate-900/50"
                  >
                    <div className="p-4 space-y-4">
                      {group.members.map((member, memberIndex) => (
                        <motion.div
                          key={member.member_id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: memberIndex * 0.05 }}
                        >
                          <Link
                            href={`/directory/${member.member_id}`}
                            className="block bg-gradient-to-br from-slate-800/60 to-slate-700/60 backdrop-blur-sm border border-white/10 rounded-xl p-5 shadow-lg hover:bg-slate-700/80 hover:border-white/20 transition-all duration-200"
                          >
                            {/* Name */}
                            <h3 className="text-lg sm:text-xl font-bold text-white mb-1 line-clamp-1">
                              {member.first_name} {member.last_name}
                            </h3>

                            {/* Company */}
                            <div className="flex items-start gap-2 mb-3">
                              <Building2 className="w-4 h-4 text-slate-400 mt-1 flex-shrink-0" />
                              <p className="text-slate-300 font-medium text-sm sm:text-base line-clamp-1">
                                {member.company}
                              </p>
                            </div>

                            {/* Description Section */}
                            <div className="mb-3">
                              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                                Description
                              </p>
                              <p className={`text-sm font-medium line-clamp-2 bg-gradient-to-r ${colorClass} bg-clip-text text-transparent`}>
                                {member.trade || "Member"}
                              </p>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-2 text-slate-400 text-xs sm:text-sm mt-auto">
                              <MapPin className="w-4 h-4 flex-shrink-0" />
                              <span className="line-clamp-1">{member.location || "Location not specified"}</span>
                            </div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
