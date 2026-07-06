'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { motion } from 'framer-motion'
import {
  Code2,
  Server,
  Database as DatabaseIcon,
  ShieldCheck,
  Globe,
  Cloud,
  GitBranch,
  Palette,
  Terminal,
  Sparkles,
  Layers,
  Rocket,
  FileCode2,
  Image as ImageIcon,
  PenTool,
} from 'lucide-react'
import {
  SiJavascript,
  SiTypescript,
  SiHtml5,
  SiC,
  SiCplusplus,
  SiPython,
  SiReact,
  SiNextdotjs,
  SiTailwindcss,
  SiShadcnui,
  SiDaisyui,
  SiFramer,
  SiReactrouter,
  SiReacthookform,
  SiReactquery,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiJsonwebtokens,
  SiFirebase,
  SiAxios,
  SiVercel,
  SiNetlify,
  SiRender,
  SiGit,
  SiGithub,
  SiCloudinary,
  SiFigma,
  SiPenpot,
  SiPostman,
  SiNpm,
} from 'react-icons/si'
import { FaJava } from 'react-icons/fa'
import SectionHeading from '@/components/common/SectionHeading'
import { SkeletonGrid } from '@/components/common/LoadingSkeleton'
import type { ISkill } from '@/types'

async function fetchSkills(): Promise<ISkill[]> {
  const { data } = await axios.get<ISkill[]>('/api/skills')
  return data
}

type IconEntry = { icon: React.ElementType; color: string; mono?: boolean }

function normalize(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]/g, '')
}

// Exact icon + official brand color mapping for every seeded skill.
// mono: true -> icon uses theme text color instead of a fixed brand color (for black/white logos)
const ICON_MAP: Record<string, IconEntry> = {
  javascriptes6: { icon: SiJavascript, color: '#F7DF1E' },
  javascript: { icon: SiJavascript, color: '#F7DF1E' },
  typescript: { icon: SiTypescript, color: '#3178C6' },
  html5: { icon: SiHtml5, color: '#E34F26' },
  css3: { icon: FileCode2, color: '#1572B6' },
  c: { icon: SiC, color: '#A8B9CC' },
  cplusplus: { icon: SiCplusplus, color: '#00599C' },
  python: { icon: SiPython, color: '#3776AB' },
  java: { icon: FaJava, color: '#EA2D2E' },

  reactjs: { icon: SiReact, color: '#61DAFB' },
  react: { icon: SiReact, color: '#61DAFB' },
  nextjs: { icon: SiNextdotjs, color: '', mono: true },
  advancednextjs: { icon: SiNextdotjs, color: '', mono: true },
  tailwindcss: { icon: SiTailwindcss, color: '#06B6D4' },
  shadcnui: { icon: SiShadcnui, color: '', mono: true },
  daisyui: { icon: SiDaisyui, color: '#5A0EF8' },
  framermotion: { icon: SiFramer, color: '#0055FF' },
  reactrouter: { icon: SiReactrouter, color: '#CA4245' },
  reacthookform: { icon: SiReacthookform, color: '#EC5990' },
  tanstackquery: { icon: SiReactquery, color: '#FF4154' },

  nodejs: { icon: SiNodedotjs, color: '#339933' },
  expressjs: { icon: SiExpress, color: '', mono: true },

  mongodb: { icon: SiMongodb, color: '#47A248' },
  mongoose: { icon: SiMongodb, color: '#880000' },
  mongodbatlas: { icon: SiMongodb, color: '#47A248' },

  jwt: { icon: SiJsonwebtokens, color: '', mono: true },
  firebaseauthentication: { icon: SiFirebase, color: '#FFCA28' },
  betterauth: { icon: ShieldCheck, color: 'var(--brand-primary)' },

  restapi: { icon: Globe, color: 'var(--brand-accent)' },
  axios: { icon: SiAxios, color: '#5A29E4' },
  fetchapi: { icon: Globe, color: 'var(--brand-accent)' },

  vercel: { icon: SiVercel, color: '', mono: true },
  netlify: { icon: SiNetlify, color: '#00C7B7' },
  render: { icon: SiRender, color: '#46E3B7' },

  git: { icon: SiGit, color: '#F05032' },
  github: { icon: SiGithub, color: '', mono: true },

  cloudinary: { icon: SiCloudinary, color: '#3448C5' },
  imgbb: { icon: Cloud, color: 'var(--brand-accent)' },
  resend: { icon: Cloud, color: 'var(--brand-primary)' },
  formspree: { icon: Cloud, color: 'var(--brand-primary)' },

  figma: { icon: SiFigma, color: '#F24E1E' },
  penpot: { icon: SiPenpot, color: '#20BF55' },
  canva: { icon: Palette, color: '#00C4CC' },
  adobephotoshop: { icon: ImageIcon, color: '#31A8FF' },
  adobeillustrator: { icon: PenTool, color: '#FF9A00' },

  vscode: { icon: Terminal, color: '#007ACC' },
  postman: { icon: SiPostman, color: '#FF6C37' },
  npm: { icon: SiNpm, color: '#CB3837' },

  performanceoptimization: { icon: Rocket, color: 'var(--brand-accent)' },
  websecuritybestpractices: { icon: ShieldCheck, color: 'var(--brand-secondary)' },
  systemdesignfundamentals: { icon: Layers, color: 'var(--brand-primary)' },
}

