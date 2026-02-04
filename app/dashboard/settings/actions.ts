'use server'

import { createAdminClient } from "@/lib/supabase/admin"

export interface InviteResult {
    success: boolean
    message: string
}

export async function inviteMember(email: string): Promise<InviteResult> {
    const supabase = createAdminClient()

    try {
        const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)

        if (error) {
            console.error(`Error inviting ${email}:`, error)
            return { success: false, message: error.message }
        }

        return { success: true, message: `Invitation sent to ${email}` }
    } catch (error: any) {
        console.error(`Unexpected error inviting ${email}:`, error)
        return { success: false, message: error.message || "Unknown error" }
    }
}

export async function checkServiceRoleKey(): Promise<boolean> {
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    console.log("Checking Service Role Key:", key ? "Found (Starts with " + key.substring(0, 5) + "...)" : "Not Found")
    return !!key
}
