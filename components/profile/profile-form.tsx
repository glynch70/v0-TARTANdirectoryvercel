
'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { type User } from '@supabase/supabase-js'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CATEGORIES = [
    "Construction & Building",
    "Electrical, Gas & Renewables",
    "Finance & Legal",
    "Technology & Digital",
    "Property, Cleaning & Maintenance",
    "Health & Wellbeing",
    "Recruitment & HR",
    "Estate Agency & Property Services",
    "Other Services"
]

export function ProfileForm({ user }: { user: User }) {
    const [loading, setLoading] = useState(false)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [company, setCompany] = useState('')
    const [trade, setTrade] = useState('')
    const [phone, setPhone] = useState('')
    const [website, setWebsite] = useState('')
    const [location, setLocation] = useState('')
    const [category, setCategory] = useState('')

    const supabase = createClient()

    useEffect(() => {
        const getProfile = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from('members')
                .select('*')
                .eq('member_id', user.id)
                .single()

            if (error && error.code !== 'PGRST116') {
                toast.error('Error loading profile')
            } else if (data) {
                setFirstName(data.first_name || '')
                setLastName(data.last_name || '')
                setCompany(data.company || '')
                setTrade(data.trade || '')
                setPhone(data.phone || '')
                setWebsite(data.website || '')
                setLocation(data.location || '')
                setCategory(data.category || '')
            }
            setLoading(false)
        }

        getProfile()
    }, [user, supabase])

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const updates = {
            member_id: user.id,
            first_name: firstName,
            last_name: lastName,
            company,
            trade,
            phone,
            website,
            location,
            category,
            email: user.email, // Ensure email is kept in sync
            updated_at: new Date().toISOString(),
        }

        const { error } = await supabase.from('members').upsert(updates)

        if (error) {
            toast.error(error.message)
        } else {
            toast.success('Profile updated successfully')
        }
        setLoading(false)
    }

    return (
        <Card className="w-full max-w-2xl mx-auto bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="text-white">Your Profile</CardTitle>
                <CardDescription className="text-slate-400">Update your personal information to share with the network</CardDescription>
            </CardHeader>
            <form onSubmit={updateProfile}>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName" className="text-slate-300">First Name</Label>
                            <Input
                                id="firstName"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName" className="text-slate-300">Last Name</Label>
                            <Input
                                id="lastName"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="company" className="text-slate-300">Company</Label>
                        <Input
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="trade" className="text-slate-300">Trade / Service</Label>
                        <Input
                            id="trade"
                            value={trade}
                            onChange={(e) => setTrade(e.target.value)}
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-300">Phone</Label>
                            <Input
                                id="phone"
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location" className="text-slate-300">Location</Label>
                            <Input
                                id="location"
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                            />
                        </div>
                    </div>


                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-slate-300">Business Category</Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="bg-slate-900/50 border-slate-600 text-white">
                                <SelectValue placeholder="Select a category" className="text-slate-400" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-slate-700 z-[100] text-white">
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat} className="focus:bg-slate-700 focus:text-white">
                                        {cat}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="website" className="text-slate-300">Website</Label>
                        <Input
                            id="website"
                            type="url"
                            placeholder="https://..."
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                            className="bg-slate-900/50 border-slate-600 text-white placeholder:text-slate-500"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={loading} className="bg-orange-500 hover:bg-orange-600 text-white">
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Save Changes
                    </Button>
                </CardFooter>
            </form>
        </Card >
    )
}
