'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Instagram, ArrowDown, ArrowRight } from 'lucide-react'
import Container from '@/components/layout/Container'
import { SkeletonText } from '@/components/common/LoadingSkeleton'
import type { IProfile } from '@/types'

async function fetchProfile(): Promise<IProfile> {
  const { data } = await axios.get<IProfile>('/api/profile')
  return data
}

// JobTitles with Fade + Slide transition
function RoleRotator({ titles }: { titles: string[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (titles.length <= 1) return
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % titles.length)
    }, 2800)
    return () => clearInterval(interval)
  }, [titles.length])

  return (
    <div className="h-9 md:h-10 mb-6 overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h2
          key={titles[index]}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="font-heading font-semibold text-2xl md:text-3xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          {titles[index]}
        </motion.h2>
      </AnimatePresence>
    </div>
  )
}

export default function Hero() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  const jobTitles =
    profile?.jobTitles && profile.jobTitles.length > 0
      ? profile.jobTitles
      : ['Full Stack Developer']

  const socials = [
    { icon: Github, href: profile?.github, label: 'GitHub' },
    { icon: Linkedin, href: profile?.linkedin, label: 'LinkedIn' },
    { icon: Instagram, href: profile?.instagram, label: 'Instagram' },
  ].filter((s) => Boolean(s.href))

  return (
    <section className="relative min-h-screen flex items-center bg-mesh overflow-hidden" id="home">
      <Container className="relative z-10 py-32">
        <div className="grid md:grid-cols-5 gap-10 md:gap-12 items-center">
          {/* Hero photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="order-first md:order-last md:col-span-2 relative flex justify-center"
          >
            <div className="relative w-full max-w-[240px] sm:max-w-[300px] md:max-w-[380px]">
              {/* Ambient glow behind frame */}
              <div
                className="absolute inset-0 rounded-full blur-[80px] md:blur-[100px] opacity-25"
                style={{ background: 'var(--brand-primary)' }}
              />

              {/* Rectangular image frame */}
              <div
                className="relative w-full aspect-[4/5] rounded-[20px] md:rounded-[24px] overflow-hidden"
                style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
              >
                {profile?.heroPhoto ? (
                  <Image
                    src={profile.heroPhoto}
                    alt={profile.name || 'Profile photo'}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width: 768px) 300px, 400px"
                    priority
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
            </div>
          </motion.div>

          {/* Text content */}
          <div className="md:col-span-3 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 uppercase tracking-wide"
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border)',
                color: 'var(--text-secondary)',
              }}
            >
              <span className="relative flex h-2 w-2">
                <span
                  className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                  style={{ background: 'var(--color-success)' }}
                />
                <span
                  className="relative inline-flex rounded-full h-2 w-2"
                  style={{ background: 'var(--color-success)' }}
                />
              </span>
              Available for work
            </motion.div>

            {isLoading ? (
              <SkeletonText className="h-14 w-96 max-w-full mb-2" />
            ) : (
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="font-heading font-bold tracking-tight text-4xl sm:text-5xl md:text-6xl mb-3"
                style={{ color: 'var(--text-primary)' }}
              >
                Hi, I&apos;m{' '}
                <span className="text-gradient">{profile?.name || 'Developer'}</span>
              </motion.h1>
            )}

            {/* Role rotator */}
            {isLoading ? (
              <SkeletonText className="h-8 w-64 mt-3 mb-6" />
            ) : (
              <RoleRotator titles={jobTitles} />
            )}

            {isLoading ? (
              <div className="flex flex-col gap-2 mb-8">
                <SkeletonText className="h-4 w-full max-w-lg" />
                <SkeletonText className="h-4 w-2/3 max-w-md" />
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-base md:text-lg mb-8 max-w-xl leading-relaxed"
                style={{ color: 'var(--text-secondary)' }}
              >
                {profile?.shortBio ||
                  'Building modern, user-friendly web applications with clean code and thoughtful design.'}
              </motion.p>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-10"
            >
              <Link
                href="/projects"
                className="group px-6 py-3 rounded-full text-sm font-semibold text-white transition-all duration-250 hover:-translate-y-0.5 inline-flex items-center gap-1.5"
                style={{
                  background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                  boxShadow: '0 4px 16px color-mix(in srgb, var(--brand-primary) 28%, transparent)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 10px 28px color-mix(in srgb, var(--brand-primary) 42%, transparent)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow =
                    '0 4px 16px color-mix(in srgb, var(--brand-primary) 28%, transparent)'
                }}
              >
                View My Work
                <ArrowRight
                  size={15}
                  className="transition-transform duration-200 group-hover:translate-x-1"
                />
              </Link>

              {/* View Resume button */}
              {profile?.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-colors duration-200"
                  style={{
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border)',
                    color: 'var(--text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-hover)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border)'
                  }}
                >
                  View Resume
                </a>
              )}
            </motion.div>

            {!isLoading && socials.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex items-center justify-center md:justify-start gap-3"
              >
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                    style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border)' }}
                  >
                    <Icon size={16} style={{ color: 'var(--text-secondary)' }} />
                  </a>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </Container>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <ArrowDown size={18} style={{ color: 'var(--text-tertiary)' }} />
      </motion.div>
    </section>
  )
}