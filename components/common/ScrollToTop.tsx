'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          onClick={scrollToTop}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ scale: 1.08, y: -2 }}
          whileTap={{ scale: 0.92 }}
          transition={{ duration: 0.25 }}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center transition-shadow duration-250"
          style={{
            background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
            boxShadow: '0 4px 16px color-mix(in srgb, var(--brand-primary) 30%, transparent)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow =
              '0 8px 26px color-mix(in srgb, var(--brand-primary) 45%, transparent)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              '0 4px 16px color-mix(in srgb, var(--brand-primary) 30%, transparent)'
          }}
        >
          <ArrowUp size={18} className="text-white" />
        </motion.button>
      )}
    </AnimatePresence>
  )
}