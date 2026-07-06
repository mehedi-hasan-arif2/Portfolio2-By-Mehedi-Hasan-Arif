import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'
import { getAdminFromCookie } from '@/lib/auth'
import { calculateReadingTime, slugify } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const all = searchParams.get('all') // admin uses ?all=true to see drafts too
    const limitParam = searchParams.get('limit') 

    const query = all ? {} : { status: 'published' }
    let cursor = Blog.find(query).sort({ createdAt: -1 })

    if (limitParam) {
      const limit = Number(limitParam)
      if (!Number.isNaN(limit) && limit > 0) {
        cursor = cursor.limit(limit)
      }
    }

    const blogs = await cursor
    return NextResponse.json(blogs)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const data = await req.json()

    // Auto-generate slug and reading time
    if (!data.slug) data.slug = slugify(data.title)
    data.readingTime = calculateReadingTime(data.content || '')

    const blog = await Blog.create(data)
    return NextResponse.json(blog, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}