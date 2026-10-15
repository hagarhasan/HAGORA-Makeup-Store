import React, { useEffect, useRef, useState } from 'react'
import { ThemeContext, type Theme } from './themeContextStore'

const THEME_STORAGE_KEY = 'hagora-theme'

function getInitialTheme(): Theme {
    if (typeof window === 'undefined') return 'light'

    try {
        const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
        if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme
    } catch (error) {
        console.warn('Unable to read the saved theme preference.', error)
    }

    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
    const [theme, setThemeState] = useState<Theme>(getInitialTheme)
    const transitionTimeout = useRef<number | undefined>(undefined)

    useEffect(() => {
        const root = document.documentElement
        const themeChanged = root.dataset.theme !== theme

        if (themeChanged) {
            root.classList.add('theme-transitioning')
        }

        root.setAttribute('data-theme', theme)
        root.classList.toggle('dark', theme === 'dark')
        document.body.classList.toggle('dark-theme', theme === 'dark')
        document.querySelector('meta[name="theme-color"]')?.setAttribute(
            'content',
            theme === 'dark' ? '#160f14' : '#c2185b',
        )

        try {
            window.localStorage.setItem(THEME_STORAGE_KEY, theme)
        } catch (error) {
            console.warn('Unable to save the theme preference.', error)
        }

        if (themeChanged) {
            window.clearTimeout(transitionTimeout.current)
            transitionTimeout.current = window.setTimeout(() => {
                root.classList.remove('theme-transitioning')
            }, 320)
        }

        return () => window.clearTimeout(transitionTimeout.current)
    }, [theme])

    useEffect(() => {
        const handleStorage = (event: StorageEvent) => {
            if (event.key !== THEME_STORAGE_KEY && event.key !== null) return
            setThemeState(
                event.newValue === 'dark' || event.newValue === 'light'
                    ? event.newValue
                    : getInitialTheme(),
            )
        }

        window.addEventListener('storage', handleStorage)
        return () => window.removeEventListener('storage', handleStorage)
    }, [])

    const toggleTheme = () => setThemeState((current) => current === 'light' ? 'dark' : 'light')
    const setTheme = (newTheme: Theme) => setThemeState(newTheme)

    return (
        <ThemeContext.Provider value={{ theme, isDark: theme === 'dark', toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}
