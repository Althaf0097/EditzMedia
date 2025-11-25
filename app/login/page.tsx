'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react'
import EnvChecker from '@/components/EnvChecker'

function LoginForm() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [displayName, setDisplayName] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [view, setView] = useState<'login' | 'signup'>('login')
    const router = useRouter()
    const searchParams = useSearchParams()
    const supabase = createClient()

    useEffect(() => {
        const viewParam = searchParams.get('view')
        if (viewParam === 'signup') {
            setView('signup')
        }
    }, [searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                console.error('Login error:', error)
                setError(error.message)
                setLoading(false)
            } else if (data.user) {
                console.log('Login successful:', data.user)
                router.push('/')
                router.refresh()
            } else {
                setError('An unexpected error occurred. Please try again.')
                setLoading(false)
            }
        } catch (err) {
            console.error('Unexpected error:', err)
            setError('An unexpected error occurred. Please try again.')
            setLoading(false)
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    display_name: displayName,
                },
            },
        })

        if (error) {
            setError(error.message)
            setLoading(false)
        } else {
            setError('Check your email for the confirmation link.')
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            <EnvChecker />
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-50"></div>
                <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">
                    <div>
                        <h1 className="text-5xl font-black tracking-tight">
                            <span className="text-indigo-400">Media</span>Editz
                        </h1>
                    </div>
                    <div>
                        <blockquote className="text-2xl font-medium leading-relaxed">
                            "The best platform for high-quality stock assets. I found exactly what I needed for my next project."
                        </blockquote>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-white/20"></div>
                            <div>
                                <div className="font-semibold">Alex Morgan</div>
                                <div className="text-white/80 text-sm">Creative Director</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center lg:text-left">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                            {view === 'login' ? 'Welcome back' : 'Create an account'}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            {view === 'login'
                                ? 'Enter your details to access your account'
                                : 'Get started with your free account today'}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={view === 'login' ? handleLogin : handleSignup}>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                    Password
                                </label>
                                <div className="relative mt-1">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete="current-password"
                                        required
                                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" aria-hidden="true" />
                                        ) : (
                                            <Eye className="h-5 w-5" aria-hidden="true" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {view === 'signup' && (
                                <div>
                                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                                        Nick Name
                                    </label>
                                    <input
                                        id="displayName"
                                        name="displayName"
                                        type="text"
                                        required
                                        className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black sm:text-sm"
                                        placeholder="CreativeUser"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                    />
                                </div>
                            )}
                        </div>

                        {error && (
                            <div className={`p-3 rounded-md text-sm ${error.includes('Check your email') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="flex w-full justify-center items-center rounded-lg bg-black px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {loading ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    {view === 'login' ? 'Sign in' : 'Create account'}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </>
                            )}
                        </button>

                        <div className="text-center text-sm">
                            <span className="text-gray-500">
                                {view === 'login' ? "Don't have an account? " : "Already have an account? "}
                            </span>
                            <button
                                type="button"
                                onClick={() => {
                                    setView(view === 'login' ? 'signup' : 'login')
                                    setError(null)
                                }}
                                className="font-semibold text-black hover:underline"
                            >
                                {view === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default function LoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <LoginForm />
        </Suspense>
    )
}
