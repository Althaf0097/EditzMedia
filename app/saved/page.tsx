import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import MediaCard from '@/components/MediaCard'
import { Heart, Download } from 'lucide-react'
import Link from 'next/link'

export default async function SavedItemsPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch saved items with media details
    const { data: savedItems } = await supabase
        .from('saved_items')
        .select(`
            id,
            created_at,
            media_asset_id,
            media_assets (
                id,
                title,
                file_url,
                asset_type,
                categories (name)
            )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const assets = savedItems?.map((item: any) => ({
        ...item.media_assets,
        saved_at: item.created_at
    })) || []

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                    <Heart className="w-6 h-6 text-blue-600 dark:text-blue-400 fill-blue-600 dark:fill-blue-400" />
                                </div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Saved Items</h1>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400">
                                {assets.length} {assets.length === 1 ? 'item' : 'items'} saved for later
                            </p>
                        </div>
                        <Link
                            href="/"
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {assets.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {assets.map((asset: any) => (
                                <MediaCard
                                    key={asset.id}
                                    id={asset.id}
                                    title={asset.title}
                                    file_url={asset.file_url}
                                    asset_type={asset.asset_type}
                                    category={asset.categories?.name}
                                    isAuthenticated={true}
                                />
                            ))}
                        </div>

                        {/* Download All Section */}
                        {assets.length > 1 && (
                            <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Bulk Download</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Download all your saved items at once
                                        </p>
                                    </div>
                                    <button
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors flex items-center gap-2 font-medium"
                                        onClick={() => {
                                            alert('Bulk download feature coming soon! For now, click the download icon on individual items.')
                                        }}
                                    >
                                        <Download className="w-5 h-5" />
                                        Download All
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                        <div className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600 mb-4">
                            <Heart className="h-16 w-16" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No saved items yet</h3>
                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                            Start building your collection by clicking the heart icon on images and videos you love!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-colors"
                        >
                            Browse Media
                        </Link>
                    </div>
                )}
            </main>
        </div>
    )
}
