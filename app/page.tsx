"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Users, Building2, Phone, MapPin, ChevronRight, UserPlus, Mail, LogIn } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { SignOutButton } from "@/components/auth/sign-out-button"
import { User } from "@supabase/supabase-js"


export default function HomePage() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })
  }, [])

  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: { scale: 1.05, y: -5 },
  }

  return (
    <div className="min-h-screen bg-white">
      <section className="relative w-full h-[50vh] overflow-hidden flex flex-col">
        {/* Background image */}
        <Image
          src="/images/lunch-atop-a-skyscraper-charles-clyde-ebbets.jpg"
          alt="Workers on skyscraper"
          fill
          className="object-contain"
          priority
        />

        {/* Tartan pattern overlay at top */}
        <div
          className="absolute top-0 left-0 w-full h-24 md:h-32 bg-cover bg-repeat-x z-20"
          style={{
            backgroundImage: "url(/images/tartan.jpg)",
          }}
        />

        {/* Dark overlay at bottom for readability */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />

        {/* Header Actions - Top Right */}
        <div className="absolute top-4 right-4 z-50">
          {user ? (
            <SignOutButton className="bg-white/90 backdrop-blur shadow-sm hover:bg-white text-red-600" />
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[rgb(20,47,84)] bg-white/90 backdrop-blur shadow-sm hover:bg-white rounded-lg transition-colors"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Hero content positioned at BOTTOM below the men */}
        <div className="relative z-30 mt-auto mb-20 text-center px-5">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-widest drop-shadow-lg text-[rgb(20,47,84)]">
              Tartan Talks
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-white tracking-wider mt-3 font-light drop-shadow-lg">
              "FIXERS & MIXERS"
            </p>
          </motion.div>
        </div>
      </section>

      <section className="bg-[rgb(20,47,84)] px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Browse Directory Card */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ delay: 0.4 }}
          >
            <Link
              href="/directory"
              className="block bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/20 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Browse Directory</h2>
                    <p className="text-white/80">
                      Find trusted members, search by trade, and connect with businesses in your area.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
              </div>
            </Link>
          </motion.div>

          {/* Explore Trades Card */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ delay: 0.5 }}
          >
            <Link
              href="/trades"
              className="block bg-gradient-to-br from-teal-600 to-teal-700 border-2 border-teal-400/30 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <Building2 className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">Explore Trades</h2>
                    <p className="text-white/90">
                      Browse categories and discover professionals organized by their specialties.
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-8 h-8 text-white/60 group-hover:text-white transition-colors flex-shrink-0" />
              </div>
            </Link>
          </motion.div>

          {/* Refer a Friend Card */}
          <motion.div
            variants={cardVariants}
            initial="initial"
            animate="animate"
            whileHover="hover"
            transition={{ delay: 0.6 }}
            className="bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-amber-400/30 rounded-2xl p-6 shadow-xl"
          >
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Refer a Friend</h2>
                <p className="text-white/90 mb-4">
                  Know someone who'd be perfect for Tartan Talks? Get in touch with Mark Innes, Founder and Host, to
                  make a referral.
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:mark@tartantimber.com"
                    className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-medium">mark@tartantimber.com</span>
                  </a>
                  <a
                    href="tel:07769677121"
                    className="flex items-center gap-2 text-white hover:text-white/80 transition-colors"
                  >
                    <Phone className="w-5 h-5" />
                    <span className="font-medium">07769 677121</span>
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Value Props */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                icon: Users,
                title: "Professional Network",
                desc: "Vetted local businesses",
                color: "from-blue-500 to-indigo-600",
              },
              {
                icon: Building2,
                title: "Local Trades",
                desc: "Trusted services nearby",
                color: "from-teal-500 to-cyan-600",
              },
              { icon: Phone, title: "Direct Contact", desc: "Quick responses", color: "from-amber-500 to-orange-600" },
              { icon: MapPin, title: "Regional", desc: "Edinburgh & Lothians", color: "from-emerald-500 to-teal-600" },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                transition={{ delay: 0.7 + index * 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-5 text-center"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-full flex items-center justify-center mx-auto mb-3`}
                >
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                <p className="text-xs text-white/80">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Community</h2>
          <p className="text-lg text-gray-700 text-center mb-12">
            Tartan Talks brings together business owners, trades professionals, and service providers across Edinburgh
            and the Lothians. Our members are committed to quality service and building lasting business relationships.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Edinburgh", desc: "Scotland's capital, home to our largest member community" },
              { title: "West & East Lothian", desc: "Serving Livingston, Bathgate, Linlithgow, and surrounding areas" },
              { title: "Midlothian", desc: "Dalkeith, Penicuik, Bonnyrigg, and surrounding areas" },
              { title: "Scottish Borders", desc: "Galashiels, Kelso, Peebles, and border communities" },
              { title: "Growing Network", desc: "Expanding across Central Scotland with trusted professionals" },
            ].map((location, index) => (
              <motion.div
                key={location.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 + index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-md"
              >
                <h3 className="font-bold text-lg mb-2">{location.title}</h3>
                <p className="text-gray-600 text-sm">{location.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[rgb(20,47,84)] text-white py-8 px-4 pb-28">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/80">© 2026 Tartan Talks. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
