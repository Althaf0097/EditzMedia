import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ArrowLeft, Heart, Calendar, Upload, Settings, User } from 'lucide-react'
import Link from 'next/link'
import ProfileEditForm from '@/components/ProfileEditForm'
import AvatarUpload from '@/components/AvatarUpload'

export default async function ProfilePage() {
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
        .single() as { data: { display_name?: string; is_admin?: boolean; avatar_url?: string } | null }

    // Get saved items count
    const { count: savedCount } = await supabase
        .from('saved_items')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    // Get uploads count if admin
    const { count: uploadsCount } = await supabase
        .from('media_assets')
        .select('*', { count: 'exact', head: true })
        .eq('uploader_id', user.id)

    const displayName = profile?.display_name || user.email?.split('@')[0] || 'User'
    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
    })

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 animate-slide-down">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-4 hover:-translate-x-1"
                    >
                        <ArrowLeft className="w-4 h-4 mr-1" />
                        Back to Home
                    </Link>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden animate-scale-in">
                    {/* Profile Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-32 animate-shimmer"></div>
                    <div className="px-6 pb-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-16 mb-6">
                            <div className="animate-bounce-in">
                                <AvatarUpload
                                    userId={user.id}
                                    currentAvatarUrl={profile?.avatar_url}
                                />
                            </div>
                            <div className="flex-1 animate-slide-up stagger-1 opacity-0" style={{ animationFillMode: 'forwards' }}>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{displayName}</h1>
                                <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-slide-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                        <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">{savedCount || 0}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Saved Items</p>
                                    </div>
                                </div>
                            </div>

                            {profile?.is_admin && (
                                <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-slide-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                            <Upload className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">{uploadsCount || 0}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">Uploads</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4 border border-gray-200 dark:border-gray-700 animate-slide-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
                                <div className="flex items-center gap-3">
                                    <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                        <Calendar className="w-5 h-5 text-green-600 dark:text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-gray-900 dark:text-white">{joinDate}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Joined</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account Info */}
                        <div className="mt-8 space-y-4 animate-slide-up opacity-0 stagger-5" style={{ animationFillMode: 'forwards' }}>
                            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Account Information</h2>
                            <div className="space-y-3">
                                <ProfileEditForm
                                    userId={user.id}
                                    initialDisplayName={displayName}
                                    email={user.email || ''}
                                />
                                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</span>
                                    <span className="text-sm text-gray-900 dark:text-white">{user.email}</span>
                                </div>
                                <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Account Type</span>
                                    <span className={`text-sm px-2 py-1 rounded-full ${profile?.is_admin ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                                        {profile?.is_admin ? 'Admin' : 'User'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-slide-up opacity-0 stagger-5" style={{ animationFillMode: 'forwards', animationDelay: '0.6s' }}>
                            <Link
                                href="/saved"
                                className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group hover:shadow-md hover:-translate-y-1"
                            >
                                <div className="flex items-center gap-3">
                                    <Heart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    <span className="font-medium text-gray-900 dark:text-white">View Saved Items</span>
                                </div>
                                <ArrowLeft className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 rotate-180 transition-transform group-hover:translate-x-1" />
                            </Link>

                            {profile?.is_admin && (
                                <Link
                                    href="/admin"
                                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all group hover:shadow-md hover:-translate-y-1"
                                >
                                    <div className="flex items-center gap-3">
                                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        <span className="font-medium text-gray-900 dark:text-white">Admin Dashboard</span>
                                    </div>
                                    <ArrowLeft className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 rotate-180 transition-transform group-hover:translate-x-1" />
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
