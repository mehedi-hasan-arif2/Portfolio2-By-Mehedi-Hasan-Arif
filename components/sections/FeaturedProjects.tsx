'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'
import { SkeletonGrid } from '@/components/common/LoadingSkeleton'
import { staggerContainer, slideUp } from '@/constants/animations'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectModal from '@/components/projects/ProjectModal'
import type { IProject } from '@/types'

async function fetchProjects(): Promise<IProject[]> {
  const { data } = await axios.get<IProject[]>('/api/projects')
  return data
}

export default function FeaturedProjects() {
  const [selected, setSelected] = useState<IProject | null>(null)

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  })

  const featured = (projects || []).filter((p) => p.featured).slice(0, 3)

  return (
    <section className="section-padding" id="projects">
      <div className="container-width">
        <SectionHeading
          label="Featured Work"
          title="Selected Projects"
          description="A few things I've built recently."
        />

        {isLoading ? (
          <SkeletonGrid count={3} />
        ) : featured.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-tertiary)' }}>
            No featured projects yet.
          </p>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {featured.map((project) => (
              <motion.div key={project._id} variants={slideUp}>
                <ProjectCard project={project} onOpenModal={setSelected} />
              </motion.div>
            ))}
          </motion.div>
        )}

        <div className="text-center mt-10">
          <Link
            href="/projects"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              color: 'var(--text-primary)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            View All Projects
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </section>
  )
}