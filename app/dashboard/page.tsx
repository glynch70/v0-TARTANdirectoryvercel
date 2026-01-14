"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Users, Grid3x3, TrendingUp, Search, Loader2 } from "lucide-react"
import Image from "next/image"

interface Member {
  id: string
  firstName: string
  lastName: string
  trade: string
  status: string
  joinDate: string
}

export default function DashboardPage() {
  const [hasMounted, setHasMounted] = useState(false)
  const [members, setMembers] = useState<Member[]>([])

  useEffect(() => {
    const loadMembers = () => {
      try {
        const stored = localStorage.getItem("tartan_members")
        if (stored) {
          setMembers(JSON.parse(stored))
        }
      } catch (error) {
        console.error("Failed to load members:", error)
      } finally {
        setHasMounted(true)
      }
    }

    loadMembers()
    window.addEventListener("storage", loadMembers)
    return () => window.removeEventListener("storage", loadMembers)
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
  const recentMembers = members.filter((m) => new Date(m.joinDate) > thirtyDaysAgo)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 flex items-center gap-3">
          <Image
            src="/images/tartan-talks-logo.png"
            alt="Tartan Talks"
            width={48}
            height={48}
            className="rounded-full"
          />
          <div>
            <h1 className="font-display font-bold text-2xl text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500">Community Overview</p>
          </div>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="px-4 py-6 space-y-4">
        {/* Total Members - Large Card */}
        <Link
          href="/directory"
          className="block bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 shadow-md active:scale-[0.98] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Users className="w-7 h-7 text-white" />
            </div>
            <Search className="w-6 h-6 text-white/60" />
          </div>
          <p className="text-blue-100 text-sm font-medium mb-1">Total Members</p>
          <p className="text-white font-display text-5xl font-bold mb-3">{members.length}</p>
          <div className="flex items-center gap-4 text-sm text-blue-100">
            <span>{activeMembers.length} Active</span>
            <span>•</span>
            <span>Tap to search</span>
          </div>
        </Link>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Active Members */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center mb-3">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">Active</p>
            <p className="font-display text-3xl font-bold text-gray-900">{activeMembers.length}</p>
          </div>

          {/* Unique Trades */}
          <Link
            href="/trades"
            className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 active:scale-[0.98] transition-all"
          >
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
              <Grid3x3 className="w-5 h-5 text-purple-600" />
            </div>
            <p className="text-gray-500 text-xs font-medium mb-1">Trades</p>
            <p className="font-display text-3xl font-bold text-gray-900">{trades.length}</p>
          </Link>

          {/* Most Common Trade */}
          {mostCommonTrade && (
            <div className="col-span-2 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
              <div className="flex items-start justify-between mb-2">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <span className="text-xs font-semibold text-purple-600 bg-purple-200 px-2 py-1 rounded-full">
                  Top Trade
                </span>
              </div>
              <p className="font-display text-xl font-bold text-gray-900 mb-1">{mostCommonTrade[0]}</p>
              <p className="text-sm text-gray-600">{mostCommonTrade[1]} members</p>
            </div>
          )}
        </div>

        {/* Recently Added */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 mb-3">Recently Added (30 days)</h3>
          <p className="font-display text-4xl font-bold text-gray-900 mb-4">{recentMembers.length}</p>
          <div className="space-y-3">
            {recentMembers.slice(0, 3).map((member) => (
              <div key={member.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                  {member.firstName[0]}
                  {member.lastName[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-gray-900 truncate">
                    {member.firstName} {member.lastName}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{member.trade}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-3">
          <Link
            href="/directory"
            className="block bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-5 shadow-md active:scale-[0.98] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Find a member</p>
                <p className="text-white font-semibold text-lg">Search Directory</p>
              </div>
              <Search className="w-8 h-8 text-white/80" />
            </div>
          </Link>

          <Link
            href="/trades"
            className="block bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-5 shadow-md active:scale-[0.98] transition-all"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium mb-1">Browse by profession</p>
                <p className="text-white font-semibold text-lg">Explore Trades</p>
              </div>
              <Grid3x3 className="w-8 h-8 text-white/80" />
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
