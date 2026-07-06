'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    return <div className="w-9 h-9 rounded-full" style={{ background: 'var(--bg-tertiary)' }} />
  }

  const isDark = theme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className="relative w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200"
      style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? 'moon' : 'sun'}
          initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
          transition={{ duration: 0.25 }}
        >
          {isDark ? (
            <Moon size={16} style={{ color: 'var(--brand-primary)' }} />
          ) : (
            <Sun size={16} style={{ color: 'var(--brand-primary)' }} />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  )
}