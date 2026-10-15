import React from 'react'
import { useTheme } from '../../Context/useTheme'
import styles from './ThemeToggle.module.css'

interface ThemeToggleProps {
    variant?: 'icon' | 'row'
    className?: string
}

export default function ThemeToggle({ variant = 'icon', className = '' }: ThemeToggleProps): React.JSX.Element {
    const { isDark, toggleTheme } = useTheme()

    if (variant === 'row') {
        return (
            <div className={`${styles.mobileThemeRow} ${className}`}>
                <div className={styles.mobileThemeLabel}>
                    <i className={isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} aria-hidden="true" />
                    <span>{isDark ? 'Velvet Night 🌙' : 'Sweet Daylight ☀️'}</span>
                </div>
                <button
                    type="button"
                    onClick={toggleTheme}
                    className={styles.mobileSwitchBtn}
                    aria-label="Toggle dark mode"
                    aria-pressed={isDark}
                >
                    {isDark ? '☀️ Light' : '🌙 Dark'}
                </button>
            </div>
        )
    }

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className={`${styles.themeToggle} ${className}`}
            title={isDark ? 'Switch to Sweet Daylight (الوضع النهاري)' : 'Switch to Velvet Night (الوضع الليلي)'}
            aria-label={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-pressed={isDark}
        >
            <span className={styles.iconWrapper}>
                <i className={isDark ? 'fa-solid fa-moon' : 'fa-solid fa-sun'} aria-hidden="true" />
            </span>
            <span className={styles.sparkle} aria-hidden="true">
                ✦
            </span>
        </button>
    )
}
