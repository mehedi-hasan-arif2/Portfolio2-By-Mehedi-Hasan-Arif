'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { FolderKanban, Newspaper, Mail, Sparkles, Plus, PenSquare, ArrowRight, Loader2 } from 'lucide-react'
import type { IProject, IBlog, IContact } from '@/types'
import { formatDate } from '@/lib/utils'

async function fetchDashboardData() {
  const [projects, blogs, skills, messages] = await Promise.all([
    axios.get<IProject[]>('/api/projects').then((r) => r.data),
    axios.get<IBlog[]>('/api/blogs?all=true').then((r) => r.data),
    axios.get('/api/skills').then((r) => r.data),
    axios.get<IContact[]>('/api/contact').then((r) => r.data),
  ])
  return { projects, blogs, skills, messages }
}

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string
  value: number
  icon: React.ElementType
}) {
  return (
    <div
      className="rounded-xl border p-5 flex items-center gap-4"
      style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
    >
      <div
        className="w-11 h-11 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)' }}
      >
        <Icon size={19} strokeWidth={1.75} style={{ color: 'var(--brand-primary)' }} />
      </div>
      <div>
        <p className="text-2xl font-heading font-bold" style={{ color: 'var(--text-primary)' }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {label}
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboardData,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
      </div>
    )
  }

  const projects = data?.projects ?? []
  const blogs = data?.blogs ?? []
  const skills = data?.skills ?? []
  const messages = data?.messages ?? []

  const recentMessages = messages.slice(0, 5)
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3)

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-heading font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          Dashboard
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Overview of your portfolio content
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Projects" value={projects.length} icon={FolderKanban} />
        <StatCard label="Blog Posts" value={blogs.length} icon={Newspaper} />
        <StatCard label="Messages" value={messages.length} icon={Mail} />
        <StatCard label="Skills" value={skills.length} icon={Sparkles} />
      </div>

      <div>
        <h2 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/projects"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <Plus size={15} /> Add Project
          </Link>
          <Link
            href="/admin/blogs"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <PenSquare size={15} /> Write Blog
          </Link>
          <Link
            href="/admin/messages"
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors hover:bg-[var(--bg-tertiary)]"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)', color: 'var(--text-primary)' }}
          >
            <Mail size={15} /> View Messages
          </Link>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Messages
            </h3>
            <Link href="/admin/messages" className="text-xs flex items-center gap-1" style={{ color: 'var(--brand-primary)' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              No messages yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentMessages.map((msg) => (
                <div key={msg._id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                      {msg.name}
                    </p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-tertiary)' }}>
                      {msg.subject || msg.message}
                    </p>
                  </div>
                  <span className="text-xs shrink-0 ml-2" style={{ color: 'var(--text-tertiary)' }}>
                    {formatDate(msg.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Recent Projects
            </h3>
            <Link href="/admin/projects" className="text-xs flex items-center gap-1" style={{ color: 'var(--brand-primary)' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
              No projects yet.
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {recentProjects.map((p) => (
                <div key={p._id} className="flex items-center justify-between text-sm">
                  <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {p.title}
                  </p>
                  <span className="text-xs shrink-0 ml-2" style={{ color: 'var(--text-tertiary)' }}>
                    {formatDate(p.createdAt)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}