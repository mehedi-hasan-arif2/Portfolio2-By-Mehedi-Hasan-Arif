'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { IBlog } from '@/types'

interface BlogCardProps {
  blog: IBlog
  isLatest?: boolean
}

export default function BlogCard({ blog, isLatest = false }: BlogCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="h-full"
    >
      <Link
        href={`/blog/${blog.slug}`}
        className="group flex flex-col h-full rounded-xl overflow-hidden card-hover"
        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      >
        <div className="relative aspect-video overflow-hidden">
          {blog.coverImage ? (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center"
              style={{ background: 'var(--bg-tertiary)' }}
            >
              <span style={{ color: 'var(--text-tertiary)' }}>No image</span>
            </div>
          )}
          {blog.category && (
            <span
              className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
              style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
            >
              {blog.category}
            </span>
          )}
          {isLatest && (
            <span
              className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide backdrop-blur-sm"
              style={{
                background: 'color-mix(in srgb, var(--brand-accent) 22%, transparent)',
                color: 'var(--brand-accent)',
                border: '1px solid color-mix(in srgb, var(--brand-accent) 40%, transparent)',
              }}
            >
              Latest
            </span>
          )}
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3
            className="font-heading font-semibold text-lg mb-2 line-clamp-2 transition-colors group-hover:text-[var(--brand-primary)]"
            style={{ color: 'var(--text-primary)' }}
          >
            {blog.title}
          </h3>
          <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
            {blog.excerpt}
          </p>

          <div className="mt-auto">
            <div className="flex items-center gap-4 text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>
              <span className="flex items-center gap-1.5">
                <Calendar size={13} />
                {formatDate(blog.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock size={13} />
                {blog.readingTime} min read
              </span>
            </div>

            <span
              className="inline-flex items-center gap-1.5 text-sm font-semibold w-fit"
              style={{ color: 'var(--brand-primary)' }}
            >
              Read Article
              <ArrowRight size={15} className="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}