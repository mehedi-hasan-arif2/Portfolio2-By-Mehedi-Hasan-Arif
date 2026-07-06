'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Sparkles,
  Briefcase,
  User,
  Mail,
  LogOut,
  Pencil,
  Trash2,
  UploadCloud,
  X,
  Loader2,
} from 'lucide-react'

/* -------------------------------------------------------------------------- */
/*  AdminSidebar                                                              */
/* -------------------------------------------------------------------------- */

const navItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { href: '/admin/blogs', label: 'Blogs', icon: Newspaper },
  { href: '/admin/skills', label: 'Skills', icon: Sparkles },
  { href: '/admin/experience', label: 'Experience', icon: Briefcase },
  { href: '/admin/profile', label: 'Profile', icon: User },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await axios.post('/api/auth/logout')
      toast.success('Logged out')
      router.push('/admin')
      router.refresh()
    } catch {
      toast.error('Logout failed')
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <aside
      className="w-64 shrink-0 h-screen sticky top-0 flex flex-col border-r"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <div className="px-6 py-6 border-b" style={{ borderColor: 'var(--border)' }}>
        <p className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
          Admin Panel
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          Mehedi Hasan Arif
        </p>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                color: isActive ? 'var(--brand-primary)' : 'var(--text-secondary)',
              }}
            >
              <Icon size={18} strokeWidth={1.75} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={handleLogout}
          disabled={loggingOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          style={{ color: 'var(--color-error)' }}
        >
          {loggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} strokeWidth={1.75} />}
          Logout
        </button>
      </div>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/*  AdminShell — wraps admin pages, hides sidebar on the login page          */
/* -------------------------------------------------------------------------- */

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === '/admin'

  if (isLoginPage) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-6 md:p-8">{children}</main>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  DataTable — generic list with edit/delete actions                        */
/* -------------------------------------------------------------------------- */

export interface DataTableColumn<T> {
  header: string
  accessor: (row: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowId: (row: T) => string
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
  isLoading?: boolean
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  onEdit,
  onDelete,
  isLoading,
  emptyMessage = 'No records yet.',
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div
        className="rounded-xl border p-10 flex items-center justify-center"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        <Loader2 size={22} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
      </div>
    )
  }

  if (!data.length) {
    return (
      <div
        className="rounded-xl border p-10 text-center text-sm"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-tertiary)' }}
      >
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="rounded-xl border overflow-x-auto" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
            {columns.map((col) => (
              <th
                key={col.header}
                className={`text-left font-medium px-5 py-3.5 whitespace-nowrap ${col.className ?? ''}`}
                style={{ color: 'var(--text-tertiary)' }}
              >
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && (
              <th className="text-right font-medium px-5 py-3.5" style={{ color: 'var(--text-tertiary)' }}>
                Actions
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={getRowId(row)}
              className="border-b last:border-0 transition-colors hover:bg-[var(--bg-tertiary)]"
              style={{ borderColor: 'var(--border)' }}
            >
              {columns.map((col) => (
                <td key={col.header} className={`px-5 py-3.5 ${col.className ?? ''}`} style={{ color: 'var(--text-primary)' }}>
                  {col.accessor(row)}
                </td>
              ))}
              {(onEdit || onDelete) && (
                <td className="px-5 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(row)}
                        className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-primary)]"
                        style={{ color: 'var(--brand-primary)' }}
                        aria-label="Edit"
                      >
                        <Pencil size={15} strokeWidth={1.75} />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row)}
                        className="p-1.5 rounded-md transition-colors hover:bg-[var(--bg-primary)]"
                        style={{ color: 'var(--color-error)' }}
                        aria-label="Delete"
                      >
                        <Trash2 size={15} strokeWidth={1.75} />
                      </button>
                    )}
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  StatusBadge — small reusable badge (Published/Draft, Featured, etc.)     */
/* -------------------------------------------------------------------------- */

export function StatusBadge({ status }: { status: string }) {
  const isPositive = status === 'published' || status === 'completed'
  const color = isPositive ? 'var(--color-success)' : 'var(--text-tertiary)'
  return (
    <span
      className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize"
      style={{
        background: `color-mix(in srgb, ${color} 14%, transparent)`,
        color,
      }}
    >
      {status}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/*  ImageUpload — single or multiple (Cloudinary wrapper, drag & drop)       */
/* -------------------------------------------------------------------------- */

interface ImageUploadProps {
  value: string | string[]
  onChange: (value: string | string[]) => void
  folder?: string
  multiple?: boolean
}

export function ImageUpload({ value, onChange, folder = 'misc', multiple = false }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const images = multiple ? (Array.isArray(value) ? value : []) : []
  const single = !multiple ? (typeof value === 'string' ? value : '') : ''

  const uploadFiles = async (files: FileList | File[]) => {
    setUploading(true)
    try {
      const uploaded: string[] = []
      for (const file of Array.from(files)) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('folder', folder)
        const { data } = await axios.post('/api/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        uploaded.push(data.url)
      }

      if (multiple) {
        onChange([...images, ...uploaded])
      } else {
        onChange(uploaded[0] || '')
      }
      toast.success(uploaded.length > 1 ? 'Images uploaded' : 'Image uploaded')
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files?.length) uploadFiles(e.dataTransfer.files)
  }

  const removeImage = (index: number) => {
    const next = images.filter((_, i) => i !== index)
    onChange(next)
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg border border-dashed flex flex-col items-center justify-center gap-2 py-8 cursor-pointer transition-colors"
        style={{
          borderColor: dragOver ? 'var(--brand-primary)' : 'var(--border)',
          background: 'var(--bg-tertiary)',
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          hidden
          onChange={(e) => e.target.files && uploadFiles(e.target.files)}
        />
        {uploading ? (
          <Loader2 size={22} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
        ) : (
          <UploadCloud size={22} style={{ color: 'var(--text-tertiary)' }} />
        )}
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {uploading ? 'Uploading...' : 'Click or drag image(s) here'}
        </p>
      </div>

      {/* Single preview */}
      {!multiple && single && (
        <div className="mt-3 relative w-28 h-28 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
          <Image src={single} alt="Preview" fill className="object-cover" unoptimized />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-1 right-1 p-1 rounded-full"
            style={{ background: 'rgba(0,0,0,0.6)' }}
          >
            <X size={12} color="#fff" />
          </button>
        </div>
      )}

      {/* Multiple preview (swiper-style thumbnail row) */}
      {multiple && images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((img, i) => (
            <div key={img + i} className="relative w-24 h-24 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              <Image src={img} alt={`Image ${i + 1}`} fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={() => removeImage(i)}
                className="absolute top-1 right-1 p-1 rounded-full"
                style={{ background: 'rgba(0,0,0,0.6)' }}
              >
                <X size={12} color="#fff" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}