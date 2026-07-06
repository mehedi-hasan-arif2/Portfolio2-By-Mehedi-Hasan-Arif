import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Admin from '@/models/Admin'
import { signToken } from '@/lib/auth'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    const admin = await Admin.findOne({ email })
    if (!admin) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const token = await signToken({ email: admin.email })

    const response = NextResponse.json({ success: true })
    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    })

    return response
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}