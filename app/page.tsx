import { createClient } from '@/lib/supabase/server'
import MediaCard from '@/components/MediaCard'
import Link from 'next/link'
import { ArrowRight, Search, Image as ImageIcon, Film } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()

  // Fetch latest assets
  const { data: assets } = await supabase
    .from('media_assets')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })
    .limit(12)

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-black text-white overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2622&auto=format&fit=crop')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Stunning Stock Assets <br className="hidden md:block" /> for Your Next Project
          </h1>
          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mb-10">
            Discover high-quality images and videos curated for creatives.
            Royalty-free and ready to use.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
            <Link
              href="/images"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-full text-black bg-white hover:bg-gray-100 transition-colors"
            >
              <ImageIcon className="w-5 h-5 mr-2" />
              Browse Images
            </Link>
            <Link
              href="/videos"
              className="flex-1 inline-flex justify-center items-center px-6 py-3 border border-white/30 backdrop-blur-sm text-base font-medium rounded-full text-white hover:bg-white/10 transition-colors"
            >
              <Film className="w-5 h-5 mr-2" />
              Browse Videos
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Latest Additions</h2>
            <p className="mt-1 text-gray-500">Fresh content added daily</p>
          </div>
          <Link href="/images" className="hidden sm:flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
            View all <ArrowRight className="ml-1 w-4 h-4" />
          </Link>
        </div>

        {assets && assets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <MediaCard
                key={asset.id}
                id={asset.id}
                title={asset.title}
                file_url={asset.file_url}
                asset_type={asset.asset_type}
                category={asset.categories?.name}
                isAuthenticated={!!user}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <div className="mx-auto h-12 w-12 text-gray-400">
              <ImageIcon className="h-12 w-12" />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No assets found</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading some content.</p>
            {user && (
              <div className="mt-6">
                <Link
                  href="/admin/upload"
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Upload className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
                  Upload Media
                </Link>
              </div>
            )}
          </div>
        )}

        <div className="mt-12 text-center sm:hidden">
          <Link href="/images" className="text-indigo-600 hover:text-indigo-700 font-medium">
            View all assets <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </main>
    </div>
  )
}
