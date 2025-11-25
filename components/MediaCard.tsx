'use client'

import { Play, Download, Heart } from 'lucide-react'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import MediaPreviewModal from './MediaPreviewModal'

interface MediaCardProps {
    id: string
    title: string
    file_url: string
    asset_type: 'image' | 'video'
    category?: string
    isAuthenticated?: boolean
}

export default function MediaCard({ id, title, file_url, asset_type, category, isAuthenticated }: MediaCardProps) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [imageError, setImageError] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        if (!isAuthenticated) return

        const checkSaved = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('saved_items')
                .select('id')
                .eq('user_id', user.id)
                .eq('media_asset_id', id)
                .single()

            setIsSaved(!!data)
        }

        checkSaved()
    }, [isAuthenticated, id, supabase])

    const handleSaveToggle = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        if (!isAuthenticated || isLoading) return

        setIsLoading(true)

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            if (isSaved) {
                await supabase
                    .from('saved_items')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('media_asset_id', id)

                setIsSaved(false)
            } else {
                // @ts-ignore
                await supabase
                    .from('saved_items')
                    .insert({
                        user_id: user.id,
                        media_asset_id: id
                    } as any)

                setIsSaved(true)
            }
        } catch (error) {
            console.error('Error toggling save:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownload = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()

        try {
            const response = await fetch(file_url)
            const blob = await response.blob()
            const blobUrl = window.URL.createObjectURL(blob)

            const link = document.createElement('a')
            link.href = blobUrl
            link.download = title || 'download'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(blobUrl)
        } catch (error) {
            console.error('Download failed:', error)
            const link = document.createElement('a')
            link.href = file_url
            link.download = title || 'download'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return (
        <>
            <div
                onClick={() => setIsModalOpen(true)}
                className="block group relative bg-white dark:bg-gray-800 rounded-lg sm:rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 w-full cursor-pointer animate-fade-in hover-lift hover:border-blue-300 dark:hover:border-blue-600"
            >
                {/* Responsive aspect ratio container */}
                <div className="relative w-full aspect-square sm:aspect-video">
                    {/* Save button - larger on mobile */}
                    {isAuthenticated && (
                        <button
                            onClick={handleSaveToggle}
                            disabled={isLoading}
                            className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 p-3 sm:p-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full shadow-md hover:scale-125 active:scale-95 transition-all duration-200 disabled:opacity-50 touch-manipulation"
                            aria-label={isSaved ? "Remove from saved" : "Save item"}
                        >
                            <Heart
                                className={`w-5 h-5 sm:w-4 sm:h-4 transition-all ${isSaved
                                    ? 'fill-red-500 text-red-500'
                                    : 'text-gray-700 dark:text-gray-300 hover:text-red-500'
                                    }`}
                            />
                        </button>
                    )}

                    {/* Media content */}
                    {asset_type === 'image' ? (
                        imageError ? (
                            <img
                                src={file_url}
                                alt={title}
                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                    e.currentTarget.parentElement?.classList.add('bg-gray-100', 'dark:bg-gray-900', 'flex', 'items-center', 'justify-center')
                                    e.currentTarget.parentElement!.innerHTML = '<div class="text-center p-4"><p class="text-sm text-gray-500 dark:text-gray-400">Image not available</p></div>'
                                }}
                            />
                        ) : (
                            <Image
                                src={file_url}
                                alt={title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                unoptimized
                                onError={() => setImageError(true)}
                            />
                        )
                    ) : (
                        <div
                            className="absolute inset-0"
                            onMouseEnter={() => setIsPlaying(true)}
                            onMouseLeave={() => setIsPlaying(false)}
                        >
                            <video
                                src={file_url}
                                className="w-full h-full object-cover"
                                muted
                                loop
                                playsInline
                                ref={(el) => {
                                    if (el) {
                                        isPlaying ? el.play().catch(() => { }) : el.pause()
                                    }
                                }}
                            />
                            {!isPlaying && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                    <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-4 sm:p-3 shadow-lg transform group-hover:scale-110 transition-transform">
                                        <Play className="w-8 h-8 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400 fill-current" />
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Hover overlay - desktop only */}
                    <div className="hidden sm:block absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Info overlay - desktop hover, mobile always visible below */}
                    <div className="hidden sm:block absolute bottom-0 left-0 right-0 p-3 lg:p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                        <div className="flex items-end justify-between gap-3">
                            <div className="text-white overflow-hidden flex-1">
                                <h3 className="font-bold text-base lg:text-lg truncate">{title}</h3>
                                {category && (
                                    <p className="text-xs lg:text-sm text-gray-300">{category}</p>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handleDownload}
                                    className="p-2.5 lg:p-2 bg-white/10 hover:bg-blue-600 hover:scale-110 active:scale-95 text-white rounded-full backdrop-blur-sm transition-all duration-200"
                                    title="Download"
                                    aria-label="Download media"
                                >
                                    <Download className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mobile info section - always visible */}
                <div className="sm:hidden p-3 bg-white dark:bg-gray-800">
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">{title}</h3>
                            {category && (
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{category}</p>
                            )}
                        </div>
                        <button
                            onClick={handleDownload}
                            className="flex-shrink-0 p-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-700 dark:text-gray-300 rounded-full transition-all duration-200 active:scale-95 touch-manipulation"
                            title="Download"
                            aria-label="Download media"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <MediaPreviewModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mediaUrl={file_url}
                mediaType={asset_type}
                title={title}
            />
        </>
    )
}
