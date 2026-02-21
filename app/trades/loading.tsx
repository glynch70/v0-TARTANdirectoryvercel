export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-[rgb(20,47,84)] rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading trades...</p>
      </div>
    </div>
  )
}
