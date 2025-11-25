'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { Menu, X, BarChart } from 'lucide-react'
import ProfileDropdown from './ProfileDropdown'
import ThemeToggle from './ThemeToggle'
import Logo from './Logo'

export default function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single()
                setIsAdmin(profile?.is_admin || false)
            }
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (!session?.user) setIsAdmin(false)
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    if (pathname === '/login' || pathname.startsWith('/admin/login')) return null

    return (
        <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 transition-colors">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <Logo />
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <Link
                                href="/images"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${pathname === '/images'
                                    ? 'border-blue-600 text-gray-900 dark:text-gray-100'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700'
                                    }`}
                            >
                                Images
                            </Link>
                            <Link
                                href="/videos"
                                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${pathname === '/videos'
                                    ? 'border-blue-600 text-gray-900 dark:text-gray-100'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700'
                                    }`}
                            >
                                Videos
                            </Link>
                            {user && (
                                <Link
                                    href="/saved"
                                    className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors ${pathname === '/saved'
                                        ? 'border-blue-600 text-gray-900 dark:text-gray-100'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700'
                                        }`}
                                >
                                    Saved
                                </Link>
                            )}
                        </div>
                    </div>
                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
                        <ThemeToggle />
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                                    >
                                        <BarChart className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                )}
                                <ProfileDropdown user={user} isAdmin={isAdmin} />
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/login?view=signup"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm hover:shadow-md"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="-mr-2 flex items-center sm:hidden">
                        <ThemeToggle />
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ml-2"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800`}>
                <div className="pt-2 pb-3 space-y-1">
                    <Link
                        href="/images"
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/images'
                            ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Images
                    </Link>
                    <Link
                        href="/videos"
                        className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/videos'
                            ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-400'
                            : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                            }`}
                    >
                        Videos
                    </Link>
                    {user && (
                        <>
                            <Link
                                href="/saved"
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/saved'
                                    ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                Saved Items
                            </Link>
                            <Link
                                href="/profile"
                                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname === '/profile'
                                    ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                                    }`}
                            >
                                My Profile
                            </Link>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${pathname.startsWith('/admin')
                                        ? 'bg-blue-50 dark:bg-blue-950 border-blue-500 text-blue-700 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:text-gray-700 dark:hover:text-gray-300'
                                        }`}
                                >
                                    Admin Dashboard
                                </Link>
                            )}
                        </>
                    )}
                </div>
                {!user && (
                    <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
                        <div className="mt-3 space-y-1 px-4">
                            <Link
                                href="/login"
                                className="block w-full text-center px-4 py-2 border border-gray-300 dark:border-gray-700 shadow-sm text-base font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/login?view=signup"
                                className="block w-full text-center mt-3 px-4 py-2 border border-transparent shadow-sm text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500"
                            >
                                Sign up
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}
