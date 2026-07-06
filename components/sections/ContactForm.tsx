'use client'

import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Mail, MapPin, Clock, Send, CheckCircle2, XCircle } from 'lucide-react'
import SectionHeading from '@/components/common/SectionHeading'
import type { IProfile } from '@/types'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

async function fetchProfile(): Promise<IProfile> {
  const { data } = await axios.get<IProfile>('/api/profile')
  return data
}

export default function ContactForm() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 5 * 60 * 1000,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      await axios.post('/api/contact', data)
      toast.success('Message sent!', {
        description: "I'll get back to you soon.",
        icon: <CheckCircle2 size={18} style={{ color: 'var(--color-success)' }} />,
        style: {
          background: 'var(--bg-secondary)',
          border: '1px solid color-mix(in srgb, var(--color-success) 35%, var(--border))',
        },
      })
      reset()
    } catch {
      toast.error('Something went wrong', {
        description: 'Please try again in a moment.',
        icon: <XCircle size={18} style={{ color: 'var(--color-error)' }} />,
        style: {
          background: 'var(--bg-secondary)',
          border: '1px solid color-mix(in srgb, var(--color-error) 35%, var(--border))',
        },
      })
    }
  }

  const inputStyle = {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <section className="section-padding" id="contact">
      <div className="container-width">
        <SectionHeading
          label="Get In Touch"
          title="Let's Work Together"
          description="Have a project in mind? Send me a message."
        />

        <div className="grid md:grid-cols-5 gap-10 max-w-5xl mx-auto">
          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="md:col-span-3 flex flex-col gap-4"
          >
            <div>
              <input
                {...register('name')}
                placeholder="Your Name *"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors focus:border-[var(--brand-primary)]"
                style={inputStyle}
              />
              {errors.name && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <input
                {...register('email')}
                type="email"
                placeholder="Your Email *"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors focus:border-[var(--brand-primary)]"
                style={inputStyle}
              />
              {errors.email && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
                  {errors.email.message}
                </p>
              )}
            </div>

            <input
              {...register('subject')}
              placeholder="Subject"
              className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-colors focus:border-[var(--brand-primary)]"
              style={inputStyle}
            />

            <div>
              <textarea
                {...register('message')}
                placeholder="Your Message *"
                rows={5}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none transition-colors focus:border-[var(--brand-primary)]"
                style={inputStyle}
              />
              {errors.message && (
                <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>
                  {errors.message.message}
                </p>
              )}
            </div>

            {/* Send button - subtle idle shimmer, stronger distinct animation on hover */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
              transition={{ backgroundPosition: { duration: 6, repeat: Infinity, ease: 'linear' } }}
              whileHover={!isSubmitting ? { scale: 1.03, y: -3 } : undefined}
              whileTap={!isSubmitting ? { scale: 0.97 } : undefined}
              className="relative flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white overflow-hidden disabled:opacity-60"
              style={{
                backgroundImage:
                  'linear-gradient(120deg, var(--brand-primary), var(--brand-secondary), var(--brand-accent), var(--brand-primary))',
                backgroundSize: '300% 300%',
                boxShadow: '0 4px 16px color-mix(in srgb, var(--brand-primary) 28%, transparent)',
                transition: 'box-shadow 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 10px 30px color-mix(in srgb, var(--brand-secondary) 45%, transparent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow =
                  '0 4px 16px color-mix(in srgb, var(--brand-primary) 28%, transparent)'
              }}
            >
              <Send size={15} />
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </motion.button>
          </form>

          {/* Info */}
          <div className="md:col-span-2 flex flex-col gap-5">
            {profile?.email && (
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)' }}
                >
                  <Mail size={16} style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Email
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-sm transition-colors hover:opacity-80"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            )}

            {profile?.location && (
              <div className="flex items-start gap-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)' }}
                >
                  <MapPin size={16} style={{ color: 'var(--brand-primary)' }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    Location
                  </p>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {profile.location}
                  </p>
                </div>
              </div>
            )}

            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'color-mix(in srgb, var(--brand-primary) 12%, transparent)' }}
              >
                <Clock size={16} style={{ color: 'var(--brand-primary)' }} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  Response Time
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Usually within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}