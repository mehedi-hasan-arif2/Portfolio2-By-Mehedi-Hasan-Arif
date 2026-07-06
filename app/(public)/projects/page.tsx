'use client'

import { useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'
import Container from '@/components/layout/Container'
import SectionHeading from '@/components/common/SectionHeading'
import { SkeletonGrid } from '@/components/common/LoadingSkeleton'
import ProjectCard from '@/components/projects/ProjectCard'
import ProjectModal from '@/components/projects/ProjectModal'
import type { IProject } from '@/types'

async function fetchProjects(): Promise<IProject[]> {
  const { data } = await axios.get<IProject[]>('/api/projects')
  return data
}

const FILTERS = ['All', 'Featured', 'Completed', 'Ongoing'] as const
type Filter = (typeof FILTERS)[number]

export default function ProjectsPage() {
  const [activeFilter, setActiveFilter] = useState<Filter>('All')
  const [selected, setSelected] = useState<IProject | null>(null)

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
    staleTime: 5 * 60 * 1000,
  })

  const filtered = useMemo(() => {
    if (!projects) return []
    switch (activeFilter) {
      case 'Featured':
        return projects.filter((p) => p.featured)
      case 'Completed':
        return projects.filter((p) => p.status === 'completed')
      case 'Ongoing':
        return projects.filter((p) => p.status === 'ongoing')
      default:
        return projects
    }
  }, [projects, activeFilter])

  return (
    <div className="pt-32 pb-20">
      <Container>
        <SectionHeading
          label="Portfolio"
          title="All Projects"
          description="A collection of things I've built, from small experiments to full-scale applications."
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={
                activeFilter === filter
                  ? {
                      background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                      color: '#fff',
                    }
                  : {
                      background: 'var(--bg-tertiary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border)',
                    }
              }
            >
              {filter}
            </button>
          ))}
        </div>

        {isLoading ? (
          <SkeletonGrid count={6} />
        ) : filtered.length === 0 ? (
          <p className="text-center py-12" style={{ color: 'var(--text-tertiary)' }}>
            No projects found in this category.
          </p>
        ) : (
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((project) => (
                <ProjectCard key={project._id} project={project} onOpenModal={setSelected} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </div>
  )
}