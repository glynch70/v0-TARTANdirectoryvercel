import Link from "next/link"
import Image from "next/image"
import { Users, Building2, Phone, MapPin } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[rgb(20,47,84)] to-[rgb(43,122,120)] text-white pt-12 pb-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6 flex justify-center">
            <Image
              src="/images/tartan-talks-logo-circle.png"
              alt="Tartan Talks"
              width={160}
              height={160}
              className="rounded-full"
            />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Tartan Talks Member Directory</h1>
          <p className="text-lg md:text-xl mb-8 text-white/90 px-4">
            Find trusted local businesses and trades in Edinburgh and the Lothians
          </p>
          <Link
            href="/directory"
            className="inline-block bg-white text-[rgb(20,47,84)] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-colors active:scale-95"
          >
            Browse Directory
          </Link>
        </div>
      </section>

      {/* Value Cards - Mobile Optimized */}
      <section className="py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-[rgb(20,47,84)] rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Professional Network</h3>
              <p className="text-xs text-gray-600">Vetted local businesses</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-[rgb(43,122,120)] rounded-full flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Local Trades</h3>
              <p className="text-xs text-gray-600">Trusted services nearby</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-[rgb(212,175,55)] rounded-full flex items-center justify-center mx-auto mb-3">
                <Phone className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Direct Contact</h3>
              <p className="text-xs text-gray-600">Quick responses</p>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
              <div className="w-12 h-12 bg-[rgb(34,68,54)] rounded-full flex items-center justify-center mx-auto mb-3">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold mb-1">Regional</h3>
              <p className="text-xs text-gray-600">Edinburgh & Lothians</p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">Our Community</h2>
          <p className="text-lg text-gray-700 mb-8">
            Tartan Talks brings together business owners, trades professionals, and service providers across Edinburgh
            and the Lothians. Our members are committed to quality service and building lasting business relationships.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Edinburgh</h3>
              <p className="text-gray-600">Scotland's capital, home to our largest member community</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">West & East Lothian</h3>
              <p className="text-gray-600">Serving Livingston, Bathgate, Linlithgow, and surrounding areas</p>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Growing Network</h3>
              <p className="text-gray-600">Expanding across Central Scotland with trusted professionals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[rgb(20,47,84)] text-white py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/80">© 2025 Tartan Talks. All rights reserved.</p>
          <p className="text-white/60 mt-2">
            Built by{" "}
            <a
              href="https://www.bear-media.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[rgb(212,175,55)] hover:underline"
            >
              Bear Media
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
