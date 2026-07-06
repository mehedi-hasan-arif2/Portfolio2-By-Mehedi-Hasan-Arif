import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function calculateReadingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, '')
  const wordCount = text.trim().split(/\s+/).length
  return Math.ceil(wordCount / 200)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export interface HeadingItem {
  id: string
  text: string
  level: number
}

// Extract headings and generate TOC data
export function extractHeadings(html: string): { html: string; headings: HeadingItem[] } {
  const headings: HeadingItem[] = []
  const seen = new Map<string, number>()

  const modifiedHtml = html.replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/gi, (match, level, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim()
    if (!text) return match

    let id = slugify(text)
    const count = seen.get(id) || 0
    seen.set(id, count + 1)
    if (count > 0) id = `${id}-${count}`

    headings.push({ id, text, level: Number(level) })
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
  })

  return { html: modifiedHtml, headings }
}