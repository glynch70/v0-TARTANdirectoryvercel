"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Users, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import Image from "next/image"
import { toast } from "sonner"

interface Event {
    event_id: string
    event_name: string
    event_date: string
    location: string
    description: string
    image_url: string | null
    capacity: number
}

export function UpcomingEvents() {
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [rsvpStatuses, setRsvpStatuses] = useState<Record<string, 'going' | null>>({})
    const [attendeeCounts, setAttendeeCounts] = useState<Record<string, number>>({})
    const [processingId, setProcessingId] = useState<string | null>(null)

    const supabase = createClient()

    useEffect(() => {
        const fetchEvents = async () => {
            const now = new Date().toISOString()
            const { data: eventsData, error } = await supabase
                .from('events')
                .select('*')
                .gte('event_date', now)
                .order('event_date', { ascending: true })
                .limit(2)

            if (error) {
                console.error("Error fetching events:", error)
            } else if (eventsData) {
                setEvents(eventsData)

                const { data: { user } } = await supabase.auth.getUser()

                const newCounts: Record<string, number> = {}
                const newStatuses: Record<string, 'going' | null> = {}

                for (const event of eventsData) {
                    const { count } = await supabase
                        .from('event_rsvps')
                        .select('*', { count: 'exact', head: true })
                        .eq('event_id', event.event_id)

                    newCounts[event.event_id] = count || 0

                    if (user) {
                        const { data: rsvp } = await supabase
                            .from('event_rsvps')
                            .select('status')
                            .eq('event_id', event.event_id)
                            .eq('member_id', user.id)
                            .single()

                        if (rsvp) newStatuses[event.event_id] = rsvp.status as 'going'
                    }
                }
                setAttendeeCounts(newCounts)
                setRsvpStatuses(newStatuses)
            }
            setLoading(false)
        }

        fetchEvents()
    }, [supabase])

    const handleRSVP = async (event: Event) => {
        setProcessingId(event.event_id)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            toast.error("You must be logged in to RSVP")
            setProcessingId(null)
            return
        }

        const currentStatus = rsvpStatuses[event.event_id]

        try {
            if (currentStatus === 'going') {
                const { error } = await supabase
                    .from('event_rsvps')
                    .delete()
                    .eq('event_id', event.event_id)
                    .eq('member_id', user.id)

                if (error) throw error
                setRsvpStatuses(prev => ({ ...prev, [event.event_id]: null }))
                setAttendeeCounts(prev => ({ ...prev, [event.event_id]: Math.max(0, (prev[event.event_id] || 1) - 1) }))
                toast.success("RSVP cancelled")
            } else {
                const { error } = await supabase
                    .from('event_rsvps')
                    .insert({
                        event_id: event.event_id,
                        member_id: user.id,
                        status: 'going'
                    })

                if (error) throw error
                setRsvpStatuses(prev => ({ ...prev, [event.event_id]: 'going' }))
                setAttendeeCounts(prev => ({ ...prev, [event.event_id]: (prev[event.event_id] || 0) + 1 }))
                toast.success("You're going!")
            }
        } catch (error: any) {
            console.error("RSVP Error:", error)
            toast.error(error.message || "Failed to update RSVP")
        } finally {
            setProcessingId(null)
        }
    }

    if (loading) return <div className="h-48 rounded-xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
    if (events.length === 0) return null

    return (
        <div className="space-y-4">
            {events.map(event => {
                const eventDate = new Date(event.event_date)
                const isGoing = rsvpStatuses[event.event_id] === 'going'
                const isProcessing = processingId === event.event_id

                return (
                    <Card key={event.event_id} className="overflow-hidden border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-950">
                        <div className="md:flex">
                            {event.image_url && (
                                <div className="relative h-48 md:h-auto md:w-1/3 min-h-[200px]">
                                    <Image
                                        src={event.image_url}
                                        alt={event.event_name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div className={event.image_url ? "md:w-2/3" : "w-full"}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="text-sm font-semibold text-teal-600 dark:text-teal-400 mb-1 tracking-wide uppercase">
                                                Upcoming Event
                                            </div>
                                            <CardTitle className="text-2xl font-display text-slate-900 dark:text-slate-100">{event.event_name}</CardTitle>
                                        </div>
                                        {isGoing && (
                                            <div className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm font-medium">
                                                <CheckCircle className="w-4 h-4" />
                                                Going
                                            </div>
                                        )}
                                    </div>
                                    <CardDescription className="line-clamp-2 mt-2 text-teal-500/80">
                                        {event.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                        <Calendar className="w-4 h-4 text-orange-500" />
                                        <span className="font-medium">
                                            {eventDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                        <Clock className="w-4 h-4 text-orange-500" />
                                        <span>
                                            {eventDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                        <MapPin className="w-4 h-4 text-orange-500" />
                                        <span>{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                                        <Users className="w-4 h-4 text-orange-500" />
                                        <span>{attendeeCounts[event.event_id] || 0} going</span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        onClick={() => handleRSVP(event)}
                                        disabled={isProcessing}
                                        className={`w-full md:w-auto ${isGoing ? 'bg-slate-200 text-slate-800 hover:bg-slate-300' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}
                                    >
                                        {isProcessing ? "Updating..." : isGoing ? "Cancel RSVP" : "RSVP Now"}
                                    </Button>
                                </CardFooter>
                            </div>
                        </div>
                    </Card>
                )
            })}
        </div>
    )
}
