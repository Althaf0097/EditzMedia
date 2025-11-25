import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Upload, Image as ImageIcon, Video, Users, BarChart, ArrowUpRight, Settings } from 'lucide-react'
import MediaList from '@/components/MediaList'

export default async function AdminDashboard() {
    const supabase = await createClient()

    const {
        data: { user },
        const { count: imageCount } = await supabase
            .from('media_assets')
            .select('*', { count: 'exact', head: true })
            .eq('asset_type', 'image')

    const { count: videoCount } = await supabase
            .from('media_assets')
            .select('*', { count: 'exact', head: true })
            .eq('asset_type', 'video')

    const { count: userCount } = await supabase
            .from('profiles')
            .select('*', { count: 'exact', head: true })

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Admin Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                            Admin
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">
                            View Site
                        </Link>
                        <div className="h-4 w-px bg-gray-200"></div>
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-blue-50 rounded-lg">
                                    <ImageIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Images</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{imageCount || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <Link href="/images" className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center">
                                View all images <ArrowUpRight className="ml-1 w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-purple-50 rounded-lg">
                                    <Video className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Videos</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{videoCount || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <Link href="/videos" className="text-xs font-medium text-purple-600 hover:text-purple-800 flex items-center">
                                View all videos <ArrowUpRight className="ml-1 w-3 h-3" />
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                        <div className="p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 p-3 bg-green-50 rounded-lg">
                                    <Users className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-5 w-0 flex-1">
                                    <dl>
                                        <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                                        <dd className="text-2xl font-semibold text-gray-900">{userCount || 0}</dd>
                                    </dl>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 border-t border-gray-100">
                            <span className="text-xs font-medium text-gray-500 flex items-center">
                                Active community
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Media List */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                                <h3 className="text-base font-semibold text-gray-900">Recent Media</h3>
                                <Link href="/admin/upload" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
                                    Upload New
                                </Link>
                            </div>
                            <div className="divide-y divide-gray-200">
                                <ul role="list" className="divide-y divide-gray-200">
                                    <MediaList />
                                </ul>
                            </div>
                            <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 text-center">
                                <button className="text-sm font-medium text-gray-500 hover:text-gray-900">
                                    View all assets
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Quick Actions */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                            <h3 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h3>
                            <div className="space-y-3">
                                <Link
                                    href="/admin/upload"
                                    className="flex items-center p-3 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all group"
                                >
                                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                                        <Upload className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Upload Media</p>
                                        <p className="text-xs text-gray-500">Add images or videos</p>
                                    </div>
                                    <ArrowUpRight className="ml-auto h-4 w-4 text-gray-400 group-hover:text-indigo-500" />
                                </Link>

                                <div className="flex items-center p-3 rounded-lg border border-gray-200 bg-gray-50 opacity-75 cursor-not-allowed">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <BarChart className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Analytics</p>
                                        <p className="text-xs text-gray-500">Coming soon</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-3 rounded-lg border border-gray-200 bg-gray-50 opacity-75 cursor-not-allowed">
                                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                        <Settings className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">Settings</p>
                                        <p className="text-xs text-gray-500">System configuration</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
