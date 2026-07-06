import { NextRequest, NextResponse } from 'next/server'

// Server-side proxy for GitHub's public API.
export async function GET(req: NextRequest) {
  try {
    const githubUrl = req.nextUrl.searchParams.get('url')

    if (!githubUrl) {
      return NextResponse.json({ count: 0 })
    }

    const username = githubUrl.replace(/\/$/, '').split('/').pop()

    if (!username) {
      return NextResponse.json({ count: 0 })
    }

    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 }, // cache for 1 hour
    })

    if (!res.ok) {
      return NextResponse.json({ count: 0 })
    }

    const data = await res.json()
    return NextResponse.json({ count: data.public_repos || 0 })
  } catch {
    return NextResponse.json({ count: 0 })
  }
}