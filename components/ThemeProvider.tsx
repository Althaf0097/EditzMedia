'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    resolvedTheme: 'light' | 'dark'
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>('light')
    const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light')
    const [mounted, setMounted] = useState(false)

    // Load theme from localStorage on mount (client-side only)
    useEffect(() => {
        setMounted(true)
        const savedTheme = localStorage.getItem('theme') as Theme | null
        if (savedTheme) {
            setThemeState(savedTheme)
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            setThemeState('system')
        }
    }, [])

    // Apply theme whenever it changes
    useEffect(() => {
        if (!mounted) return

        const root = window.document.documentElement

        // Determine the resolved theme
        let resolved: 'light' | 'dark'
        if (theme === 'system') {
            resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
        } else {
            resolved = theme
        }

        setResolvedTheme(resolved)

        // Apply theme class
        root.classList.remove('light', 'dark')
        root.classList.add(resolved)

        // Save to localStorage
        localStorage.setItem('theme', theme)
    }, [theme, mounted])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (context === undefined) {
        // Return default values instead of throwing during SSR
        return {
            theme: 'light' as Theme,
            setTheme: () => { },
            resolvedTheme: 'light' as 'light' | 'dark'
        }
    }
    return context
}
