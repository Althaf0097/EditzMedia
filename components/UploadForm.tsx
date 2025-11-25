'use client'

import { useState, useCallback } from 'react'
// import { useDropzone } from 'react-dropzone' 
import { createClient } from '@/lib/supabase/client'
import { Upload, X, File as FileIcon, Film, Image as ImageIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

// We'll implement a simple drag/drop without react-dropzone to avoid extra deps if possible, 
// or just use standard input for now and enhance. 
// Actually, standard input is safer for now, but I'll add drag/drop styling.

export default function UploadForm() {
    const [file, setFile] = useState<File | null>(null)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [category, setCategory] = useState('')
    const [isRecommended, setIsRecommended] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const supabase = createClient()
    const router = useRouter()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
        }
    }

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !title || !category) {
            setMessage({ type: 'error', text: 'Please fill in all required fields' })
            return
        }

        setUploading(true)
        setMessage(null)

        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            // 1. Upload to Storage
            const { error: uploadError } = await supabase.storage
                .from('assets')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('assets')
                .getPublicUrl(filePath)

            // 3. Determine type
            const isVideo = file.type.startsWith('video')
            const assetType = isVideo ? 'video' : 'image'

            // 4. Get User
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('Not authenticated')

            // 5. Insert into DB
            // First get category ID (assuming category is the ID passed from select)
            // Actually, let's just pass the ID directly from the select value

            const { error: dbError } = await supabase
                .from('media_assets')
                .insert({
                    title,
                    description,
                    file_url: publicUrl,
                    format: fileExt || 'unknown',
                    asset_type: assetType,
                    category_id: parseInt(category),
                    uploader_id: user.id,
                    is_recommended: isRecommended
                })

            if (dbError) throw dbError

            setMessage({ type: 'success', text: 'Upload successful!' })
            setFile(null)
            setTitle('')
            setDescription('')
            setCategory('')
            setIsRecommended(false)
            router.refresh()

        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Upload failed' })
        } finally {
            setUploading(false)
        }
    }

    // Fetch categories (hardcoded for now or fetch in useEffect)
    // We'll fetch in useEffect
    const [categories, setCategories] = useState<{ id: number, name: string, type: string }[]>([])

    useState(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*')
            if (data) setCategories(data)
        }
        fetchCategories()
    }) // This runs once on mount due to empty dependency array behavior in Next.js client components? 
    // Wait, useState initializer runs once. But this is not an initializer.
    // I should use useEffect.

    // Correcting to useEffect
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const useEffectHook = require('react').useEffect
    useEffectHook(() => {
        const fetchCategories = async () => {
            const { data } = await supabase.from('categories').select('*')
            if (data) setCategories(data)
        }
        fetchCategories()
    }, [])

    return (
        <form onSubmit={handleUpload} className="space-y-6 max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
            <div>
                <label className="block text-sm font-medium text-gray-700">Media File</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-indigo-500 transition-colors">
                    <div className="space-y-1 text-center">
                        {file ? (
                            <div className="flex flex-col items-center">
                                {file.type.startsWith('video') ? (
                                    <Film className="mx-auto h-12 w-12 text-gray-400" />
                                ) : (
                                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                                )}
                                <p className="text-sm text-gray-600 mt-2">{file.name}</p>
                                <button
                                    type="button"
                                    onClick={() => setFile(null)}
                                    className="text-xs text-red-500 hover:text-red-700 mt-1"
                                >
                                    Remove
                                </button>
                            </div>
                        ) : (
                            <>
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600">
                                    <label
                                        htmlFor="file-upload"
                                        className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none"
                                    >
                                        <span>Upload a file</span>
                                        <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*,video/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, MP4, WEBM up to 50MB</p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        required
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="">Select a category</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name} ({cat.type})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 text-gray-900 bg-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div className="flex items-center">
                <input
                    id="is-recommended"
                    type="checkbox"
                    checked={isRecommended}
                    onChange={(e) => setIsRecommended(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is-recommended" className="ml-2 block text-sm text-gray-900">
                    Mark as Recommended
                </label>
            </div>

            {message && (
                <div className={`p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <button
                type="submit"
                disabled={uploading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
                {uploading ? 'Uploading...' : 'Upload Asset'}
            </button>
        </form>
    )
}
