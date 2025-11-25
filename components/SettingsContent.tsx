'use client'

import { useState, useEffect } from 'react'
import { Palette, User as UserIcon, Shield, Info, Sun, Moon, Monitor } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useTheme } from './ThemeProvider'

interface SettingsContentProps {
    user: {
        id: string
        email?: string
        created_at: string
        user_metadata: {
            display_name?: string
        }
    }
    profile: {
        display_name?: string
        is_admin: boolean
    } | null
}

export default function SettingsContent({ user, profile }: SettingsContentProps) {
    const [activeTab, setActiveTab] = useState('appearance')
    const { theme, setTheme, resolvedTheme } = useTheme()

    const tabs = [
        { id: 'appearance', name: 'Appearance', icon: Palette },
        { id: 'account', name: 'Account', icon: UserIcon },
        { id: 'security', name: 'Security', icon: Shield },
        { id: 'about', name: 'About', icon: Info },
    ]

    const themeOptions = [
        { value: 'light', label: 'Light', icon: Sun, desc: 'Light mode' },
        { value: 'dark', label: 'Dark', icon: Moon, desc: 'Dark mode' },
        { value: 'system', label: 'System', icon: Monitor, desc: 'Follow system preference' },
    ]

    const [isEditingName, setIsEditingName] = useState(false)
    const [newName, setNewName] = useState(profile?.display_name || '')
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()
    const router = useRouter()

    const handleUpdateName = async () => {
        if (!newName.trim()) return
        setIsLoading(true)
        try {
            // @ts-ignore
            const { error } = await supabase
                .from('profiles')
                .update({ display_name: newName } as any)
                .eq('id', user.id)

            if (error) throw error

            setIsEditingName(false)
            router.refresh()
        } catch (error) {
            console.error('Error updating name:', error)
            alert('Failed to update name')
        } finally {
            setIsLoading(false)
        }
    }

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const joinDate = mounted ? new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    }) : ''

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                    <nav className="flex -mb-px">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                                        ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.name}
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Tab Content */}
                <div className="p-6">
                    {activeTab === 'appearance' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Theme</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Select your preferred theme</p>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    {themeOptions.map((option) => {
                                        const Icon = option.icon
                                        return (
                                            <button
                                                key={option.value}
                                                onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                                                className={`relative flex flex-col items-center p-4 rounded-lg border-2 transition-all ${theme === option.value
                                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950'
                                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                                                    }`}
                                            >
                                                <Icon className={`w-8 h-8 mb-2 ${theme === option.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`} />
                                                <span className={`font-medium ${theme === option.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                                    {option.label}
                                                </span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">{option.desc}</span>
                                                {theme === option.value && (
                                                    <div className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                                                )}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Preview */}
                            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview</h4>
                                <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Current theme: <span className="font-semibold text-gray-900 dark:text-gray-100">{resolvedTheme === 'dark' ? 'Dark' : 'Light'}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Information</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Name</span>
                                        {isEditingName ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="text"
                                                    value={newName}
                                                    onChange={(e) => setNewName(e.target.value)}
                                                    className="text-sm border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                />
                                                <button
                                                    onClick={handleUpdateName}
                                                    disabled={isLoading}
                                                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded transition-colors disabled:opacity-50"
                                                >
                                                    {isLoading ? 'Saving...' : 'Save'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingName(false)
                                                        setNewName(profile?.display_name || '')
                                                    }}
                                                    disabled={isLoading}
                                                    className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 px-2"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-4">
                                                <span className="text-sm text-gray-900 dark:text-gray-100">{profile?.display_name || 'Not set'}</span>
                                                <button
                                                    onClick={() => setIsEditingName(true)}
                                                    className="text-xs text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{user.email}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</span>
                                        <span className={`text-sm px-2 py-1 rounded-full ${profile?.is_admin ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                            {profile?.is_admin ? 'Admin' : 'User'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">{joinDate}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Security</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Manage your account security settings</p>
                                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Password management and security features coming soon.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'about' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">About MediaEditz</h3>
                                <div className="space-y-4">
                                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 rounded-lg border border-indigo-200 dark:border-indigo-800">
                                        <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-2">MediaEditz Platform</h4>
                                        <p className="text-sm text-indigo-700 dark:text-indigo-300">
                                            Your premium stock media platform for high-quality images and videos.
                                        </p>
                                    </div>
                                    <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-700">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Version</span>
                                        <span className="text-sm text-gray-900 dark:text-gray-100">1.0.0</span>
                                    </div>
                                    <div className="flex justify-between items-center py-3">
                                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                                        <span className="text-sm px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">Active</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
