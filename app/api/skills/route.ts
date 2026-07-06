import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Skill from '@/models/Skill'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const skills = await Skill.find().sort({ order: 1, createdAt: 1 })
    return NextResponse.json(skills)
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
    const skill = await Skill.create(data)
    return NextResponse.json(skill, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}