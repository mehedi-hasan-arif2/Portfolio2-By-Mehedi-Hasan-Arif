'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  Menu,
  X,
  Home,
  User,
  Layers,
  FolderKanban,
  Briefcase,
  Newspaper,
  type LucideIcon,
} from 'lucide-react'
import Container from './Container'
import ThemeToggle from './ThemeToggle'
import { cn } from '@/lib/utils'
import type { IProfile } from '@/types'

interface NavLink {
  label: string
  href: string
  icon: LucideIcon
}

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'About', href: '/#about', icon: User },
  { label: 'Skills', href: '/#skills', icon: Layers },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Experience', href: '/#experience', icon: Briefcase },
  { label: 'Blog', href: '/blog', icon: Newspaper },
]

const HOMEPAGE_SECTION_IDS = ['about', 'skills', 'experience'] as const
type HomeSectionId = (typeof HOMEPAGE_SECTION_IDS)[number]
const SCROLL_SUPPRESS_MS = 900

async function fetchProfile(): Promise<IProfile> {
  const { data } = await axios.get<IProfile>('/api/profile')
  return data
}

function getInitialHomeHref(): string {
  if (typeof window === 'undefined') return '/'
  const hash = window.location.hash.replace('#', '')
  return (HOMEPAGE_SECTION_IDS as readonly string[]).includes(hash)
    ? `/#${hash as HomeSectionId}`
    : '/'
}

interface PillRect {
  x: number
  width: number
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeHref, setActiveHref] = useState('/')
  const [pillRect, setPillRect] = useState<PillRect | null>(null)
  const pathname = usePathname()

  const didHydrate = useRef(false)
  const suppressObserverRef = useRef(false)
  const suppressTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const linkRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  const firstName = (profile?.name || 'Portfolio').split(' ')[0]

  // Scroll-driven header 
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile drawer
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

// Set the active link on initial load
  useEffect(() => {
    if (didHydrate.current) return
    didHydrate.current = true
    if (pathname === '/') {
      setActiveHref(getInitialHomeHref())
    }
  }, [pathname])

// Observe which section is currently visible on the homepage
  useEffect(() => {
    if (pathname !== '/') {
      setActiveHref(pathname)
      return
    }

    const sections = HOMEPAGE_SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    )
    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (suppressObserverRef.current) return

        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveHref(`/#${visible[0].target.id}`)
        } else if (window.scrollY < 200) {
          setActiveHref('/')
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [pathname])

  // Measure the active link and position the single pill
  const measurePill = useCallback(() => {
    const el = linkRefs.current.get(activeHref)
    if (el) {
      setPillRect({ x: el.offsetLeft, width: el.offsetWidth })
    } else {
      setPillRect(null)
    }
  }, [activeHref])

  useEffect(() => {
    measurePill()
    window.addEventListener('resize', measurePill)
    return () => window.removeEventListener('resize', measurePill)
  }, [measurePill])

// Handle nav link clicks
  const handleNavClick = (href: string) => {
    setMobileOpen(false)

    const isSamePageHash = pathname === '/' && href.startsWith('/#')
    if (!isSamePageHash) return

    setActiveHref(href)
    suppressObserverRef.current = true
    if (suppressTimeoutRef.current) clearTimeout(suppressTimeoutRef.current)
    suppressTimeoutRef.current = setTimeout(() => {
      suppressObserverRef.current = false
    }, SCROLL_SUPPRESS_MS)
  }

  useEffect(() => {
    return () => {
      if (suppressTimeoutRef.current) clearTimeout(suppressTimeoutRef.current)
    }
  }, [])

  const registerLinkRef = (href: string) => (el: HTMLAnchorElement | null) => {
    if (el) linkRefs.current.set(href, el)
    else linkRefs.current.delete(href)
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'py-3' : 'py-5'
      )}
      style={
        scrolled
          ? {
              background: 'color-mix(in srgb, var(--bg-secondary) 30%, transparent)',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              borderBottom: '1px solid var(--border-hover)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }
          : {
              background: 'color-mix(in srgb, var(--bg-secondary) 20%, transparent)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              borderBottom: '1px solid transparent',
            }
      }
    >
      <Container>
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="font-heading text-xl font-bold tracking-tight shrink-0">
            {isLoading ? (
              <span
                className="inline-block h-5 w-24 rounded animate-pulse"
                style={{ background: 'var(--bg-tertiary)' }}
              />
            ) : (
              <>
                <span style={{ color: 'var(--text-primary)' }}>{firstName}</span>
                <span className="text-gradient">.dev</span>
              </>
            )}
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1 relative">
            {pillRect && (
              <motion.span
                className="absolute top-0 left-0 h-full rounded-full pointer-events-none"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                initial={false}
                animate={{ x: pillRect.x, width: pillRect.width }}
                transition={{ type: 'spring', stiffness: 380, damping: 32, mass: 0.8 }}
              />
            )}
            {NAV_LINKS.map((link) => {
              const isActive = activeHref === link.href
              const Icon = link.icon
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  ref={registerLinkRef(link.href)}
                  onClick={() => handleNavClick(link.href)}
                  className="group relative z-10 flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200"
                  style={{
                    color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                  }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    size={15}
                    strokeWidth={1.9}
                    className="transition-transform duration-200 group-hover:-translate-y-0.5"
                    style={{ color: isActive ? 'var(--brand-primary)' : 'currentColor' }}
                    aria-hidden="true"
                  />
                  <span>{link.label}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop right side */}
          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-all duration-250 hover:-translate-y-0.5"
              style={{
                background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                boxShadow: '0 4px 14px color-mix(in srgb, var(--brand-primary) 25%, transparent)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 8px 24px color-mix(in srgb, var(--brand-primary) 40%, transparent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 4px 14px color-mix(in srgb, var(--brand-primary) 25%, transparent)'
              }}
            >
              Let&apos;s Talk
            </Link>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-drawer"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>
      </Container>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-nav-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="md:hidden overflow-hidden"
            style={{
              borderTop: '1px solid var(--border)',
              background: 'rgba(11, 10, 16, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
            }}
          >
            <Container className="py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const isActive = activeHref === link.href
                const Icon = link.icon
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                    }}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon
                      size={17}
                      strokeWidth={1.9}
                      style={{ color: isActive ? 'var(--brand-primary)' : 'currentColor' }}
                      aria-hidden="true"
                    />
                    {link.label}
                  </Link>
                )
              })}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 px-4 py-3 rounded-lg text-sm font-semibold text-white text-center"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                }}
              >
                Let&apos;s Talk
              </Link>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}