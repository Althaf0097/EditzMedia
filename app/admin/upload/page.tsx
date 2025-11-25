import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import UploadForm from '@/components/UploadForm'
import Navbar from '@/components/Navbar'

export default async function AdminUploadPage() {
    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Check if admin
    const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

    if (!profile?.is_admin) {
        redirect('/')
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Upload Media
                    </h1>
                    <p className="mt-4 text-lg text-gray-500">
                        Add new images or videos to the platform.
                    </p>
                </div>
                <UploadForm />
            </div>
        </div>
    )
}
