'use client'

import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import { X, ExternalLink, Github } from 'lucide-react'
import type { IProject } from '@/types'

interface ProjectModalProps {
  project: IProject | null
  onClose: () => void
}

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  return (
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(10, 10, 15, 0.6)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)' }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl"
            style={{
              background: 'color-mix(in srgb, var(--bg-secondary) 68%, transparent)',
              backdropFilter: 'blur(20px) saturate(150%)',
              WebkitBackdropFilter: 'blur(20px) saturate(150%)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              aria-label="Close"
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-colors hover:opacity-80"
              style={{ background: 'rgba(10, 10, 15, 0.6)', backdropFilter: 'blur(4px)' }}
            >
              <X size={16} className="text-white" />
            </button>

            <div className="relative aspect-video">
              {project.imageUrl ? (
                <Image
                  src={project.imageUrl}
                  alt={project.title}
                  fill
                  className="object-cover rounded-t-2xl"
                  sizes="(max-width: 768px) 100vw, 700px"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center rounded-t-2xl"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <span style={{ color: 'var(--text-tertiary)' }}>No image</span>
                </div>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-center gap-2 mb-2">
                {project.featured && (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-semibold text-white"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                    }}
                  >
                    Featured
                  </span>
                )}
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-medium capitalize"
                  style={{ background: 'var(--bg-tertiary)', color: 'var(--text-tertiary)' }}
                >
                  {project.status}
                </span>
              </div>

              <h2
                className="font-heading font-bold text-2xl mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {project.title}
              </h2>
              {project.subtitle && (
                <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
                  {project.subtitle}
                </p>
              )}

              <p
                className="text-sm leading-relaxed mb-5 whitespace-pre-line"
                style={{ color: 'var(--text-secondary)' }}
              >
                {project.description}
              </p>

              {project.techStack?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-transform hover:scale-[1.03]"
                    style={{
                      background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
                    }}
                  >
                    <ExternalLink size={14} />
                    Live Demo
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-colors hover:opacity-80"
                    style={{ border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                  >
                    <Github size={14} />
                    GitHub
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}