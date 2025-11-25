'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { User, Loader2 } from 'lucide-react'

interface ProfileEditFormProps {
    userId: string
    initialDisplayName: string
    email: string
}

export default function ProfileEditForm({ userId, initialDisplayName, email }: ProfileEditFormProps) {
    const [displayName, setDisplayName] = useState(initialDisplayName)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleSave = async () => {
        if (!displayName.trim()) {
            setMessage({ type: 'error', text: 'Display name cannot be empty' })
            return
        }

        setLoading(true)
        setMessage(null)

        try {
            const { error } = await supabase
                .from('profiles')
                // @ts-ignore - Supabase generated types are too strict
                .update({ display_name: displayName.trim() })
                .eq('id', userId)

            if (error) throw error

            setMessage({ type: 'success', text: 'Profile updated successfully!' })
            setIsEditing(false)
            router.refresh()
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Failed to update profile' })
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        setDisplayName(initialDisplayName)
        setIsEditing(false)
        setMessage(null)
    }

    if (!isEditing) {
        return (
            <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                <div className="flex-1">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Name</span>
                    <p className="text-sm text-gray-900 dark:text-white mt-1">{displayName}</p>
                </div>
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                    Edit
                </button>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <div className="py-3 border-b border-gray-100 dark:border-gray-700">
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    Display Name
                </label>
                <input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter your display name"
                />
            </div>

            {message && (
                <div className={`p-3 rounded-lg text-sm ${message.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="flex items-center gap-3">
                <button
                    onClick={handleSave}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 text-sm font-medium"
                >
                    Cancel
                </button>
            </div>
        </div>
    )
}
