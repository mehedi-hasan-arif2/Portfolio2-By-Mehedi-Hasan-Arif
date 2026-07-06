export interface IProfile {
  _id: string
  name: string
  jobTitles: string[]
  shortBio: string
  aboutText: string
  location: string
  email: string
  github: string
  linkedin: string
  facebook: string
  instagram: string
  whatsapp: string
  heroPhoto: string
  aboutPhoto: string
  resumeUrl: string
  seoTitle: string
  seoDescription: string
}

export interface IProject {
  _id: string
  title: string
  subtitle: string
  description: string
  techStack: string[]
  liveUrl: string
  githubUrl: string
  imageUrl: string
  featured: boolean
  status: 'completed' | 'ongoing'
  order: number
  createdAt: string
}

export interface IBlog {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  readingTime: number
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string
}

export interface ISkill {
  _id: string
  name: string
  category: string
  order: number
}

export interface IExperience {
  _id: string
  jobTitle: string
  company: string
  startDate: string
  endDate: string | null
  current: boolean
  description: string
  skills: string[]
  order: number
}

export interface IContact {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: string
}
