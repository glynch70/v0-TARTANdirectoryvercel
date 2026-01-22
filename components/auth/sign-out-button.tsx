"use client"

import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LogOut } from "lucide-react"
import { toast } from "sonner"

export function SignOutButton({ className = "" }: { className?: string }) {
    const router = useRouter()
    const supabase = createClient()

    const handleSignOut = async () => {
        try {
            const { error } = await supabase.auth.signOut()
            if (error) throw error

            toast.success("Signed out successfully")
            router.push("/login")
            router.refresh()
        } catch (error) {
            console.error("Error signing out:", error)
            toast.error("Error signing out")
        }
    }

    return (
        <button
            onClick={handleSignOut}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ${className}`}
        >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
        </button>
    )
}
