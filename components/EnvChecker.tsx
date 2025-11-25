'use client'

import { useEffect, useState } from 'react'
import { AlertCircle } from 'lucide-react'

export default function EnvChecker() {
    const [missingVars, setMissingVars] = useState<string[]>([])

    useEffect(() => {
        const missing = []
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL) missing.push('NEXT_PUBLIC_SUPABASE_URL')
        if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) missing.push('NEXT_PUBLIC_SUPABASE_ANON_KEY')
        setMissingVars(missing)
    }, [])

    if (missingVars.length === 0) return null

    return (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">Missing Environment Variables</h3>
                        <div className="mt-2 text-sm text-red-700">
                            <p>The following variables are missing from your .env.local file:</p>
                            <ul className="list-disc pl-5 space-y-1 mt-1">
                                {missingVars.map((v) => (
                                    <li key={v} className="font-mono text-xs">{v}</li>
                                ))}
                            </ul>
                            <p className="mt-2 text-xs">Please add them to your .env.local file and restart the server.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
