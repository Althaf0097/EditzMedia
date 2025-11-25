import { Aperture } from 'lucide-react'
import Link from 'next/link'

export default function Logo({ className = "" }: { className?: string }) {
    return (
        <Link href="/" className={`flex items-center gap-2 group ${className}`}>
            <div className="relative flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg transform group-hover:rotate-12 transition-transform duration-300">
                <Aperture className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300">
                MediaEditz
            </span>
        </Link>
    )
}
