import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Skill from '@/models/Skill'
import { getAdminFromCookie } from '@/lib/auth'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { id } = await params
    const data = await req.json()
    const skill = await Skill.findByIdAndUpdate(id, data, { new: true })
    return NextResponse.json(skill)
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
    await Skill.findByIdAndDelete(id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}