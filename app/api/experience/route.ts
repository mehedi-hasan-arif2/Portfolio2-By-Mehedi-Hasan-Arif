import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Experience from '@/models/Experience'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const experience = await Experience.find().sort({ order: 1, startDate: -1 })
    return NextResponse.json(experience)
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
    const experience = await Experience.create(data)
    return NextResponse.json(experience, { status: 201 })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}