"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Phone, Mail, MapPin, ExternalLink, Building2, User, ArrowLeft, Loader2, Lock } from "lucide-react"
import Link from "next/link"

interface Member {
  member_id: string
  first_name: string
  last_name: string
  email: string | null
  phone: string | null
  company: string
  trade: string
  location: string
  membership_type: string
  status: string
  join_date: string
  tags: string[]
  website?: string
  notes?: string
}

export default function MemberProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [member, setMember] = useState<Member | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMember = async () => {
      const supabase = createClient()
      try {
        const { data, error } = await supabase
          .from('directory_profiles')
          .select('*')
          .eq('member_id', params.id)
          .single()

        if (error) {
          console.error("Error fetching member:", error)
        } else if (data) {
          setMember(data as Member)
        }
      } catch (error) {
        console.error("Failed to load member:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[rgb(20,47,84)] animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Member Not Found</h1>
          <p className="text-gray-600 mb-6">This member profile could not be found</p>
          <Link
            href="/directory"
            className="inline-block px-6 py-3 bg-[rgb(20,47,84)] text-white rounded-lg hover:bg-[rgb(20,47,84)]/90 transition-colors"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/directory"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Directory</span>
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-6">
          {/* Trade Badge */}
          <div className="mb-6">
            <span className="inline-block px-4 py-2 bg-[rgb(20,47,84)] text-white font-semibold rounded-lg">
              {member.trade}
            </span>
          </div>

          {/* Name and Company */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {member.first_name} {member.last_name}
          </h1>
          <div className="flex items-center gap-2 text-xl text-gray-700 mb-6">
            <Building2 className="w-5 h-5 text-gray-400" />
            <span className="font-medium">{member.company}</span>
          </div>

          {/* Contact Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {member.phone ? (
              <a
                href={`tel:${member.phone}`}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                <Phone className="w-5 h-5" />
                <span>Call</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed font-medium">
                <Lock className="w-5 h-5" />
                <span>Private Number</span>
              </div>
            )}

            {member.email ? (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Mail className="w-5 h-5" />
                <span>Email</span>
              </a>
            ) : (
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 rounded-lg cursor-not-allowed font-medium">
                <Lock className="w-5 h-5" />
                <span>Private Email</span>
              </div>
            )}

            {member.website && (
              <a
                href={member.website.startsWith("http") ? member.website : `https://${member.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                <ExternalLink className="w-5 h-5" />
                <span>Website</span>
              </a>
            )}
          </div>
        </div>

        {/* Member Details */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Member Details</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    {member.phone ? (
                      <a href={`tel:${member.phone}`} className="text-gray-900 hover:text-[rgb(20,47,84)]">
                        {member.phone}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Hidden</span>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    {member.email ? (
                      <a href={`mailto:${member.email}`} className="text-gray-900 hover:text-[rgb(20,47,84)] break-all">
                        {member.email}
                      </a>
                    ) : (
                      <span className="text-slate-400 italic">Hidden</span>
                    )}
                  </div>
                </div>
                {member.website && (
                  <div className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      <a
                        href={member.website.startsWith("http") ? member.website : `https://${member.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:text-[rgb(20,47,84)] break-all"
                      >
                        {member.website}
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Business Information */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Business Information</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-900">{member.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Membership Type</p>
                    <p className="text-gray-900">{member.membership_type}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          {member.tags && member.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {member.tags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
