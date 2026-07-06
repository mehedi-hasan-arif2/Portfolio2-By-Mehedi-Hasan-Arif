import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/db'
import Contact from '@/models/Contact'
import { getAdminFromCookie } from '@/lib/auth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

// rate limiter (per IP) 
const RATE_LIMIT_WINDOW_MS = 60 * 1000 // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 3 // max 3 submissions per minute per IP

const rateLimitMap = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []

  // Keep only timestamps within the current window
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    rateLimitMap.set(ip, recent)
    return true
  }

  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

function getClientIp(req: NextRequest): string {
  const forwardedFor = req.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

function buildEmailHtml({
  name,
  email,
  subject,
  message,
}: {
  name: string
  email: string
  subject?: string
  message: string
}) {
  return `
  <!doctype html>
  <html>
    <body style="margin:0; padding:0; background-color:#0B0A10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, Arial, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0A10; padding: 40px 16px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; background-color:#14121B; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08);">

              <!-- Gradient top bar -->
              <tr>
                <td style="height: 4px; background: linear-gradient(90deg, #8B5CF6, #F43F5E, #FB923C);"></td>
              </tr>

              <!-- Header -->
              <tr>
                <td style="padding: 32px 32px 8px 32px;">
                  <p style="margin:0; font-size: 12px; letter-spacing: 1.5px; text-transform: uppercase; color: #8B5CF6; font-weight: 600;">
                    New Portfolio Message
                  </p>
                  <h1 style="margin: 8px 0 0 0; font-size: 22px; color: #F8F7FC; font-weight: 700;">
                    You've got a new message
                  </h1>
                </td>
              </tr>

              <!-- Sender info -->
              <tr>
                <td style="padding: 20px 32px 0 32px;">
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1C1925; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                    <tr>
                      <td style="padding: 18px 20px;">
                        <p style="margin:0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8A869B;">From</p>
                        <p style="margin:0; font-size: 15px; color: #F8F7FC; font-weight: 600;">${name}</p>
                        <p style="margin: 2px 0 0 0; font-size: 13px;">
                          <a href="mailto:${email}" style="color: #8B5CF6; text-decoration: none;">${email}</a>
                        </p>
                      </td>
                    </tr>
                    ${
                      subject
                        ? `<tr>
                      <td style="padding: 0 20px 18px 20px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 14px;">
                        <p style="margin:0 0 4px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8A869B;">Subject</p>
                        <p style="margin:0; font-size: 14px; color: #B6B3C7;">${subject}</p>
                      </td>
                    </tr>`
                        : ''
                    }
                  </table>
                </td>
              </tr>

              <!-- Message -->
              <tr>
                <td style="padding: 16px 32px 0 32px;">
                  <p style="margin:0 0 8px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #8A869B;">Message</p>
                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#1C1925; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                    <tr>
                      <td style="padding: 18px 20px; font-size: 14px; line-height: 1.7; color: #B6B3C7; white-space: pre-wrap;">${message}</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding: 28px 32px;">
                  <a href="mailto:${email}" style="display: inline-block; padding: 12px 24px; border-radius: 999px; background: linear-gradient(135deg, #8B5CF6, #F43F5E); color: #ffffff; font-size: 14px; font-weight: 600; text-decoration: none;">
                    Reply to ${name.split(' ')[0]}
                  </a>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="padding: 20px 32px; border-top: 1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0; font-size: 12px; color: #8A869B;">
                    Sent automatically from your portfolio contact form.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req)

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { message: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      )
    }

    await connectDB()
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ message: 'Name, email and message are required' }, { status: 400 })
    }

    // Save message to MongoDB
    await Contact.create({ name, email, subject, message })

    // Send email notification via Resend
    await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: process.env.CONTACT_EMAIL!,
      subject: `New message from ${name}${subject ? `: ${subject}` : ''}`,
      html: buildEmailHtml({ name, email, subject, message }),
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const admin = await getAdminFromCookie()
    if (!admin) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const messages = await Contact.find().sort({ createdAt: -1 })
    return NextResponse.json(messages)
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}