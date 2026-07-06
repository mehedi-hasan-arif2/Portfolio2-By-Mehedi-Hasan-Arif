'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion } from 'framer-motion'
import { Briefcase } from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'
import { SkeletonText } from '@/components/common/LoadingSkeleton'
import { formatDate } from '@/lib/utils'
import type { IExperience } from '@/types'

async function fetchExperience(): Promise<IExperience[]> {
  const { data } = await axios.get<IExperience[]>('/api/experience')
  return data
}

export default function Experience() {
  const { data: experience, isLoading } = useQuery({
    queryKey: ['experience'],
    queryFn: fetchExperience,
    staleTime: 5 * 60 * 1000,
  })

  const items = experience || []

  return (
    <section className="section-padding" id="experience" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container-width">
        <SectionHeading label="Journey" title="Work Experience" />

        {isLoading ? (
          <div className="max-w-2xl mx-auto flex flex-col gap-8">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <SkeletonText className="h-5 w-1/2" />
                <SkeletonText className="h-4 w-1/3" />
                <SkeletonText className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-tertiary)' }}>
            No experience added yet.
          </p>
        ) : (
          <div className="relative max-w-4xl mx-auto">
            {/* Center line - hidden on mobile, visible from md up */}
            <div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ background: 'var(--border)' }}
            />
            {/* Mobile line - left aligned */}
            <div
              className="md:hidden absolute left-[15px] top-2 bottom-2 w-px"
              style={{ background: 'var(--border)' }}
            />

            <div className="flex flex-col gap-10 md:gap-14">
              {items.map((exp, i) => {
                const isLeft = i % 2 === 0

                return (
                  <motion.div
                    key={exp._id}
                    initial={{ opacity: 0, x: isLeft ? -30 : 30, y: 10 }}
                    whileInView={{ opacity: 1, x: 0, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative md:grid md:grid-cols-2 md:gap-10 items-center"
                  >
                    {/* Dot - centered on desktop, left-aligned on mobile */}
                    <div className="absolute left-[9px] md:left-1/2 top-1.5 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
                      {exp.current ? (
                        <span className="relative flex h-4 w-4">
                          <span
                            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                            style={{ background: 'var(--brand-primary)' }}
                          />
                          <span
                            className="relative inline-flex rounded-full h-4 w-4"
                            style={{
                              background: 'var(--brand-primary)',
                              boxShadow: '0 0 0 4px var(--bg-secondary), 0 0 14px color-mix(in srgb, var(--brand-primary) 60%, transparent)',
                            }}
                          />
                        </span>
                      ) : (
                        <span
                          className="block w-4 h-4 rounded-full"
                          style={{
                            background: 'var(--bg-secondary)',
                            border: '2px solid var(--text-tertiary)',
                            boxShadow: '0 0 0 4px var(--bg-secondary)',
                          }}
                        />
                      )}
                    </div>

                    {/* Card - alternates side on desktop, always right of line on mobile */}
                    <div
                      className={
                        isLeft
                          ? 'md:col-start-1 md:row-start-1 md:text-right md:pr-2'
                          : 'md:col-start-2 md:row-start-1 md:pl-2'
                      }
                    >
                      <div
                        className="ml-8 md:ml-0 p-5 rounded-xl card-hover"
                        style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                      >
                        <div
                          className={`flex items-center gap-2 mb-2 ${isLeft ? 'md:justify-end' : ''}`}
                        >
                          {exp.current && (
                            <span
                              className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide"
                              style={{
                                background: 'color-mix(in srgb, var(--brand-primary) 14%, transparent)',
                                color: 'var(--brand-primary)',
                              }}
                            >
                              Current
                            </span>
                          )}
                          <span
                            className="flex items-center gap-1.5 text-xs"
                            style={{ color: 'var(--text-tertiary)' }}
                          >
                            <Briefcase size={12} />
                            {formatDate(exp.startDate)} —{' '}
                            {exp.current || !exp.endDate ? 'Present' : formatDate(exp.endDate)}
                          </span>
                        </div>

                        <h3
                          className="font-heading font-semibold text-lg mb-0.5"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {exp.jobTitle}
                        </h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--brand-primary)' }}>
                          {exp.company}
                        </p>

                        {exp.description && (
                          <p
                            className="text-sm leading-relaxed mb-3"
                            style={{ color: 'var(--text-secondary)' }}
                          >
                            {exp.description}
                          </p>
                        )}

                        {exp.skills?.length > 0 && (
                          <div className={`flex flex-wrap gap-1.5 ${isLeft ? 'md:justify-end' : ''}`}>
                            {exp.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-0.5 rounded text-xs"
                                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}