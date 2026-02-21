"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Users, Mail, Loader2, CheckCircle, AlertTriangle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { inviteMember, checkServiceRoleKey } from "./actions"
import { useEffect } from "react"

export default function SettingsPage() {
  const [inviteEmail, setInviteEmail] = useState("")
  const [invitePlan, setInvitePlan] = useState<string>("one-off")
  const [isInviting, setIsInviting] = useState(false)
  const [keyValid, setKeyValid] = useState(false)

  useEffect(() => {
    checkServiceRoleKey().then(setKeyValid)
  }, [])

  // Mock Admin User Data
  const adminUser = {
    email: "admin@tartantalks.co.uk",
    role: "Super Admin",
    created_at: "2024-01-15T09:00:00Z",
  }

  const handleSendInvite = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address")
      return
    }

    setIsInviting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))

    toast.success(`Invitation sent to ${inviteEmail}`, {
      description: `Plan: ${invitePlan.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} Payment`
    })

    setInviteEmail("")
    setIsInviting(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Account Info */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Your admin account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{adminUser.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Role</p>
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0">{adminUser.role}</Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Account Created</p>
              <p className="font-medium">{new Date(adminUser.created_at).toLocaleDateString("en-GB")}</p>
            </div>
          </CardContent>
        </Card>

        {/* Role Permissions */}
        <Card>
          <CardHeader>
            <CardTitle>Role Permissions</CardTitle>
            <CardDescription>What you can do with your {adminUser.role} role</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span>Full access to all features</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span>Create, edit, and delete members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span>Manage events and attendance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span>Send messages to members</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-500 rounded-full" />
                <span>Manage admin users</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invite New Client */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg">
              <Mail className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <CardTitle>Invite New Client</CardTitle>
              <CardDescription className="text-slate-500">Send an invitation to join the network</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col xl:flex-row gap-4 xl:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="email">Client Email Address</Label>
              <Input
                id="email"
                placeholder="client@example.com"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="bg-white"
              />
            </div>
            <div className="flex-1 xl:max-w-[300px] space-y-2">
              <Label htmlFor="plan">Payment Plan</Label>
              <Select value={invitePlan} onValueChange={setInvitePlan}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select a plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one-off">One-off Payment</SelectItem>
                  <SelectItem value="two-plan">Two-Payment Plan</SelectItem>
                  <SelectItem value="three-plan">Three-Payment Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              onClick={handleSendInvite}
              disabled={isInviting}
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[140px]"
            >
              {isInviting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Send Invite
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Member Onboarding / Migration */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle>Member Onboarding</CardTitle>
              <CardDescription className="text-slate-500">Migrate existing members to authenticated users</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <p className="font-medium text-slate-700">Database Migration</p>
                <p className="text-sm text-slate-500">Send invites to members who haven't logged in yet.</p>
              </div>
              <Button variant="outline" onClick={() => toast.info("Analyzing members...")} disabled>
                Check Status
              </Button>
            </div>

            {!keyValid && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200 text-sm text-yellow-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <strong>Safety Check:</strong> This feature requires the <code>SUPABASE_SERVICE_ROLE_KEY</code> to be configured in your environment variables.
                </div>
              </div>
            )}

            <MigrationTool />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MigrationTool() {
  const [inviting, setInviting] = useState(false)
  const [testEmail, setTestEmail] = useState("")
  const [isTestInviting, setIsTestInviting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [total, setTotal] = useState(0)
  const [results, setResults] = useState<{ success: number, failed: number }>({ success: 0, failed: 0 })

  const handleBulkInvite = async () => {
    setInviting(true)
    setProgress(0)
    setResults({ success: 0, failed: 0 })

    // Create Supabase Client (Browser Context)
    const supabase = createClient()

    try {
      // 1. Fetch all members with emails
      const { data: members, error } = await supabase
        .from('members')
        .select('email')
        .not('email', 'is', null)

      if (error) throw error
      if (!members || members.length === 0) {
        toast.info("No members found to invite.")
        setInviting(false)
        return
      }

      const uniqueEmails = Array.from(new Set(members.map(m => m.email).filter(Boolean)))
      setTotal(uniqueEmails.length)

      let processed = 0
      let successCount = 0
      let failCount = 0

      // 2. Iterate and Invite
      for (const email of uniqueEmails) {
        // Call the Server Action
        const result = await inviteMember(email as string)

        if (result.success) {
          successCount++
        } else {
          failCount++
          console.warn(`Failed to invite ${email}: ${result.message}`)
        }

        processed++
        setProgress(Math.round((processed / uniqueEmails.length) * 100))
      }

      setResults({ success: successCount, failed: failCount })
      toast.success(`Migration Complete: ${successCount} sent, ${failCount} failed/skipped.`)

    } catch (error: any) {
      toast.error("Migration failed: " + error.message)
    } finally {
      setInviting(false)
    }
  }

  const handleTestInvite = async () => {
    if (!testEmail) {
      toast.error("Please enter a test email address")
      return
    }
    setIsTestInviting(true)
    try {
      const result = await inviteMember(testEmail)
      if (result.success) {
        toast.success(result.message)
        setTestEmail("")
      } else {
        toast.error(result.message)
      }
    } catch (error: any) {
      toast.error("Test invite failed: " + error.message)
    } finally {
      setIsTestInviting(false)
    }
  }

  return (
    <div className="mt-4 space-y-4">
      {/* Test Invite Section */}
      <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-2">Test Run</h3>
        <div className="flex gap-2">
          <Input
            placeholder="Enter test email (e.g. your email)"
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            className="bg-white"
          />
          <Button
            onClick={handleTestInvite}
            disabled={isTestInviting || inviting}
            className="bg-purple-600 hover:bg-purple-700 text-white shrink-0"
          >
            {isTestInviting ? <Loader2 className="w-4 h-4 animate-spin my-auto" /> : <Mail className="w-4 h-4 mr-2 my-auto" />}
            <span className="ml-2">Send Test</span>
          </Button>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Use this to verify the email delivery and password reset flow before running the bulk invite.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={handleBulkInvite} disabled={inviting} className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white">
          {inviting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing ({progress}%)
            </>
          ) : (
            "Start Bulk Invite Process"
          )}
        </Button>
        {inviting && (
          <span className="text-sm text-slate-500">{progress}% complete</span>
        )}
      </div>

      {/* Progress Bar */}
      {inviting && (
        <div className="w-full bg-slate-100 rounded-full h-2.5">
          <div className="bg-purple-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
        </div>
      )}

      {/* Results Summary */}
      {!inviting && results.success > 0 && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          <span>Success: <strong>{results.success}</strong> invitations sent. ({results.failed} skipped/failed)</span>
        </div>
      )}
    </div>
  )
}
