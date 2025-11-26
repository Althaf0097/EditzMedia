'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, ChevronDown, Filter } from 'lucide-react'
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
    const [isFocused, setIsFocused] = useState(false)

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await supabase
                .from('categories')
                .select('*')
                .order('name')

            if (data) {
                // Deduplicate categories by ID
                const uniqueCategories = Array.from(new Map(data.map((item: any) => [item.id, item])).values())
                setCategories(uniqueCategories)
            }
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
            className={`relative flex items-center transition-all duration-500 ease-out ${isExpanded || isFocused ? 'w-full sm:w-[450px]' : 'w-full sm:w-80'
                }`}
        >
            <div
                className={`relative w-full flex items-center p-1 rounded-full border transition-all duration-300 ${isFocused
                    ? 'bg-white dark:bg-gray-900 border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                    : 'bg-gray-50/80 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
            >
                {/* Category Dropdown (Desktop) */}
                <div className="hidden md:flex items-center relative pl-2 pr-2 border-r border-gray-200 dark:border-gray-700">
                    <div className="relative group">
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="appearance-none bg-transparent border-none text-sm font-medium text-gray-700 dark:text-gray-200 focus:ring-0 cursor-pointer pl-2 pr-8 py-2 outline-none"
                            style={{ colorScheme: 'dark' }}
                        >
                            <option value="" className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">All Assets</option>
                            {categories.map((cat) => (
                                <option
                                    key={cat.id}
                                    value={cat.id}
                                    className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                >
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors pointer-events-none" />
                    </div>
                </div>

                {/* Search Input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => {
                            setIsExpanded(true)
                            setIsFocused(true)
                        }}
                        onBlur={() => {
                            setIsExpanded(false)
                            setIsFocused(false)
                        }}
                        placeholder="Search for anything..."
                        className="w-full pl-4 pr-10 py-2.5 bg-transparent border-none focus:ring-0 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                </div>

                {/* Search Button */}
                <button
                    type="submit"
                    className={`p-2.5 rounded-full transition-all duration-300 ${query || isFocused
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md hover:shadow-lg transform hover:scale-105'
                        : 'bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-700'
                        }`}
                >
                    <Search className="w-4 h-4" />
                </button>
            </div>
        </form>
    )
}
