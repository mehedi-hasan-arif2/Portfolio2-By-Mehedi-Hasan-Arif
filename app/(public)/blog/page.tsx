'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion } from 'framer-motion'
import { AnimatePresence } from 'framer-motion'
import { Search } from 'lucide-react'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { SkeletonGrid } from '@/components/common/LoadingSkeleton'
import BlogCard from '@/components/blog/BlogCard'
import type { IBlog } from '@/types'

async function fetchBlogs(): Promise<IBlog[]> {
  const { data } = await axios.get<IBlog[]>('/api/blogs')
  return data
}

export default function BlogPage() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
    staleTime: 5 * 60 * 1000,
  })

  const categories = useMemo(() => {
    if (!blogs) return ['All']
    const unique = Array.from(new Set(blogs.map((b) => b.category).filter(Boolean)))
    return ['All', ...unique]
  }, [blogs])

  const filtered = useMemo(() => {
    if (!blogs) return []
    return blogs.filter((blog) => {
      const matchesCategory = activeCategory === 'All' || blog.category === activeCategory
      const matchesSearch =
        search.trim() === '' ||
        blog.title.toLowerCase().includes(search.toLowerCase()) ||
        blog.excerpt?.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [blogs, activeCategory, search])

  // latest blog badge
  const isBrowsingAll = activeCategory === 'All' && search.trim() === ''

  return (
    <div className="pt-32 pb-20">
      <Container>
        <SectionHeading
          label="Blog"
          title="Articles & Insights"
          description="Thoughts on web development, design, and everything in between."
        />

        {/* Search */}
        <div className="max-w-md mx-auto mb-6 relative">
          <Search
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-tertiary)' }}
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-11 pr-4 py-3 rounded-full text-sm outline-none transition-colors focus:border-[var(--brand-primary)]"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
          />
        </div>

        {/* Category tabs - underline style */}
        {categories.length > 1 && (
          <div
            className="flex flex-wrap justify-center gap-6 mb-12"
            style={{ borderBottom: '1px solid var(--border)' }}
          >
            {categories.map((cat) => {
              const isActive = activeCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="relative pb-3 text-sm font-medium capitalize transition-colors duration-200"
                  style={{ color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)' }}
                >
                  {cat}
                  {isActive && (
                    <motion.span
                      layoutId="blog-category-underline"
                      className="absolute left-0 right-0 -bottom-px h-[2px] rounded-full"
                      style={{
                        background: 'linear-gradient(90deg, var(--brand-primary), var(--brand-secondary))',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}
                </button>
              )
            })}
          </div>
        )}

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : filtered.length === 0 ? (
          <p className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
            No articles found.
          </p>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((blog, index) => (
                <BlogCard key={blog._id} blog={blog} isLatest={isBrowsingAll && index === 0} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
    </div>
  )
}