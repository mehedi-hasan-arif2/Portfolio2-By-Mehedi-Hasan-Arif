'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Skills from '@/components/sections/Skills'
import FeaturedProjects from '@/components/sections/FeaturedProjects'
import Experience from '@/components/sections/Experience'
import ContactForm from '@/components/sections/ContactForm'
import SectionHeading from '@/components/common/SectionHeading'
import { SkeletonGrid } from '@/components/common/LoadingSkeleton'
import BlogCard from '@/components/blog/BlogCard'
import { staggerContainer, slideUp } from '@/constants/animations'
import type { IBlog } from '@/types'

async function fetchLatestBlogs(): Promise<IBlog[]> {
  const { data } = await axios.get<IBlog[]>('/api/blogs', { params: { limit: 3 } })
  return data
}

function LatestBlog() {
  const { data: blogs, isLoading } = useQuery({
    queryKey: ['blogs', 'latest'],
    queryFn: fetchLatestBlogs,
    staleTime: 5 * 60 * 1000,
  })

  // Don't render the section at all if there's nothing to show yet
  if (!isLoading && (!blogs || blogs.length === 0)) return null

  return (
    <section className="section-padding" id="blog">
      <div className="container-width">
        <SectionHeading
          label="From The Blog"
          title="Latest Articles"
          description="Thoughts on web development, design, and everything in between."
        />

        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {blogs!.map((blog) => (
              <motion.div key={blog._id} variants={slideUp}>
                <BlogCard blog={blog} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            View All Articles
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <FeaturedProjects />
      <Experience />
      <LatestBlog />
      <ContactForm />
    </>
  )
}