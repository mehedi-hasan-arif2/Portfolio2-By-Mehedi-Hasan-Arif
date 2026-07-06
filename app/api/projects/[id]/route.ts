import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const project = await Project.findById(id)
    if (!project) return NextResponse.json({ message: 'Not found' }, { status: 404 })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { id } = await params
    const data = await req.json()
    const project = await Project.findByIdAndUpdate(id, data, { new: true })
    return NextResponse.json(project)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { id } = await params
    await Project.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}