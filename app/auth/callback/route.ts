import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/profile'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)
        if (!error) {
            const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
            const isLocalEnv = process.env.NODE_ENV === 'development'

            // Check if profile is complete
            let finalNext = next
            if (next === '/profile') {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data: member } = await supabase
                        .from('members')
                        .select('member_id')
                        .eq('member_id', user.id)
                        .single()

                    if (member) {
                        finalNext = '/'
                    }
                }
            }

            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${finalNext}`)
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${finalNext}`)
            } else {
                return NextResponse.redirect(`${origin}${finalNext}`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
