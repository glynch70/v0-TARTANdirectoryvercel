"use client"

import { Users, Briefcase, Info, Mail, Linkedin, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Tartan Header Divider */}
      <div
        className="h-12 bg-cover bg-center"
        style={{
          backgroundImage: "url(/images/tartan.jpg)",
          backgroundPosition: "center top",
        }}
      />

      {/* Logo and Hero */}
      <div
        className="relative px-4 py-16 text-center bg-cover bg-center before:absolute before:inset-0 before:bg-black/40"
        style={{
          backgroundImage: "url('/images/lunch-atop-a-skyscraper-charles-clyde-ebbets.jpg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="relative z-10 flex justify-center mb-4">
          <Image
            src="/images/copy-20of-20tt-20logo.png"
            alt="Tartan Talks Logo"
            width={200}
            height={200}
            className="w-40 h-40 object-contain drop-shadow-lg"
          />
        </div>

        <h1 className="relative z-10 text-4xl font-bold text-white mb-1 drop-shadow-md">Tartan Talks</h1>
        <p className="relative z-10 text-lg text-white/90 mb-6 drop-shadow-sm"></p>
      </div>

      {/* Bento Grid */}
      <div className="px-4 py-6 max-w-2xl mx-auto pb-40">
        <div className="grid grid-cols-1 gap-4">
          {/* Browse Directory */}
          <Link href="/directory">
            <div className="bento-card-lg bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700 cursor-pointer group p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white transition" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Browse Directory</h2>
              <p className="text-slate-300 text-sm">
                Find trusted members, search by trade, and connect with businesses in your area.
              </p>
            </div>
          </Link>

          {/* Explore Trades */}
          <Link href="/trades">
            <div className="bento-card-lg bg-gradient-to-br from-teal-600 to-emerald-700 border-teal-500 cursor-pointer group p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <ArrowRight className="w-5 h-5 text-white/60 group-hover:text-white transition" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">Explore Trades</h2>
              <p className="text-slate-100 text-sm">
                Browse categories and discover professionals organized by their specialties.
              </p>
            </div>
          </Link>

          {/* Mark Innes Founder Card */}
          <div className="bento-card-lg bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Image
                  src="/images/markinnes.jpeg"
                  alt="Mark Innes - Founder"
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 mb-1">Mark Innes</h3>
                <p className="text-sm text-slate-600 mb-3">Founder &amp; Host</p>
                <a
                  href="https://www.linkedin.com/in/tartantimber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg text-sm font-semibold hover:shadow-lg transition"
                >
                  <Linkedin className="w-4 h-4" />
                  Connect
                </a>
              </div>
            </div>
          </div>

          {/* About Section */}
          <Link href="/about">
            <div className="bento-card-lg bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 cursor-pointer group p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition">
                  <Info className="w-6 h-6 text-indigo-600" />
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-600/60 group-hover:text-indigo-600 transition" />
              </div>
              <h2 className="text-lg font-bold text-slate-900 mb-1">About Tartan Talks</h2>
              <p className="text-slate-600 text-sm">
                Learn about our mission, values, and the community we're building.
              </p>
            </div>
          </Link>

          {/* Get In Touch */}
          <div className="bento-card-lg bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-rose-600/10 flex items-center justify-center">
                <Mail className="w-6 h-6 text-rose-600" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mb-2">Get In Touch</h2>
            <p className="text-slate-600 text-sm mb-4">
              Interested in joining Tartan Talks? We'd love to hear from you.
            </p>
            <button className="text-rose-600 font-semibold text-sm hover:text-rose-700 transition">Contact Us →</button>
          </div>
        </div>
      </div>

      {/* Tartan Footer Divider */}
      <div
        className="h-12 bg-cover bg-center fixed bottom-0 left-0 right-0"
        style={{
          backgroundImage: "url(/images/tartan.jpg)",
          backgroundPosition: "center bottom",
        }}
      />
    </div>
  )
}
