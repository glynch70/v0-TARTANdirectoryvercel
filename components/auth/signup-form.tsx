'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function SignupForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else {
            toast.success('Check your email to confirm your account')
            setLoading(false)
            // Optionally redirect to a confirmation page
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-slate-800/50 border-slate-700 backdrop-blur-sm text-white">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-white">Sign Up</CardTitle>
                <CardDescription className="text-center text-slate-400">Create an account to join the network</CardDescription>
            </CardHeader>
            <form onSubmit={handleSignup}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-slate-300">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-slate-300">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="bg-slate-900/50 border-slate-600 text-white"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Sign Up
                    </Button>
                    <div className="w-full flex flex-col items-center gap-2">
                        <span className="text-sm text-slate-400">Already have an account?</span>
                        <Link
                            href="/login"
                            className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-400 hover:bg-orange-500 rounded-md"
                        >
                            Login
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
