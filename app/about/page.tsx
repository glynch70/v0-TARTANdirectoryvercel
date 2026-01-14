"use client"

import { useRouter } from "next/navigation"
import { Users, Target, Heart, Phone, Linkedin, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"

export default function AboutPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
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
          <h1 className="text-2xl font-bold text-white">About</h1>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Intro */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-3">Tartan Talks</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            Tartan Talks is a professional networking community connecting trusted businesses and trades across
            Edinburgh and the Lothians. We bring together business owners, trades professionals, and service providers
            committed to quality and lasting relationships.
          </p>
          <p className="text-slate-300 leading-relaxed">
            Our "Fixers & Mixers" tagline reflects our dual focus: bringing together skilled professionals (fixers) in a
            collaborative networking environment (mixers).
          </p>
        </motion.section>

        {/* Values */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">What We Stand For</h2>

          {[
            {
              icon: Target,
              color: "from-blue-600 to-indigo-700",
              title: "Quality Service",
              desc: "All members are committed to delivering exceptional work",
            },
            {
              icon: Users,
              color: "from-teal-600 to-cyan-700",
              title: "Community First",
              desc: "Building relationships and supporting local businesses",
            },
            {
              icon: Heart,
              color: "from-amber-600 to-orange-700",
              title: "Trust & Integrity",
              desc: "Members you can rely on for honest, professional service",
            },
          ].map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              whileHover={{ scale: 1.02, x: 5 }}
              className="flex gap-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-xl"
            >
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-r ${value.color} flex items-center justify-center flex-shrink-0`}
              >
                <value.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-white mb-1">{value.title}</h3>
                <p className="text-sm text-slate-400">{value.desc}</p>
              </div>
            </motion.div>
          ))}
        </section>

        {/* Coverage */}
        <section>
          <h2 className="text-xl font-bold text-white mb-4">Our Coverage</h2>
          <div className="space-y-3">
            {[
              { title: "Edinburgh", desc: "Scotland's capital and our largest member community" },
              { title: "West Lothian", desc: "Livingston, Bathgate, Linlithgow, and surrounding areas" },
              { title: "East Lothian", desc: "Haddington, North Berwick, Dunbar, and more" },
            ].map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 shadow-xl"
              >
                <h3 className="font-semibold text-white mb-1">{area.title}</h3>
                <p className="text-sm text-slate-400">{area.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Founder */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-amber-500/10 to-orange-600/10 backdrop-blur-sm border border-amber-500/20 rounded-xl p-6 shadow-xl"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <Linkedin className="w-8 h-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Mark Innes</h3>
              <p className="text-amber-400">Founder & Owner</p>
            </div>
          </div>
          <p className="text-slate-300 leading-relaxed mb-4">
            Connect with Mark on LinkedIn to learn more about Tartan Talks and membership opportunities.
          </p>
          <a
            href="https://www.linkedin.com/in/tartantimber/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-amber-500/50 transition-shadow"
          >
            <Linkedin className="w-5 h-5" />
            Connect on LinkedIn
          </a>
        </motion.section>

        {/* Connect with Tartan Talks */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 shadow-xl"
        >
          <h2 className="text-xl font-bold text-white mb-6">Connect with Tartan Talks</h2>

          <div className="space-y-4 mb-6">
            {/* Website and Eventbrite links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href="https://tartantalks.co.uk/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 text-blue-300 hover:text-blue-200 rounded-lg font-medium transition-all"
              >
                <span>🌐</span>
                Website
              </a>
              <a
                href="https://www.eventbrite.com/e/tartan-talks-tickets-1062946444429"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 hover:text-indigo-200 rounded-lg font-medium transition-all"
              >
                <span>🎫</span>
                Events
              </a>
            </div>

            {/* Social links */}
            <div>
              <p className="text-sm text-slate-400 mb-3">Follow us on social media</p>
              <div className="flex gap-3 flex-wrap">
                <a
                  href="https://www.facebook.com/p/Tartan-Talks-61565613290594/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 flex items-center justify-center text-blue-300 hover:text-blue-200 transition-all"
                  title="Facebook"
                >
                  <span className="text-xl">f</span>
                </a>
                <a
                  href="https://www.instagram.com/tartantalks/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-pink-600/20 hover:bg-pink-600/30 border border-pink-500/30 flex items-center justify-center text-pink-300 hover:text-pink-200 transition-all"
                  title="Instagram"
                >
                  <span className="text-xl">📷</span>
                </a>
                <a
                  href="https://www.linkedin.com/in/tartantimber/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-lg bg-blue-700/20 hover:bg-blue-700/30 border border-blue-600/30 flex items-center justify-center text-blue-300 hover:text-blue-200 transition-all"
                  title="LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          <p className="text-sm text-slate-400 text-center">
            Join our community and stay updated with the latest networking events and opportunities.
          </p>
        </motion.section>

        {/* Contact */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-blue-600/20 to-indigo-600/20 backdrop-blur-sm border border-white/10 text-white rounded-xl p-6 text-center shadow-xl"
        >
          <Phone className="w-8 h-8 mx-auto mb-3 text-blue-400" />
          <h2 className="text-lg font-bold mb-2">Get In Touch</h2>
          <p className="text-slate-300 text-sm">
            Interested in joining Tartan Talks? Contact us to learn more about membership.
          </p>
        </motion.section>

        {/* Footer */}
        <section className="text-center text-sm text-slate-400 pt-4 pb-8">
          <p>© 2025 Tartan Talks. All rights reserved.</p>
          <p className="mt-2">
            Built by{" "}
            <a
              href="https://www.bear-media.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 font-semibold hover:text-amber-300 transition-colors"
            >
              Bear Media
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
