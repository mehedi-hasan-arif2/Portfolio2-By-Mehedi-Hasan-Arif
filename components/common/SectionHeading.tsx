'use client'

import { motion } from 'framer-motion'
import { slideUp } from '@/constants/animations'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label?: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}

export default function SectionHeading({
  label,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={slideUp}
      className={cn(
        'mb-12 md:mb-16',
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left',
        className
      )}
    >
      {label && (
        <span
          className="inline-block text-sm font-semibold tracking-wide uppercase mb-3 px-3 py-1 rounded-full"
          style={{
            color: 'var(--brand-primary)',
            background: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)',
          }}
        >
          {label}
        </span>
      )}
      <h2
        className="font-heading font-bold tracking-tight text-3xl md:text-5xl mb-4"
        style={{ color: 'var(--text-primary)' }}
      >
        {title}
      </h2>
      {description && (
        <p className="text-base md:text-lg" style={{ color: 'var(--text-secondary)' }}>
          {description}
        </p>
      )}
    </motion.div>
  )
}