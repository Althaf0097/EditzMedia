import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protected routes - Homepage requires login
    if (!user && request.nextUrl.pathname === '/') {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // Admin routes - Require authentication AND admin status
    if (request.nextUrl.pathname.startsWith('/admin')) {
        // First check if user is logged in
        if (!user) {
            return NextResponse.redirect(new URL('/login', request.url))
        }

        // Then check if user is admin (database check)
        // Note: This query might fail if RLS is enabled, so we handle errors gracefully
        try {
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single()

            // If query failed or user is not admin, redirect to homepage
            if (error || !profile?.is_admin) {
                return NextResponse.redirect(new URL('/', request.url))
            }
        } catch (error) {
            // If any error occurs (including RLS blocking), redirect to homepage
            console.error('Middleware admin check error:', error)
            return NextResponse.redirect(new URL('/', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
