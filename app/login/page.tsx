'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { ArrowRight, Loader2, Eye, EyeOff, Sparkles, Film } from 'lucide-react'

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
                setError(error.message)
                setLoading(false)
            } else if (data.user) {
                router.push('/')
                router.refresh()
            }
        } catch (err) {
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
            {/* Left Side - Form (Mobile: Full width, Desktop: Half width) */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 relative overflow-hidden">
                {/* Animated gradient background for mobile */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 lg:hidden animate-gradient-shift"></div>
                <div className="absolute inset-0 bg-black/20 lg:hidden backdrop-blur-sm"></div>

                {/* Desktop background */}
                <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black"></div>

                {/* Floating shapes - mobile only */}
                <div className="lg:hidden absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-float"></div>
                <div className="lg:hidden absolute bottom-20 right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl animate-float" style={{ animationDelay: '2s' }}></div>

                {/* Form Container */}
                <div className="relative z-10 w-full max-w-md">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 mb-4 shadow-lg shadow-purple-500/50 animate-glow-pulse">
                            <Film className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-black text-white lg:text-gray-900 lg:dark:text-white mb-2">
                            MediaEditz
                        </h1>
                        <p className="text-white/90 lg:text-gray-600 lg:dark:text-gray-400">
                            Premium Stock Media for Editors
                        </p>
                    </div>

                    {/* Form Card */}
                    <div className="glass-premium rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 lg:border-gray-200 lg:dark:border-gray-800 lg:bg-white lg:dark:bg-gray-900">
                        {/* Tab Switcher */}
                        <div className="flex gap-2 mb-6 p-1 bg-white/10 lg:bg-gray-100 lg:dark:bg-gray-800 rounded-xl">
                            <button
                                onClick={() => setView('login')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${view === 'login'
                                        ? 'bg-white text-purple-600 shadow-lg lg:bg-gradient-to-r lg:from-blue-500 lg:to-purple-600 lg:text-white'
                                        : 'text-white/70 lg:text-gray-600 lg:dark:text-gray-400 hover:text-white lg:hover:text-gray-900 lg:dark:hover:text-white'
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                onClick={() => setView('signup')}
                                className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 ${view === 'signup'
                                        ? 'bg-white text-purple-600 shadow-lg lg:bg-gradient-to-r lg:from-blue-500 lg:to-purple-600 lg:text-white'
                                        : 'text-white/70 lg:text-gray-600 lg:dark:text-gray-400 hover:text-white lg:hover:text-gray-900 lg:dark:hover:text-white'
                                    }`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50 backdrop-blur-sm">
                                <p className="text-sm text-white lg:text-red-600 lg:dark:text-red-400">{error}</p>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={view === 'login' ? handleLogin : handleSignup} className="space-y-4">
                            {view === 'signup' && (
                                <div className="animate-slide-down">
                                    <label className="block text-sm font-medium text-white/90 lg:text-gray-700 lg:dark:text-gray-300 mb-2">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 lg:bg-gray-50 lg:dark:bg-gray-800 border border-white/20 lg:border-gray-300 lg:dark:border-gray-700 text-white lg:text-gray-900 lg:dark:text-white placeholder-white/50 lg:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 lg:focus:ring-purple-500 transition-all"
                                        placeholder="Your name"
                                        required
                                    />
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-medium text-white/90 lg:text-gray-700 lg:dark:text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-white/10 lg:bg-gray-50 lg:dark:bg-gray-800 border border-white/20 lg:border-gray-300 lg:dark:border-gray-700 text-white lg:text-gray-900 lg:dark:text-white placeholder-white/50 lg:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 lg:focus:ring-purple-500 transition-all"
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-white/90 lg:text-gray-700 lg:dark:text-gray-300 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white/10 lg:bg-gray-50 lg:dark:bg-gray-800 border border-white/20 lg:border-gray-300 lg:dark:border-gray-700 text-white lg:text-gray-900 lg:dark:text-white placeholder-white/50 lg:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/50 lg:focus:ring-purple-500 transition-all pr-12"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 lg:text-gray-500 hover:text-white lg:hover:text-gray-700 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 lg:from-blue-600 lg:to-purple-600 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        {view === 'login' ? 'Sign In' : 'Create Account'}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-6 text-center">
                            <Link
                                href="/"
                                className="text-sm text-white/70 lg:text-gray-600 lg:dark:text-gray-400 hover:text-white lg:hover:text-purple-600 lg:dark:hover:text-purple-400 transition-colors inline-flex items-center gap-1"
                            >
                                ← Back to Home
                            </Link>
                        </div>
                    </div>

                    {/* Trust Indicators - Mobile */}
                    <div className="mt-6 flex items-center justify-center gap-6 text-white/60 lg:hidden">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="text-xs">Premium Quality</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Film className="w-4 h-4" />
                            <span className="text-xs">Editor Focused</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Hero/Showcase (Desktop Only) */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 animate-gradient-shift">
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/20"></div>

                {/* Floating elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '3s' }}></div>

                {/* Content */}
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white text-center">
                    <Sparkles className="w-16 h-16 mb-6 animate-bounce-in" />
                    <h2 className="text-5xl font-black mb-4 gradient-text-blue-purple animate-text-shimmer">
                        Welcome Back!
                    </h2>
                    <p className="text-xl text-white/90 max-w-md mb-8">
                        Access thousands of premium stock media assets curated specifically for video editors and content creators.
                    </p>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-8 mt-8">
                        <div className="glass-premium p-6 rounded-2xl">
                            <div className="text-3xl font-bold mb-1">10K+</div>
                            <div className="text-sm text-white/70">Assets</div>
                        </div>
                        <div className="glass-premium p-6 rounded-2xl">
                            <div className="text-3xl font-bold mb-1">4K</div>
                            <div className="text-sm text-white/70">Quality</div>
                        </div>
                        <div className="glass-premium p-6 rounded-2xl">
                            <div className="text-3xl font-bold mb-1">Free</div>
                            <div className="text-sm text-white/70">Downloads</div>
                        </div>
                    </div>
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
