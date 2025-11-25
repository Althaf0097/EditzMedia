'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Camera, Loader2, X, Upload } from 'lucide-react'
import Image from 'next/image'

interface AvatarUploadProps {
    userId: string
    currentAvatarUrl?: string | null
    onUploadComplete?: () => void
}

export default function AvatarUpload({ userId, currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
    const [showModal, setShowModal] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const supabase = createClient()

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB')
            return
        }

        // Show preview
        const reader = new FileReader()
        reader.onloadend = () => {
            setPreview(reader.result as string)
        }
        reader.readAsDataURL(file)

        // Upload to Supabase
        setUploading(true)
        try {
            // Create unique filename
            const fileExt = file.name.split('.').pop()
            const fileName = `${userId}-${Date.now()}.${fileExt}`
            const filePath = `avatars/${fileName}`

            // Upload file
            const { error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) throw uploadError

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('media')
                .getPublicUrl(filePath)

            // Update profile
            // @ts-ignore
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    avatar_url: publicUrl
                } as any)

            if (updateError) throw updateError

            // Close modal and refresh
            setShowModal(false)
            router.refresh()

            if (onUploadComplete) {
                onUploadComplete()
            }
        } catch (error: any) {
            console.error('Avatar upload error:', error)
            alert(`Failed to upload avatar: ${error.message || 'Unknown error'}`)
            setPreview(null)
        } finally {
            setUploading(false)
        }
    }

    const openFileDialog = () => {
        fileInputRef.current?.click()
    }

    return (
        <>
            {/* Avatar Display */}
            <div className="relative group">
                <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-xl">
                    {currentAvatarUrl ? (
                        <Image
                            src={currentAvatarUrl}
                            alt="Profile"
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-4xl font-bold text-white">
                            {userId?.[0]?.toUpperCase() || 'U'}
                        </span>
                    )}

                    {/* Upload overlay */}
                    <button
                        onClick={() => setShowModal(true)}
                        className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                    >
                        <Camera className="w-8 h-8 text-white mb-1" />
                        <span className="text-xs text-white font-medium">Change Photo</span>
                    </button>
                </div>

                <button
                    onClick={() => setShowModal(true)}
                    className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300"
                >
                    <Camera className="w-4 h-4" />
                </button>
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scale-in">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Upload Profile Photo</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Preview */}
                        <div className="mb-6">
                            <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                {preview || currentAvatarUrl ? (
                                    <Image
                                        src={preview || currentAvatarUrl || ''}
                                        alt="Preview"
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl font-bold text-white">
                                        {userId?.[0]?.toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Upload Button */}
                        <div className="space-y-3">
                            <button
                                onClick={openFileDialog}
                                disabled={uploading}
                                className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5" />
                                        Choose Photo
                                    </>
                                )}
                            </button>

                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleFileSelect}
                                disabled={uploading}
                                className="hidden"
                            />

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                Cancel
                            </button>
                        </div>

                        {/* Info */}
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-4">
                            Max file size: 5MB • Supported: JPG, PNG, GIF
                        </p>
                    </div>
                </div>
            )}
        </>
    )
}
