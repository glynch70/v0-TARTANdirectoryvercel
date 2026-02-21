"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Download, Upload, Edit, Trash2, Loader2, Search } from "lucide-react"
import Image from "next/image"

interface Member {
  member_id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company: string
  trade: string
  location: string
  membership_type: string
  status: string
  join_date: string
  tags: string[]
  website?: string
}

export default function AdminPage() {
  const [hasMounted, setHasMounted] = useState(false)
  const [members, setMembers] = useState<Member[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [editingMember, setEditingMember] = useState<Member | null>(null)

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

  const filteredMembers = members.filter(
    (member) =>
      (member.first_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.last_name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.trade?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDelete = async (id: string) => {
    if (confirm("Delete is not yet implemented for security reasons.")) {
      // Implement Supabase delete here when policies allow
    }
  }

  const handleExport = () => {
    const csv = [
      ["First Name", "Last Name", "Email", "Phone", "Company", "Trade", "Location", "Status"].join(","),
      ...members.map((m) =>
        [m.first_name, m.last_name, m.email, m.phone, m.company, m.trade, m.location, m.status].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "tartan-talks-members.csv"
    a.click()
  }

  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/images/tartan-talks-logo.png"
              alt="Tartan Talks"
              width={40}
              height={40}
              className="rounded-full"
            />
            <div>
              <h1 className="font-display font-bold text-xl text-gray-900">Admin</h1>
              <p className="text-xs text-gray-500">Manage member data</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              style={{ fontSize: "16px" }}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 pb-4 flex gap-2 overflow-x-auto">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium active:scale-95 transition-all whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium active:scale-95 transition-all whitespace-nowrap">
            <Upload className="w-4 h-4" />
            Import CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="p-4">
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Name</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Company</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Trade</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Email</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Phone</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700 whitespace-nowrap">Status</th>
                  <th className="px-4 py-3 text-right font-semibold text-gray-700 whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.member_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      {member.first_name} {member.last_name}
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.company}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.trade}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.email}</td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{member.phone}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${member.status === "Active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditingMember(member)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button
                          onClick={() => handleDelete(member.member_id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredMembers.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              <p>No members found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
