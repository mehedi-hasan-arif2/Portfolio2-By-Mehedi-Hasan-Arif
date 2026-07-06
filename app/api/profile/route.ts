import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Profile from '@/models/Profile'
import { getAdminFromCookie } from '@/lib/auth'

export async function GET() {
  try {
    await connectDB()
    const profile = await Profile.findOne()
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const data = await req.json()
    const profile = await Profile.findOneAndUpdate({}, data, { new: true, upsert: true })
    return NextResponse.json(profile)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}