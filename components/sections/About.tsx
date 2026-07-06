'use client'

import Image from 'next/image'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { MapPin, Layers, Globe, Mail } from 'lucide-react'
import AnimatedSection from '@/components/common/AnimatedSection'
import SectionHeading from '@/components/common/SectionHeading'
import { SkeletonText, SkeletonAvatar } from '@/components/common/LoadingSkeleton'
import { slideLeft, slideRight } from '@/constants/animations'
import type { IProfile, IProject, IBlog, ISkill } from '@/types'

async function fetchProfile(): Promise<IProfile> {
  const { data } = await axios.get<IProfile>('/api/profile')
  return data
}

async function fetchProjects(): Promise<IProject[]> {
  const { data } = await axios.get<IProject[]>('/api/projects')
  return data
}

async function fetchBlogs(): Promise<IBlog[]> {
  const { data } = await axios.get<IBlog[]>('/api/blogs')
  return data
}

async function fetchSkills(): Promise<ISkill[]> {
  const { data } = await axios.get<ISkill[]>('/api/skills')
  return data
}

// Calls our own server-side route, not GitHub directly - avoids rate limits
async function fetchGithubRepoCount(githubUrl?: string): Promise<number> {
  if (!githubUrl) return 0
  const { data } = await axios.get<{ count: number }>('/api/github-repos', {
    params: { url: githubUrl },
  })
  return data.count
}

export default function About() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  })

  const { data: blogs } = useQuery({
    queryKey: ['blogs'],
    queryFn: fetchBlogs,
    staleTime: 5 * 60 * 1000,
  })

  const { data: skills } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
    staleTime: 5 * 60 * 1000,
  })

  const { data: repoCount } = useQuery({
    queryKey: ['github-repos', profile?.github],
    queryFn: () => fetchGithubRepoCount(profile?.github),
    enabled: Boolean(profile?.github),
    staleTime: 60 * 60 * 1000,
  })

  const projectCount = projects?.length || 0
  const publishedBlogCount = blogs?.filter((b) => b.status === 'published').length || 0

  // Category-based skill calculation
  const skillCategoryCount = skills?.length
    ? new Set(skills.map((s) => s.category)).size
    : 0

  const stats = [
    { label: 'Projects', value: `${projectCount}+` },
    { label: 'Blog Posts', value: `${publishedBlogCount}+` },
    { label: 'GitHub Repos', value: `${repoCount || 0}+` },
  ]

  return (
    <section className="section-padding" id="about">
      <div className="container-width">
        <SectionHeading label="About Me" title="Who I Am" />

        <div className="grid md:grid-cols-[300px_1fr] gap-10 md:gap-14 items-start">
          {/* Left - Profile card */}
          <AnimatedSection variants={slideLeft} className="group md:sticky md:top-28">
            <div className="max-w-[300px] mx-auto md:mx-0">
              {/* Photo */}
              <div
                className="relative w-full aspect-[4/5] rounded-[20px] overflow-hidden mb-4"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                {isLoading ? (
                  <SkeletonAvatar size={300} />
                ) : profile?.aboutPhoto ? (
                  <Image
                    src={profile.aboutPhoto}
                    alt={profile.name || 'Profile photo'}
                    fill
                    className="object-cover transition-all duration-500 ease-out
                               md:grayscale md:group-hover:grayscale-0 md:group-hover:scale-[1.03]"
                    sizes="(max-width: 768px) 300px, 300px"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: 'var(--bg-tertiary)' }}
                  >
                    <span style={{ color: 'var(--text-tertiary)' }}>No photo</span>
                  </div>
                )}
              </div>

              {/* Stat cards */}
              <div className="grid grid-cols-3 gap-2.5">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center justify-center gap-1 px-2 py-4 rounded-[14px] card-hover text-center"
                    style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                  >
                    <span
                      className="font-heading font-bold text-xl leading-none"
                      style={{ color: 'var(--brand-primary)' }}
                    >
                      {stat.value}
                    </span>
                    <span
                      className="text-[11px] leading-tight"
                      style={{ color: 'var(--text-tertiary)' }}
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </AnimatedSection>

          {/* Right - plain text + meta info */}
          <AnimatedSection variants={slideRight}>
            {isLoading ? (
              <div className="flex flex-col gap-3 mb-6">
                <SkeletonText className="h-4 w-full" />
                <SkeletonText className="h-4 w-full" />
                <SkeletonText className="h-4 w-2/3" />
              </div>
            ) : (
              <p
                className="text-base md:text-lg leading-relaxed whitespace-pre-line mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                {profile?.aboutText || 'No bio added yet.'}
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile?.location && (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <MapPin size={16} style={{ color: 'var(--brand-primary)' }} />
                  {profile.location}
                </div>
              )}
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Layers size={16} style={{ color: 'var(--brand-primary)' }} />
                {skillCategoryCount > 0
                  ? `Skilled across ${skillCategoryCount}+ tech categories`
                  : 'Always learning new tech'}
              </div>
              <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Globe size={16} style={{ color: 'var(--brand-primary)' }} />
                Remote / Hybrid
              </div>
              {profile?.email && (
                <div className="flex items-center gap-2 text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                  <Mail size={16} style={{ color: 'var(--brand-primary)' }} className="shrink-0" />
                  <span className="truncate">{profile.email}</span>
                </div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}