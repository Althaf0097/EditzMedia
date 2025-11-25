'use client'

import { Play, Download, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

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
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const supabase = createClient()

    // Check if item is already saved
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
                // Unsave
                await supabase
                    .from('saved_items')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('media_asset_id', id)

                setIsSaved(false)
            } else {
                // Save
                await supabase
                    .from('saved_items')
                    .insert({
                        user_id: user.id,
                        media_asset_id: id
                    })

                setIsSaved(true)
            }
        } catch (error) {
            console.error('Error toggling save:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleDownload = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        window.open(file_url, '_blank')
    }

    const handleSave = (e: React.MouseEvent) => {
        handleSaveToggle(e)
    }

    return (
        <Link href={`/media/${id}`} className="block group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-gray-700">
            <div className="relative w-full" style={{ paddingBottom: '75%' }}>
                {/* Save Button - Always visible in top right for authenticated users */}
                {isAuthenticated && (
                    <button
                        onClick={handleSaveToggle}
                        disabled={isLoading}
                        className="absolute top-2 right-2 z-10 p-2.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full shadow-md hover:scale-110 transition-all disabled:opacity-50"
                    >
                        <Heart
                            className={`w-4 h-4 transition-all ${isSaved
                                ? 'fill-red-500 text-red-500'
                                : 'text-gray-700 dark:text-gray-300 hover:text-red-500'
                                }`}
                        />
                    </button>
                )}

                {asset_type === 'image' ? (
                    imageError ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-900">
                            <div className="text-center p-4">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Image not available</p>
                            </div>
                        </div>
                    ) : (
                        <Image
                            src={file_url}
                            alt={title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
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
                                <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-3 shadow-lg transform group-hover:scale-110 transition-transform">
                                    <Play className="w-6 h-6 text-blue-600 dark:text-blue-400 fill-current" />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                    <div className="flex items-end justify-between gap-4">
                        <div className="text-white overflow-hidden flex-1">
                            <h3 className="font-bold text-lg truncate">{title}</h3>
                            {category && (
                                <p className="text-sm text-gray-300">{category}</p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleDownload}
                                className="p-2 bg-white/10 hover:bg-blue-600 text-white rounded-full backdrop-blur-sm transition-colors"
                                title="Download"
                            >
                                <Download className="w-5 h-5" />
                            </button>
                            {isAuthenticated && (
                                <button
                                    onClick={handleSave}
                                    className={`p-2 rounded-full backdrop-blur-sm transition-colors ${isSaved
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white/10 hover:bg-blue-600 text-white'
                                        }`}
                                    title={isSaved ? "Unsave" : "Save"}
                                >
                                    <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
