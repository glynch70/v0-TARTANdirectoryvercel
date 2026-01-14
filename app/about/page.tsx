import { Users, Target, Heart, Phone } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">About</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-6 space-y-8">
        {/* Intro */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-3">Tartan Talks</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Tartan Talks is a professional networking community connecting trusted businesses and trades across
            Edinburgh and the Lothians. We bring together business owners, trades professionals, and service providers
            committed to quality and lasting relationships.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Our "Fixers & Mixers" tagline reflects our dual focus: bringing together skilled professionals (fixers) in a
            collaborative networking environment (mixers).
          </p>
        </section>

        {/* Values */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 mb-4">What We Stand For</h2>

          <div className="flex gap-3">
            <div className="w-10 h-10 bg-[rgb(20,47,84)] rounded-lg flex items-center justify-center flex-shrink-0">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Quality Service</h3>
              <p className="text-sm text-gray-700">All members are committed to delivering exceptional work</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 bg-[rgb(43,122,120)] rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Community First</h3>
              <p className="text-sm text-gray-700">Building relationships and supporting local businesses</p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 bg-[rgb(212,175,55)] rounded-lg flex items-center justify-center flex-shrink-0">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Trust & Integrity</h3>
              <p className="text-sm text-gray-700">Members you can rely on for honest, professional service</p>
            </div>
          </div>
        </section>

        {/* Coverage */}
        <section>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Our Coverage</h2>
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">Edinburgh</h3>
              <p className="text-sm text-gray-700">Scotland's capital and our largest member community</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">West Lothian</h3>
              <p className="text-sm text-gray-700">Livingston, Bathgate, Linlithgow, and surrounding areas</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-1">East Lothian</h3>
              <p className="text-sm text-gray-700">Haddington, North Berwick, Dunbar, and more</p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-[rgb(20,47,84)] text-white rounded-xl p-6 text-center">
          <Phone className="w-8 h-8 mx-auto mb-3" />
          <h2 className="text-lg font-bold mb-2">Get In Touch</h2>
          <p className="text-white/90 text-sm">
            Interested in joining Tartan Talks? Contact us to learn more about membership.
          </p>
        </section>

        {/* Footer */}
        <section className="text-center text-sm text-gray-600 pt-4">
          <p>© 2025 Tartan Talks. All rights reserved.</p>
          <p className="mt-2">
            Built by{" "}
            <a
              href="https://www.bear-media.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgb(212,175,55)] font-semibold"
            >
              Bear Media
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
