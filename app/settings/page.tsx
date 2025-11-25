import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import SettingsContent from '@/components/SettingsContent'

export default async function SettingsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Get user profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your account preferences and settings</p>
                </div>
            </div>

            {/* Settings Content */}
            <SettingsContent user={user} profile={profile} />
        </div>
    )
}
