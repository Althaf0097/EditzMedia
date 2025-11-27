'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState, Suspense } from 'react'
import { User } from '@supabase/supabase-js'
import { Menu, X, BarChart } from 'lucide-react'
import ProfileDropdown from './ProfileDropdown'
import ThemeToggle from './ThemeToggle'
import SearchBar from './SearchBar'
import Logo from './Logo'

export default function Navbar() {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)
    const [user, setUser] = useState<User | null>(null)
    const [isAdmin, setIsAdmin] = useState(false)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [isScrolled, setIsScrolled] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)

            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('is_admin, avatar_url')
                    .eq('id', user.id)
                    .single() as any
                setIsAdmin(profile?.is_admin || false)
                setAvatarUrl(profile?.avatar_url || null)
            }
        }
        getUser()

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            if (!session?.user) {
                setIsAdmin(false)
                setAvatarUrl(null)
            }
        })

        return () => subscription.unsubscribe()
    }, [supabase])

    if (pathname === '/login' || pathname.startsWith('/admin/login')) return null

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-md border-b border-gray-200/50 dark:border-gray-800/50'
                : 'bg-white dark:bg-gray-900 border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <div className="flex-shrink-0 flex items-center transform hover:scale-105 transition-transform duration-200">
                            <Logo />
                        </div>
                        <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
                            <NavLink href="/images" active={pathname === '/images'}>Images</NavLink>
                            <NavLink href="/videos" active={pathname === '/videos'}>Videos</NavLink>
                            {user && (
                                <NavLink href="/saved" active={pathname === '/saved'}>Saved</NavLink>
                            )}
                        </div>
                    </div>

                    {/* Search Bar - Desktop */}
                    <div className="hidden md:flex flex-1 items-center justify-center px-8">
                        <Suspense fallback={<div className="w-full sm:w-80 h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />}>
                            <SearchBar />
                        </Suspense>
                    </div>

                    <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2">
                        <div className="hover:rotate-12 transition-transform duration-300" suppressHydrationWarning>
                            <ThemeToggle />
                        </div>
                        {user ? (
                            <>
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 hover:bg-blue-100 dark:hover:bg-blue-900 transition-all hover:shadow-md hover:-translate-y-0.5"
                                    >
                                        <BarChart className="w-4 h-4 mr-2" />
                                        Dashboard
                                    </Link>
                                )}
                                <ProfileDropdown user={user} isAdmin={isAdmin} avatarUrl={avatarUrl} />
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors hover:underline decoration-2 underline-offset-4"
                                >
                                    Log in
                                </Link>
                                <Link
                                    href="/login?view=signup"
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:scale-95"
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
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 ml-2 transition-transform active:scale-95"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? (
                                <X className="block h-6 w-6 animate-spin-in" aria-hidden="true" />
                            ) : (
                                <Menu className="block h-6 w-6 animate-scale-in" aria-hidden="true" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu - Modal Popup */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal */}
                    <div className="fixed inset-x-4 top-20 z-50 animate-slide-up">
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                            {/* Mobile Search Bar */}
                            <div className="px-4 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
                                <Suspense fallback={<div className="w-full h-10 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse" />}>
                                    <SearchBar />
                                </Suspense>
                            </div>

                            {/* Navigation Links */}
                            <div className="py-2">
                                <MobileNavLink href="/images" active={pathname === '/images'} onClick={() => setIsOpen(false)}>
                                    Images
                                </MobileNavLink>
                                <MobileNavLink href="/videos" active={pathname === '/videos'} onClick={() => setIsOpen(false)}>
                                    Videos
                                </MobileNavLink>
                                {user && (
                                    <>
                                        <MobileNavLink href="/saved" active={pathname === '/saved'} onClick={() => setIsOpen(false)}>
                                            Saved Items
                                        </MobileNavLink>
                                        <MobileNavLink href="/profile" active={pathname === '/profile'} onClick={() => setIsOpen(false)}>
                                            My Profile
                                        </MobileNavLink>
                                        {isAdmin && (
                                            <MobileNavLink href="/admin" active={pathname.startsWith('/admin')} onClick={() => setIsOpen(false)}>
                                                Admin Dashboard
                                            </MobileNavLink>
                                        )}
                                    </>
                                )}
                            </div>

                            {/* User Section */}
                            {user ? (
                                <div className="border-t border-gray-200 dark:border-gray-800 p-4">
                                    <button
                                        onClick={async () => {
                                            await supabase.auth.signOut()
                                            setIsOpen(false)
                                            window.location.href = '/login'
                                        }}
                                        className="w-full px-4 py-3 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold rounded-xl hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="border-t border-gray-200 dark:border-gray-800 p-4 space-y-2">
                                    <Link
                                        href="/login"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center px-4 py-3 border border-gray-300 dark:border-gray-700 shadow-sm font-medium rounded-xl text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/login?view=signup"
                                        onClick={() => setIsOpen(false)}
                                        className="block w-full text-center px-4 py-3 shadow-sm font-medium rounded-xl text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                                    >
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </nav>
    )
}

function NavLink({ href, active, children }: { href: string, active: boolean, children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={`relative inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors group ${active
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
        >
            {children}
            <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-left transition-transform duration-300 ${active ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`} />
        </Link>
    )
}

function MobileNavLink({ href, active, children, onClick }: { href: string, active: boolean, children: React.ReactNode, onClick?: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`block px-4 py-3 text-base font-medium transition-all duration-200 rounded-xl mx-2 ${active
                ? 'bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-400'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
        >
            {children}
        </Link>
    )
}
