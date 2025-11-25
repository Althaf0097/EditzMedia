import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import EditMediaForm from '@/components/EditMediaForm'
import Link from 'next/link'

export default async function EditMediaPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const supabase = await createClient()
    const { id } = await params

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/admin/login')
    }

    // Check admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single() as { data: { is_admin: boolean } | null }

    if (!profile?.is_admin) {
        redirect('/')
    }

    // Fetch asset
    const { data: asset } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', id)
        .single()

    if (!asset) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-gray-900">Edit Media</h1>
                    <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-900">
                        Back to Dashboard
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto">
                    <EditMediaForm asset={asset} />
                </div>
            </main>
        </div>
    )
}
