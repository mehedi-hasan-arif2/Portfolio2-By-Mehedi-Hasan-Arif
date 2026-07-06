import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Project from '@/models/Project'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const projects = await Project.find().sort({ order: 1, createdAt: -1 })
    return NextResponse.json(projects)
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
    const project = await Project.create(data)
    return NextResponse.json(project, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}