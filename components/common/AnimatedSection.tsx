'use client'

import { motion, type Variants } from 'framer-motion'
import { slideUp } from '@/constants/animations'

interface AnimatedSectionProps {
  children: React.ReactNode
  className?: string
  variants?: Variants
  delay?: number
}

export default function AnimatedSection({
  children,
  className,
  variants = slideUp,
  delay = 0,
}: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={variants}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}