'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, ChevronDown } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const supabase = createClient()

    const [query, setQuery] = useState(searchParams.get('search') || '')
    const [categoryId, setCategoryId] = useState(searchParams.get('category') || '')
    const [categories, setCategories] = useState<any[]>([])
    const [isExpanded, setIsExpanded] = useState(false)

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (data) setCategories(data)
        }
        fetchCategories()
    }, [supabase])

    // Update state when URL params change
    useEffect(() => {
        setQuery(searchParams.get('search') || '')
        setCategoryId(searchParams.get('category') || '')
    }, [searchParams])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()

        // Determine target path (default to images if not on videos page)
        const targetPath = pathname === '/videos' ? '/videos' : '/images'

        const params = new URLSearchParams()
        if (query) params.set('search', query)
        if (categoryId) params.set('category', categoryId)

        router.push(`${targetPath}?${params.toString()}`)
    }

    return (
        <form
            onSubmit={handleSearch}
            className={`relative flex items-center transition-all duration-300 ${isExpanded ? 'w-full sm:w-96' : 'w-full sm:w-64'
                }`}
        >
            <div className="relative w-full flex items-center">
                {/* Category Dropdown (Desktop) */}
                <div className="hidden md:block absolute left-1 z-10">
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(e.target.value)}
                        className="appearance-none bg-transparent border-none text-sm font-medium text-gray-500 dark:text-gray-400 focus:ring-0 cursor-pointer pl-2 pr-6 py-1 hover:text-gray-700 dark:hover:text-gray-200 transition-colors outline-none"
                    >
                        <option value="">All</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-1 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1" />
                </div>

                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setIsExpanded(true)}
                    onBlur={() => setIsExpanded(false)}
                    placeholder="Search assets..."
                    className="w-full pl-4 md:pl-24 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white dark:focus:bg-gray-900 focus:border-blue-500 rounded-full text-sm transition-all duration-300 outline-none"
                />

                <button
                    type="submit"
                    className="absolute right-1 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md"
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>
        </form>
    )
}
