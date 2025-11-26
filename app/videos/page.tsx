import { createClient } from '@/lib/supabase/server'
import MediaCard from '@/components/MediaCard'

export default async function VideosPage({
    searchParams,
}: {
    searchParams: Promise<{ category?: string; search?: string }>
}) {
    const supabase = await createClient()
    const { category, search } = await searchParams
    const categoryId = category

    let query = supabase
        .from('media_assets')
        .select('*, categories(name)')
        .eq('asset_type', 'video')
        .order('created_at', { ascending: false })

    if (categoryId) {
        query = query.eq('category_id', Number(categoryId))
    }

    if (search) {
        query = query.ilike('title', `%${search}%`)
    }

    const { data: assets } = await query
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .eq('type', 'video')

    const { data: { user } } = await supabase.auth.getUser()

    return (
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 animate-slide-down">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Videos</h1>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    <a
                        href="/videos"
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${!categoryId
                            ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                            : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                            }`}
                    >
                        All
                    </a>
                    {categories?.map((cat: any) => (
                        <a
                            key={cat.id}
                            href={`/videos?category=${cat.id}`}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${categoryId === String(cat.id)
                                ? 'bg-black dark:bg-white text-white dark:text-black shadow-md'
                                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            {cat.name}
                        </a>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {assets?.map((asset: any, index: number) => (
                    <div
                        key={asset.id}
                        className="animate-fade-in opacity-0"
                        style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
                    >
                        <MediaCard
                            id={asset.id}
                            title={asset.title}
                            file_url={asset.file_url}
                            asset_type="video"
                            category={asset.categories?.name}
                            isAuthenticated={!!user}
                        />
                    </div>
                ))}
            </div>

            {(!assets || assets.length === 0) && (
                <div className="text-center py-20 animate-fade-in">
                    <p className="text-gray-500 dark:text-gray-400 text-lg">No videos found.</p>
                </div>
            )}
        </div>
    )
}
