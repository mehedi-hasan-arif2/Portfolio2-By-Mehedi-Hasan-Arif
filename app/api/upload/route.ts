import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromCookie } from '@/lib/auth'
import cloudinary from '@/lib/cloudinary'

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File
    const folder = (formData.get('folder') as string) || 'portfolio'

    if (!file) return NextResponse.json({ message: 'No file provided' }, { status: 400 })

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: `portfolio/${folder}`, resource_type: 'auto' },
        (error, result) => {
          if (error) reject(error)
          else resolve(result as { secure_url: string; public_id: string })
        }
      ).end(buffer)
    })

    return NextResponse.json({ url: result.secure_url, public_id: result.public_id })
  } catch {
    return NextResponse.json({ message: 'Upload failed' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    const { public_id } = await req.json()
    await cloudinary.uploader.destroy(public_id)
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 })
  }
}