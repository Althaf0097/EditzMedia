'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, Download } from 'lucide-react'

interface MediaPreviewModalProps {
    isOpen: boolean
    onClose: () => void
    mediaUrl: string
    mediaType: 'image' | 'video'
    title: string
}

export default function MediaPreviewModal({ isOpen, onClose, mediaUrl, mediaType, title }: MediaPreviewModalProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    // Close on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }
        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen || !mounted) return null

    const handleDownload = async () => {
        try {
            const response = await fetch(mediaUrl)
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
            link.href = mediaUrl
            link.download = title || 'download'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }
    }

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-4xl animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header with title and buttons */}
                <div className="flex items-center justify-between mb-3 px-2">
                    <h3 className="text-lg font-semibold text-white truncate flex-1 mr-4">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                            aria-label="Download"
                        >
                            <Download className="w-5 h-5" />
                            <span className="text-sm font-medium hidden sm:inline">Download</span>
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
                            aria-label="Close"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Media content */}
                <div className="bg-gray-900 rounded-lg overflow-hidden shadow-2xl">
                    {mediaType === 'image' ? (
                        <div className="relative w-full bg-black flex items-center justify-center" style={{ maxHeight: '70vh', minHeight: '400px' }}>
                            <img
                                src={mediaUrl}
                                alt={title}
                                className="max-w-full max-h-[70vh] w-auto h-auto object-contain"
                            />
                        </div>
                    ) : (
                        <div className="relative w-full bg-black">
                            <video
                                src={mediaUrl}
                                controls
                                className="w-full h-auto max-h-[70vh]"
                                style={{ maxHeight: '70vh' }}
                            >
                                Your browser does not support the video tag.
                            </video>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    )
}
