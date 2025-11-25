import { createClient } from '@/lib/supabase/server'
import { Trash2, Edit, MoreVertical } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default async function MediaList() {
    const supabase = await createClient()

    const { data: assets } = await supabase
        .from('media_assets')
        .select('*, categories(name)')
        .order('created_at', { ascending: false })
        .limit(10)

    if (!assets || assets.length === 0) {
        return (
            <li className="px-6 py-12 text-center">
                <div className="mx-auto h-12 w-12 text-gray-300">
                    <Image
                        src="https://images.unsplash.com/photo-1594322436404-5a0526db4d13?q=80&w=2629&auto=format&fit=crop"
                        alt="Empty"
                        width={48}
                        height={48}
                        className="rounded-full opacity-50 grayscale"
                    />
                </div>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No media assets</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new upload.</p>
            </li>
        )
    }

    return (
        <>
            {assets.map((asset: any) => (
                <li key={asset.id} className="px-6 py-4 hover:bg-gray-50 transition-colors group">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0 flex-1 mr-4">
                            <div className="flex-shrink-0 h-12 w-12 relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                {asset.asset_type === 'image' ? (
                                    <Image
                                        src={asset.file_url}
                                        alt={asset.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <video
                                        src={asset.file_url}
                                        className="h-full w-full object-cover"
                                    />
                                )}
                            </div>
                            <div className="ml-4 min-w-0 flex-1">
                                <div className="text-sm font-medium text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                                    {asset.title}
                                </div>
                                <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                    <span className="truncate max-w-[100px]">{asset.categories?.name || 'Uncategorized'}</span>
                                    <span className="mx-1.5 text-gray-300">&bull;</span>
                                    <span className="capitalize bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                                        {asset.asset_type}
                                    </span>
                                    {asset.is_recommended && (
                                        <>
                                            <span className="mx-1.5 text-gray-300">&bull;</span>
                                            <span className="text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">Recommended</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Link
                                href={`/admin/edit/${asset.id}`}
                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
                                title="Edit"
                            >
                                <Edit className="w-4 h-4" />
                            </Link>

                            <form action={async () => {
                                'use server'
                                const supabase = await createClient()
                                await supabase.from('media_assets').delete().eq('id', asset.id)
                                const { revalidatePath } = await import('next/cache')
                                revalidatePath('/admin')
                            }}>
                                <button
                                    type="submit"
                                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </form>
                        </div>
                    </div>
                </li>
            ))}
        </>
    )
}
