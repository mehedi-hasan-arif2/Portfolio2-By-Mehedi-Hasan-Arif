'use client'

import { useEffect, useMemo, useState } from 'react'
import { extractHeadings } from '@/lib/utils'

interface BlogContentProps {
  content: string
}

export default function BlogContent({ content }: BlogContentProps) {
  const { html, headings } = useMemo(() => extractHeadings(content), [content])
  const [activeId, setActiveId] = useState<string | null>(null)
  const showToc = headings.length >= 2

  useEffect(() => {
    if (!showToc) return

    function onScroll() {
   // Query heading elements on each scroll to avoid stale DOM references
      const triggerLine = window.innerHeight * 0.3
      let current: string | null = null
      for (const h of headings) {
        const el = document.getElementById(h.id)
        if (!el) continue
        const top = el.getBoundingClientRect().top
        if (top <= triggerLine) current = h.id
      }
      setActiveId(current)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showToc, html])

  return (
    <div className={showToc ? 'lg:grid lg:grid-cols-[1fr_220px] lg:gap-12 items-start' : ''}>
      <article
        className="tiptap-content"
        style={{ color: 'var(--text-secondary)' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {showToc && (
        <nav className="hidden lg:block sticky top-28 self-start">
          <p
            className="text-xs font-semibold uppercase tracking-wide mb-3"
            style={{ color: 'var(--text-tertiary)' }}
          >
            On This Page
          </p>
          <ul className="flex flex-col gap-0.5">
            {headings.map((h) => {
              const isActive = activeId === h.id
              return (
                <li key={h.id}>
                  <a
                    href={`#${h.id}`}
                    className="block text-sm py-1 border-l-2 transition-colors duration-200"
                    style={{
                      paddingLeft: h.level === 3 ? '22px' : '12px',
                      borderColor: isActive ? 'var(--brand-primary)' : 'var(--border)',
                      color: isActive ? 'var(--brand-primary)' : 'var(--text-tertiary)',
                      fontWeight: isActive ? 600 : 400,
                    }}
                  >
                    {h.text}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </div>
  )
}