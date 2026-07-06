'use client'

import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Github, Linkedin, Facebook, Instagram, Mail, MapPin, ArrowUpRight } from 'lucide-react'
import Container from './Container'
import type { IProfile } from '@/types'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Experience', href: '/#experience' },
  { label: 'Blog', href: '/blog' },
]

async function fetchProfile(): Promise<IProfile> {
  const { data } = await axios.get<IProfile>('/api/profile')
  return data
}

export default function Footer() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  const name = profile?.name || 'Portfolio'
  const bio = profile?.shortBio || ''
  const firstName = name.split(' ')[0]

  const socials = [
    { icon: Github, href: profile?.github, label: 'GitHub' },
    { icon: Linkedin, href: profile?.linkedin, label: 'LinkedIn' },
    { icon: Facebook, href: profile?.facebook, label: 'Facebook' },
    { icon: Instagram, href: profile?.instagram, label: 'Instagram' },
    {
      icon: Mail,
      href: profile?.email ? `mailto:${profile.email}` : undefined,
      label: 'Email',
    },
  ].filter((s): s is { icon: typeof Github; href: string; label: string } =>
    Boolean(s.href)
  )

  return (
    <footer style={{ borderTop: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          {/* Brand + bio */}
          <div className="md:col-span-4">
            <Link href="/" className="font-heading text-xl font-bold tracking-tight">
              {isLoading ? (
                <span
                  className="inline-block h-6 w-32 rounded animate-pulse"
                  style={{ background: 'var(--bg-tertiary)' }}
                />
              ) : (
                <>
                  <span style={{ color: 'var(--text-primary)' }}>{firstName}</span>
                  <span className="text-gradient">.dev</span>
                </>
              )}
            </Link>

            {isLoading ? (
              <span
                className="mt-3 inline-block h-4 w-48 rounded animate-pulse"
                style={{ background: 'var(--bg-tertiary)' }}
              />
            ) : (
              <p
                className="mt-3 text-sm leading-relaxed max-w-xs"
                style={{ color: 'var(--text-secondary)' }}
              >
                {bio}
              </p>
            )}

            {/* Socials */}
            <div className="flex gap-2.5 flex-wrap mt-6">
              {isLoading
                ? [0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className="w-9 h-9 rounded-full animate-pulse"
                    style={{ background: 'var(--bg-tertiary)' }}
                  />
                ))
                : socials.map((social) => {
                  const Icon = social.icon
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--border)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--brand-primary)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                      }}
                    >
                      <Icon size={15} style={{ color: 'var(--text-secondary)' }} />
                    </a>
                  )
                })}
            </div>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2">
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Navigation
            </h4>
            <ul className="flex flex-col gap-2.5">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center text-sm w-fit transition-all duration-300 hover:translate-x-1"
                    style={{ color: 'var(--text-secondary)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = 'var(--text-primary)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'var(--text-secondary)'
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get in touch */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Get In Touch
            </h4>
            <div className="flex flex-col gap-3">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-sm transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)'
                  }}
                >
                  <Mail size={15} style={{ color: 'var(--brand-primary)' }} />
                  {profile.email}
                </a>
              )}
              {profile?.location && (
                <div
                  className="flex items-center gap-2 text-sm"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <MapPin size={15} style={{ color: 'var(--brand-primary)' }} />
                  {profile.location}
                </div>
              )}
            </div>
          </div>

          {/* CTA */}
          <div className="md:col-span-3">
            <h4 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
              Let&apos;s Build Something
            </h4>
            <p className="text-sm mb-4 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Have a project in mind? Let&apos;s talk.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold transition-all duration-200"
              style={{ color: 'var(--brand-primary)' }}
            >
              Contact Me
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs"
          style={{ borderTop: '1px solid var(--border)', color: 'var(--text-tertiary)' }}
        >
          <p>
            &copy; {new Date().getFullYear()} {name}. All rights reserved.
          </p>

          <p className="flex items-center gap-1">
            <span>Developed by</span>
            <a
              href="https://www.instagram.com/mharif982/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative font-medium"
              style={{ color: 'var(--text-secondary)' }}
            >
              <span className="transition-colors duration-200 group-hover:text-[var(--brand-primary)]">
                Mehedi Hasan Arif
              </span>
              <span className="absolute left-0 -bottom-0.5 h-px w-0 bg-[var(--brand-primary)] transition-all duration-300 group-hover:w-full" />
            </a>
            <span className="animate-pulse text-base" style={{ color: 'var(--brand-primary)' }}>
              &hearts;
            </span>
          </p>
        </div>
      </Container>
    </footer>
  )
}