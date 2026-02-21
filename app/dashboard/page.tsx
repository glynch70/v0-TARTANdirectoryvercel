"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Users, Grid3x3, TrendingUp, Search, Loader2 } from "lucide-react"
import Image from "next/image"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { UpcomingEvents } from "@/components/dashboard/next-event-card"

interface Member {
  member_id: string
  first_name: string
  last_name: string
  trade: string
  status: string
  join_date: string
}

export default function DashboardPage() {
  const [hasMounted, setHasMounted] = useState(false)
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    const fetchMembers = async () => {
      const supabase = createClient()
      try {
        const { data, error } = await supabase
          .from('members')
          .select('*')

        if (error) {
          console.error('Error fetching members:', error)
        } else if (data) {
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

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    )
  }

  const activeMembers = members.filter((m) => m.status === "Active")
  const trades = Array.from(new Set(members.map((m) => m.trade)))

  // Get most common trade
  const tradeCounts = members.reduce(
    (acc, m) => {
      acc[m.trade] = (acc[m.trade] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )
  const mostCommonTrade = Object.entries(tradeCounts).sort((a, b) => b[1] - a[1])[0]

  // Recently added (last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const recentMembers = members.filter((m) => new Date(m.join_date) > thirtyDaysAgo)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-20">
      {/* Header */}
      <div className="backdrop-blur-xl bg-slate-900/80 border-b border-white/10 sticky top-0 z-30">
        <div className="px-4 py-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Image
              src="/images/tartan-talks-logo.png"
              alt="Tartan Talks"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h1 className="font-display font-bold text-2xl text-white">Dashboard</h1>
              <p className="text-sm text-slate-400">Community Overview</p>
            </div>
          </div>
          <SignOutButton />
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="px-4 py-6 space-y-4">

        {/* Upcoming Events */}
        <UpcomingEvents />

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Search Directory */}
          <Link
            href="/directory"
            className="block bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 shadow-md active:scale-[0.98] transition-all"
          >
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <p className="text-green-100 text-xs font-medium">Find a member</p>
                <Search className="w-6 h-6 text-white/80" />
              </div>
              <p className="text-white font-semibold text-lg leading-tight">Search Directory</p>
            </div>
          </Link>

          {/* Explore Trades */}
          <Link
            href="/trades"
            className="block bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 shadow-md active:scale-[0.98] transition-all"
          >
            <div className="flex flex-col h-full justify-between gap-4">
              <div className="flex justify-between items-start">
                <p className="text-orange-100 text-xs font-medium">Browse by profession</p>
                <Grid3x3 className="w-6 h-6 text-white/80" />
              </div>
              <p className="text-white font-semibold text-lg leading-tight">Explore Trades</p>
            </div>
          </Link>

          {/* Most Common Trade */}
          {mostCommonTrade && (
            <div className="col-span-2 bg-gradient-to-br from-purple-900/40 to-purple-800/40 backdrop-blur-sm rounded-2xl p-5 border border-purple-500/30">
              <div className="flex items-start justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-xs font-semibold text-purple-200 bg-purple-500/20 px-2 py-1 rounded-full border border-purple-500/30">
                  Top Trade
                </span>
              </div>
              <p className="font-display text-xl font-bold text-white mb-1">{mostCommonTrade[0]}</p>
              <p className="text-sm text-purple-200">{mostCommonTrade[1]} members</p>
            </div>
          )}
        </div>

        {/* Sync Test Comment: Trigger rebuild to verify dashboard card deployment */}
        {/* Recently Added */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5 shadow-lg">
          <h3 className="font-semibold text-white mb-3">Recently Added (30 days)</h3>
          <p className="font-display text-4xl font-bold text-white mb-4">{recentMembers.length}</p>
          <div className="space-y-3">
            {recentMembers.slice(0, 3).map((member) => (
              <Link
                key={member.member_id}
                href={`/directory/${member.member_id}`}
                className="block hover:bg-white/5 rounded-lg p-2 transition-colors -mx-2"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                    {member.first_name[0]}
                    {member.last_name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-white truncate">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-xs text-slate-400 truncate">{member.trade}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
