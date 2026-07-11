import { MetadataRoute } from 'next'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yourportfolio.com'

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 1 },
    { url: `${siteUrl}/projects`, lastModified: new Date(), changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${siteUrl}/blog`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${siteUrl}/contact`, lastModified: new Date(), changeFrequency: 'yearly' as const, priority: 0.6 },
  ]

  try {
    await connectDB()
    const blogs = await Blog.find({ status: 'published' }).select('slug updatedAt')

    const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${siteUrl}/blog/${blog.slug}`,
      lastModified: new Date(blog.updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...blogRoutes]
  } catch (error) {
    // If DB fails, still return static routes instead of crashing the whole route
    console.error('Sitemap: failed to fetch blogs from DB', error)
    return staticRoutes
  }
}