function getSkillIcon(name: string): IconEntry {
  const key = normalize(name)
  return ICON_MAP[key] || { icon: Code2, color: 'var(--brand-primary)' }
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Programming Languages': Code2,
  Frontend: Layers,
  Backend: Server,
  Database: DatabaseIcon,
  Authentication: ShieldCheck,
  'API & Data Fetching': Globe,
  'Deployment & Hosting': Rocket,
  'Version Control': GitBranch,
  'Cloud & Services': Cloud,
  'Design Tools': Palette,
  'Developer Tools': Terminal,
  'Currently Learning': Sparkles,
}

// Keeps categories in a sensible, consistent order matching the seed structure
const CATEGORY_ORDER = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Database',
  'Authentication',
  'API & Data Fetching',
  'Deployment & Hosting',
  'Version Control',
  'Cloud & Services',
  'Design Tools',
  'Developer Tools',
  'Currently Learning',
]

export default function Skills() {
  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: fetchSkills,
    staleTime: 5 * 60 * 1000,
  })

  const grouped = (skills || []).reduce<Record<string, ISkill[]>>((acc, skill) => {
    const key = skill.category || 'Other'
    if (!acc[key]) acc[key] = []
    acc[key].push(skill)
    return acc
  }, {})

  const categories = Object.keys(grouped).sort((a, b) => {
    const ia = CATEGORY_ORDER.indexOf(a)
    const ib = CATEGORY_ORDER.indexOf(b)
    if (ia === -1 && ib === -1) return a.localeCompare(b)
    if (ia === -1) return 1
    if (ib === -1) return -1
    return ia - ib
  })

  return (
    <section className="section-padding" id="skills" style={{ background: 'var(--bg-secondary)' }}>
      <div className="container-width">
        <SectionHeading label="Skills" title="What I Work With" />

        {isLoading ? (
          <SkeletonGrid count={4} columns="grid-cols-1 md:grid-cols-2" />
        ) : categories.length === 0 ? (
          <p className="text-center" style={{ color: 'var(--text-tertiary)' }}>
            No skills added yet.
          </p>
        ) : (
          // Masonry-style columns - each card sizes to its own content,
          // no wasted space from row-height matching like a regular grid would cause.
          <div className="columns-1 md:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
            {categories.map((cat, catIndex) => {
              const CategoryIcon = CATEGORY_ICONS[cat] || Sparkles
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: (catIndex % 6) * 0.07, ease: [0.22, 1, 0.36, 1] }}
                  className="break-inside-avoid mb-5 p-5 rounded-xl card-hover"
                  style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)' }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        background: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)',
                      }}
                    >
                      <CategoryIcon size={16} style={{ color: 'var(--brand-primary)' }} />
                    </div>
                    <h3
                      className="font-heading font-semibold text-base"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {cat}
                    </h3>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {grouped[cat]
                      .sort((a, b) => a.order - b.order)
                      .map((skill) => {
                        const { icon: Icon, color, mono } = getSkillIcon(skill.name)
                        return (
                          <span
                            key={skill._id}
                            className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all duration-200"
                            style={{
                              background: 'var(--bg-tertiary)',
                              color: 'var(--text-secondary)',
                              border: '1px solid var(--border)',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = 'translateY(-2px)'
                              e.currentTarget.style.borderColor = 'var(--border-hover)'
                              e.currentTarget.style.boxShadow =
                                '0 6px 16px color-mix(in srgb, var(--brand-primary) 18%, transparent)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = 'translateY(0)'
                              e.currentTarget.style.borderColor = 'var(--border)'
                              e.currentTarget.style.boxShadow = 'none'
                            }}
                          >
                            <Icon
                              size={14}
                              style={{ color: mono ? 'var(--text-primary)' : color }}
                            />
                            {skill.name}
                          </span>
                        )
                      })}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}