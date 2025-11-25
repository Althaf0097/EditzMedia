import { createClient } from '@/lib/supabase/server'
import MediaCard from '@/components/MediaCard'
import Link from 'next/link'
import { ArrowRight, Search, Image as ImageIcon, Film, Upload } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  // Fetch latest assets
  const { data: assets } = await supabase
    .from('media_assets')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
    .limit(12) as any

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      {/* Hero Section */}
      <div className="relative bg-black text-white overflow-hidden h-[600px] flex items-center justify-center">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2622&auto=format&fit=crop')] bg-cover bg-center opacity-40 animate-slow-zoom"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-slide-up opacity-0" style={{ animationFillMode: 'forwards' }}>
            Stunning Stock Assets <br className="hidden md:block" /> for Your Next Project
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10 animate-slide-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
            Discover high-quality images and videos curated for creatives.
            Royalty-free and ready to use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md animate-slide-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
            <Link
              href="/images"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-black bg-white hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Browse Images
            </Link>
            <Link
              href="/videos"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-white/30 backdrop-blur-sm text-base font-medium rounded-full text-white hover:bg-white/10 hover:scale-105 transition-all duration-300"
            >
              <Film className="w-5 h-5 mr-2" />
              Browse Videos
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8 animate-fade-in">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Latest Additions</h2>
            <p className="mt-1 text-gray-500 dark:text-gray-400">Fresh content added daily</p>
          </div>
          <Link href="/images" className="hidden sm:flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:translate-x-1 transition-transform">
            View all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        {assets && assets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset: any, index: number) => (
              <div key={asset.id} className="animate-fade-in opacity-0" style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}>
                <MediaCard
                  id={asset.id}
                  title={asset.title}
                  file_url={asset.file_url}
                  asset_type={asset.asset_type}
                  category={asset.categories?.name}
                  isAuthenticated={!!user}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 animate-fade-in">
            <div className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500">
              <ImageIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Get started by uploading some content.</p>
            {user && (
              <div className="mt-6">
                <Link
                  href="/admin/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform hover:scale-105"
                >
                  <Upload className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Upload Media
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link href="/images" className="text-blue-600 hover:text-blue-700 font-medium">
            View all assets <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
