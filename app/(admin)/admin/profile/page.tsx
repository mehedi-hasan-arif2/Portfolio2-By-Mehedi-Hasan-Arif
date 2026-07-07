'use client'

import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Save } from 'lucide-react'
import { ImageUpload } from '@/components/admin/AdminUI'
import { profileSchema, type ProfileInput } from '@/lib/validations'
import type { IProfile } from '@/types'

async function fetchProfile(): Promise<IProfile | null> {
  const { data } = await axios.get('/api/profile')
  return data
}

const emptyProfile: ProfileInput = {
  name: '',
  jobTitles: [],
  shortBio: '',
  aboutText: '',
  location: '',
  email: '',
  github: '',
  linkedin: '',
  facebook: '',
  instagram: '',
  whatsapp: '',
  heroPhoto: '',
  aboutPhoto: '',
  resumeUrl: '',
  seoTitle: '',
  seoDescription: '',
}

export default function ProfilePage() {
  const queryClient = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile-admin'],
    queryFn: fetchProfile,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: emptyProfile,
  })

  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        jobTitles: profile.jobTitles || [],
        shortBio: profile.shortBio || '',
        aboutText: profile.aboutText || '',
        location: profile.location || '',
        email: profile.email || '',
        github: profile.github || '',
        linkedin: profile.linkedin || '',
        facebook: profile.facebook || '',
        instagram: profile.instagram || '',
        whatsapp: profile.whatsapp || '',
        heroPhoto: profile.heroPhoto || '',
        aboutPhoto: profile.aboutPhoto || '',
        resumeUrl: profile.resumeUrl || '',
        seoTitle: profile.seoTitle || '',
        seoDescription: profile.seoDescription || '',
      })
    }
  }, [profile, reset])

  const jobTitlesText = watch('jobTitles')

  const updateMutation = useMutation({
    mutationFn: (data: ProfileInput) => axios.put('/api/profile', data),
    onSuccess: () => {
      toast.success('Profile updated')
      queryClient.invalidateQueries({ queryKey: ['profile-admin'] })
      queryClient.invalidateQueries({ queryKey: ['profile'] })
    },
    onError: () => toast.error('Failed to update profile'),
  })

  const onSubmit = (data: ProfileInput) => {
    updateMutation.mutate(data)
  }

  const inputStyle = {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 size={24} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl md:max-w-4xl">
      <div>
        <h1 className="font-heading font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          Profile
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Update your public profile information
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Basic Info
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Name
              </label>
              <input {...register('name')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Job Titles (comma-separated)
              </label>
              <input
                value={jobTitlesText.join(', ')}
                onChange={(e) =>
                  setValue(
                    'jobTitles',
                    e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                  )
                }
                placeholder="MERN Stack Developer, Full Stack Web Developer"
                className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                style={inputStyle}
              />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Short Bio
              </label>
              <textarea {...register('shortBio')} rows={2} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
            </div>

            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                About Text
              </label>
              <textarea {...register('aboutText')} rows={5} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Location
                </label>
                <input {...register('location')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Public Email
                </label>
                <input {...register('email')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Social Links
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                GitHub
              </label>
              <input {...register('github')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                LinkedIn
              </label>
              <input {...register('linkedin')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Facebook
              </label>
              <input {...register('facebook')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Instagram
              </label>
              <input {...register('instagram')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                WhatsApp
              </label>
              <input {...register('whatsapp')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Media
          </h3>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                Hero Photo
              </label>
              <Controller
                name="heroPhoto"
                control={control}
                render={({ field }) => (
                  <ImageUpload value={field.value || ''} onChange={(v) => field.onChange(v)} folder="profile" />
                )}
              />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                About Photo
              </label>
              <Controller
                name="aboutPhoto"
                control={control}
                render={({ field }) => (
                  <ImageUpload value={field.value || ''} onChange={(v) => field.onChange(v)} folder="profile" />
                )}
              />
            </div>
          </div>

          <div className="mt-5">
            <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
              Resume (PDF)
            </label>
            <Controller
              name="resumeUrl"
              control={control}
              render={({ field }) => (
                <ImageUpload
                  value={field.value || ''}
                  onChange={(v) => field.onChange(v)}
                  folder="resume"
                  accept="application/pdf"
                />
              )}
            />
          </div>
        </div>

        <div className="rounded-xl border p-5" style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}>
          <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            SEO
          </h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                SEO Title
              </label>
              <input {...register('seoTitle')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
            </div>
            <div>
              <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                SEO Description
              </label>
              <textarea {...register('seoDescription')} rows={2} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-60 self-start"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
        >
          {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Profile
        </button>
      </form>
    </div>
  )
}