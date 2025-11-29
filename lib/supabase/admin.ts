import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

/**
 * Check if a user has admin privileges
 * @param userId - The user's ID to check
 * @returns Promise<boolean> - True if user is admin, false otherwise
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', userId)
        .single()

    if (error || !data) {
        return false
    }

    return (data as { is_admin: boolean }).is_admin === true
}

/**
 * Require admin access - throws error if user is not admin
 * Use this in Server Components and API routes
 * @returns Promise<User> - Returns the authenticated admin user
 * @throws Error if not authenticated or not admin
 */
export async function requireAdmin() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        redirect('/login')
    }

    const isAdmin = await isUserAdmin(user.id)

    if (!isAdmin) {
        redirect('/')
    }

    return user
}

/**
 * Get admin status for the current user
 * @returns Promise<boolean> - True if current user is admin
 */
export async function checkCurrentUserAdmin(): Promise<boolean> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return false
    }

    return isUserAdmin(user.id)
}
