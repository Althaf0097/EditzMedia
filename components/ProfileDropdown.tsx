'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { User, Settings, Heart, LogOut, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ProfileDropdownProps {
    user: {
        email?: string
        user_metadata: {
            display_name?: string
        }
    }
    isAdmin: boolean
}

export default function ProfileDropdown({ user, isAdmin }: ProfileDropdownProps) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const supabase = createClient()
    const router = useRouter()

    const displayName = user.user_metadata.display_name || user.email?.split('@')[0] || 'User'
    const initial = displayName[0].toUpperCase()

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.push('/')
        router.refresh()
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {initial}
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                    {/* User Info Header */}
                    <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {initial}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{displayName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                        <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="flex items-center">
                                <User className="mr-3 h-4 w-4" />
                                My Profile
                            </div>
                        </Link>
                        <Link
                            href="/saved"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="flex items-center">
                                <Heart className="mr-3 h-4 w-4" />
                                Saved Items
                            </div>
                        </Link>
                        <Link
                            href="/settings"
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/50 hover:text-blue-600 dark:hover:text-blue-400"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                        >
                            <div className="flex items-center">
                                <Settings className="mr-3 h-4 w-4" />
                                Settings
                            </div>
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                            <button
                                onClick={handleSignOut}
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400"
                                role="menuitem"
                            >
                                <div className="flex items-center">
                                    <LogOut className="mr-3 h-4 w-4" />
                                    Sign out
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
