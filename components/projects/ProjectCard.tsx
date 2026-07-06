'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import type { IProject } from '@/types'

interface ProjectCardProps {
  project: IProject
  onOpenModal: (project: IProject) => void
}

export default function ProjectCard({ project, onOpenModal }: ProjectCardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="group h-full flex flex-col rounded-xl overflow-hidden card-hover cursor-pointer"
      style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
      onClick={() => onOpenModal(project)}
    >
      <div className="relative aspect-video overflow-hidden">
        {project.imageUrl ? (
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'var(--bg-tertiary)' }}
          >
            <span style={{ color: 'var(--text-tertiary)' }}>No image</span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'rgba(10, 10, 15, 0.55)' }}
        >
          <span
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
            style={{ background: 'var(--brand-primary)' }}
          >
            <Eye size={15} />
            See Details
          </span>
        </div>

        {project.featured && (
          <span
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white"
            style={{ background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
          >
            Featured
          </span>
        )}

        <span
          className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium capitalize"
          style={{
            background: 'rgba(10, 10, 15, 0.6)',
            color: '#fff',
            backdropFilter: 'blur(4px)',
          }}
        >
          {project.status}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3
          className="font-heading font-semibold text-lg mb-1.5 line-clamp-1"
          style={{ color: 'var(--text-primary)' }}
        >
          {project.title}
        </h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-auto">
          {project.techStack.slice(0, 3).map((tech) => (
            <span
              key={tech}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
            >
              {tech}
            </span>
          ))}
          {project.techStack.length > 3 && (
            <span className="px-2 py-0.5 rounded text-xs" style={{ color: 'var(--text-tertiary)' }}>
              +{project.techStack.length - 3}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}