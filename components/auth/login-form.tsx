
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

export function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const supabase = createClient()

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            toast.error(error.message)
            setLoading(false)
        } else {
            toast.success('Logged in successfully')
            router.push('/profile')
            router.refresh()
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-2xl text-center text-white">Login</CardTitle>
                <CardDescription className="text-center text-slate-400">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <form onSubmit={handleLogin}>
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
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Login
                    </Button>
                    <div className="w-full flex flex-col items-center gap-2">
                        <span className="text-sm text-slate-400">Don&apos;t have an account?</span>
                        <Link
                            href="/signup"
                            className="flex items-center justify-center w-full h-10 px-4 py-2 text-sm font-medium text-white transition-colors bg-orange-400 hover:bg-orange-500 rounded-md"
                        >
                            Sign Up
                        </Link>
                    </div>
                </CardFooter>
            </form>
        </Card>
    )
}
