import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Calendar, Clock, ArrowLeft } from 'lucide-react'
import Container from '@/components/layout/Container'
import BlogContent from '@/components/blog/BlogContent'
import BlogCard from '@/components/blog/BlogCard'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'
import Profile from '@/models/Profile'
import { formatDate } from '@/lib/utils'
import type { IBlog } from '@/types'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBlog(slug: string) {
  await connectDB()
  const blog = await Blog.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { views: 1 } },
    { new: true }
  ).lean()
  return blog ? JSON.parse(JSON.stringify(blog)) : null
}

async function getRelatedBlogs(category: string, excludeSlug: string) {
  await connectDB()
  const blogs = await Blog.find({
    status: 'published',
    category,
    slug: { $ne: excludeSlug },
  })
    .limit(3)
    .lean()
  return JSON.parse(JSON.stringify(blogs)) as IBlog[]
}

async function getAuthorName() {
  await connectDB()
  const profile = await Profile.findOne().lean()
  return (profile as { name?: string } | null)?.name || 'Author'
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)

  if (!blog) return { title: 'Post Not Found' }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
      type: 'article',
    },
  }
}

export default async function BlogDetailPage({ params }: PageProps) {
  const { slug } = await params
  const blog: IBlog | null = await getBlog(slug)

  if (!blog) notFound()

  const [related, authorName] = await Promise.all([
    getRelatedBlogs(blog.category, blog.slug),
    getAuthorName(),
  ])

  return (
    <div className="pt-32 pb-20">
      <Container className="max-w-[880px]">
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 text-sm font-medium mb-8 transition-colors hover:text-[var(--text-primary)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft size={15} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to Blog
        </Link>

        {blog.coverImage && (
          <div className="relative aspect-video rounded-2xl overflow-hidden mb-8">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              className="object-cover"
              sizes="(max-width: 880px) 100vw, 880px"
              priority
            />
          </div>
        )}

        <div className="flex items-center gap-4 text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
          {blog.category && (
            <span
              className="px-2.5 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'color-mix(in srgb, var(--brand-primary) 14%, transparent)',
                color: 'var(--brand-primary)',
              }}
            >
              {blog.category}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar size={13} />
            {formatDate(blog.createdAt)}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={13} />
            {blog.readingTime} min read
          </span>
        </div>

        <h1
          className="font-heading font-bold text-3xl md:text-4xl mb-4 leading-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          {blog.title}
        </h1>

        <p
          className="text-sm mb-10 pb-8"
          style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border)' }}
        >
          By <span style={{ color: 'var(--text-primary)' }}>{authorName}</span>
        </p>

        <BlogContent content={blog.content} />

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: '1px solid var(--border)' }}>
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 rounded-full text-xs"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </Container>

      {related.length > 0 && (
        <Container className="max-w-[880px] mt-20">
          <h2
            className="font-heading font-bold text-2xl mb-8 text-center"
            style={{ color: 'var(--text-primary)' }}
          >
            Related Posts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {related.map((post) => (
              <BlogCard key={post._id} blog={post} />
            ))}
          </div>
        </Container>
      )}
    </div>
  )
}