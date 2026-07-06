import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Blog from '@/models/Blog'
import { getAdminFromCookie } from '@/lib/auth'
import { calculateReadingTime, slugify } from '@/lib/utils'

export async function GET(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    await connectDB()
    const { slug } = await params
    const blog = await Blog.findOne({ slug })
    if (!blog) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(blog)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { slug } = await params
    const data = await req.json()

    if (data.title && !data.slug) data.slug = slugify(data.title)
    if (data.content) data.readingTime = calculateReadingTime(data.content)

    const blog = await Blog.findOneAndUpdate({ slug }, data, { new: true })
    return NextResponse.json(blog)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { slug } = await params
    await Blog.findOneAndDelete({ slug })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}