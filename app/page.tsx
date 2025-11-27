import { createClient } from '@/lib/supabase/server'
import MediaCard from '@/components/MediaCard'
import Link from 'next/link'
import { ArrowRight, Sparkles, Image as ImageIcon, Film, Upload, TrendingUp, Zap } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 transition-colors duration-300">
      {/* Hero Section - Modern Gradient */}
      <div className="relative overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-shift"></div>
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Floating shapes */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32 lg:py-40">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6 animate-bounce-in">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium text-white">Premium Stock Media Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white mb-6 animate-slide-up opacity-0 leading-tight" style={{ animationFillMode: 'forwards' }}>
              Stunning Stock Assets
              <br />
              <span className="gradient-text-blue-purple animate-text-shimmer">for Editors</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl md:text-2xl text-white/90 max-w-3xl mx-auto mb-10 animate-slide-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
              Discover thousands of high-quality images and videos curated specifically for video editors and content creators.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
              <Link
                href="/images"
                className="group inline-flex items-center px-8 py-4 bg-white text-purple-600 font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300"
              >
                <ImageIcon className="w-5 h-5 mr-2" />
                Browse Images
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/videos"
                className="group inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md border border-white/30 text-white font-semibold rounded-full hover:bg-white/20 hover:scale-105 transition-all duration-300"
              >
                <Film className="w-5 h-5 mr-2" />
                Browse Videos
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto mt-16 animate-fade-in">
              <div className="glass-premium p-4 sm:p-6 rounded-2xl">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">10K+</div>
                <div className="text-xs sm:text-sm text-white/70">Premium Assets</div>
              </div>
              <div className="glass-premium p-4 sm:p-6 rounded-2xl">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">4K</div>
                <div className="text-xs sm:text-sm text-white/70">Ultra HD Quality</div>
              </div>
              <div className="glass-premium p-4 sm:p-6 rounded-2xl">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">Free</div>
                <div className="text-xs sm:text-sm text-white/70">Downloads</div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 sm:h-24 fill-gray-50 dark:fill-gray-950" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* Latest Additions Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-semibold uppercase tracking-wide">Trending Now</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">Latest Additions</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Fresh content added daily for your projects</p>
          </div>
          <Link
            href="/images"
            className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            View All
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Media Grid */}
        {assets && assets.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {assets.map((asset: any, index: number) => (
              <div
                key={asset.id}
                className="animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
              >
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
          <div className="text-center py-20 bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl border-2 border-dashed border-gray-300 dark:border-gray-700 animate-fade-in">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6">
              <ImageIcon className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No assets found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by uploading some premium content</p>
            {user && (
              <Link
                href="/admin/upload"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Media
              </Link>
            )}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-12 text-center sm:hidden">
          <Link
            href="/images"
            className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold"
          >
            View all assets
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-gradient-to-br from-gray-900 to-black py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">Why Choose MediaEditz?</h2>
            <p className="text-xl text-gray-400">Built specifically for video editors and content creators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-premium p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 group-hover:animate-glow-pulse">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Lightning Fast</h3>
              <p className="text-gray-400">Quick preview and instant downloads for your workflow</p>
            </div>

            <div className="glass-premium p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 mb-6 group-hover:animate-glow-pulse">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Quality</h3>
              <p className="text-gray-400">4K ultra HD assets curated for professional use</p>
            </div>

            <div className="glass-premium p-8 rounded-2xl text-center group hover:scale-105 transition-transform duration-300">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-pink-500 to-orange-600 mb-6 group-hover:animate-glow-pulse">
                <Film className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Editor Focused</h3>
              <p className="text-gray-400">Tools and features designed for video editors</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
