import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
export type LoginInput = z.infer<typeof loginSchema>

export const projectSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  techStack: z.array(z.string()).default([]),
  liveUrl: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  githubUrl: z.string().url('Enter a valid URL').or(z.literal('')).optional(),
  imageUrl: z.string().optional(),
  featured: z.boolean().default(false),
  status: z.enum(['completed', 'ongoing']).default('completed'),
  order: z.number().default(0),
})
export type ProjectInput = z.infer<typeof projectSchema>

export const blogSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  slug: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().min(20, 'Content is too short'),
  coverImage: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  status: z.enum(['draft', 'published']).default('draft'),
})
export type BlogInput = z.infer<typeof blogSchema>

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.string().min(1, 'Category is required'),
  order: z.number().default(0),
})
export type SkillInput = z.infer<typeof skillSchema>

export const experienceSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().nullable().optional(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  skills: z.array(z.string()).default([]),
  order: z.number().default(0),
})
export type ExperienceInput = z.infer<typeof experienceSchema>

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  jobTitles: z.array(z.string()).default([]),
  shortBio: z.string().optional(),
  aboutText: z.string().optional(),
  location: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  heroPhoto: z.string().optional(),
  aboutPhoto: z.string().optional(),
  resumeUrl: z.string().optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})
export type ProfileInput = z.infer<typeof profileSchema>