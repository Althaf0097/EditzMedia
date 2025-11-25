'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Camera, Loader2, X } from 'lucide-react'
import Image from 'next/image'

interface AvatarUploadProps {
    userId: string
    currentAvatarUrl?: string | null
    onUploadComplete?: () => void
}

export default function AvatarUpload({ userId, currentAvatarUrl, onUploadComplete }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState<string | null>(null)
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

            console.log('Uploading to:', filePath)

            // Upload to storage
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('media')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Upload error:', uploadError)
                throw new Error(`Upload failed: ${uploadError.message}`)
            }

            console.log('Upload successful:', uploadData)

            // Get public URL
            const { data } = supabase.storage
                .from('media')
                .getPublicUrl(filePath)

            if (!data || !data.publicUrl) {
                throw new Error('Failed to get public URL for uploaded file')
            }

            const publicUrl = data.publicUrl
            console.log('Public URL:', publicUrl)

            // Update profile with new avatar URL
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: userId,
                    avatar_url: publicUrl
                } as any)

            if (updateError) {
                console.error('Profile update error object:', updateError)
                console.error('Profile update error details:', JSON.stringify(updateError, null, 2))
                throw new Error(`Profile update failed: ${updateError.message || JSON.stringify(updateError)}`)
            }

            console.log('Profile updated successfully')

            // Call callback
            if (onUploadComplete) {
                onUploadComplete()
            }

            // Refresh page to show new avatar
            window.location.reload()
        } catch (error: any) {
            console.error('Avatar upload error:', error)
            alert(`Failed to upload avatar: ${error.message || 'Unknown error'}. Please check the console for details.`)
            setPreview(null)
        } finally {
            setUploading(false)
        }
    }

    const removePreview = () => {
        setPreview(null)
    }

    return (
        <div className="relative group">
            <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                {preview || currentAvatarUrl ? (
                    <Image
                        src={preview || currentAvatarUrl || ''}
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
                <label
                    htmlFor="avatar-upload"
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                    {uploading ? (
                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                    ) : (
                        <Camera className="w-8 h-8 text-white" />
                    )}
                </label>

                <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    disabled={uploading}
                    className="hidden"
                />
            </div>

            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
                Click to upload
            </p>
        </div>
    )
}
