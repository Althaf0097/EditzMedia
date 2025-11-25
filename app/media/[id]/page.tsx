import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import { Download, Calendar, User as UserIcon, Tag } from 'lucide-react'
import { notFound } from 'next/navigation'

export default async function MediaDetailPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const { id } = await params

    const { data: asset } = await supabase
        .from('media_assets')
        .select('*, categories(name), profiles(email)')
        .eq('id', id)
        .single()

    if (!asset) {
        notFound()
    }

    const { data: { user } } = await supabase.auth.getUser()
    const isAuthenticated = !!user

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-3">
                        {/* Media Preview */}
                        <div className="lg:col-span-2 bg-black flex items-center justify-center min-h-[400px] lg:min-h-[600px] relative">
                            {asset.asset_type === 'image' ? (
                                <div className="relative w-full h-full min-h-[400px]">
                                    <Image
                                        src={asset.file_url}
                                        alt={asset.title}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </div>
                            ) : (
                                <video
                                    src={asset.file_url}
                                    controls
                                    className="w-full h-full max-h-[80vh]"
                                />
                            )}
                        </div>

                        {/* Details Sidebar */}
                        <div className="p-8 lg:border-l border-gray-200">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{asset.title}</h1>

                            <div className="flex items-center space-x-4 mb-6">
                                {isAuthenticated ? (
                                    <a
                                        href={asset.file_url}
                                        download
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 bg-black text-white px-6 py-3 rounded-lg font-bold text-center hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Download className="w-5 h-5" />
                                        Download
                                    </a>
                                ) : (
                                    <div className="flex-1 bg-gray-100 text-gray-500 px-6 py-3 rounded-lg font-bold text-center cursor-not-allowed flex items-center justify-center gap-2">
                                        <Download className="w-5 h-5" />
                                        Login to Download
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                    <p className="mt-1 text-gray-900">{asset.description || 'No description provided.'}</p>
                                </div>

                                <div className="border-t border-gray-200 pt-6 space-y-4">
                                    <div className="flex items-center text-sm">
                                        <Tag className="w-5 h-5 text-gray-400 mr-3" />
                                        <span className="text-gray-500">Category:</span>
                                        <span className="ml-2 font-medium text-gray-900">{asset.categories?.name || 'Uncategorized'}</span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                                        <span className="text-gray-500">Uploaded:</span>
                                        <span className="ml-2 font-medium text-gray-900">
                                            {new Date(asset.created_at).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <UserIcon className="w-5 h-5 text-gray-400 mr-3" />
                                        <span className="text-gray-500">Uploader:</span>
                                        <span className="ml-2 font-medium text-gray-900 truncate max-w-[200px]">
                                            {asset.profiles?.email || 'Unknown'}
                                        </span>
                                    </div>

                                    <div className="flex items-center text-sm">
                                        <span className="text-gray-500 w-8">Fmt:</span>
                                        <span className="font-medium text-gray-900 uppercase">{asset.format}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
