'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, X, Loader2 } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/admin/AdminUI'
import { experienceSchema, type ExperienceInput } from '@/lib/validations'
import type { IExperience } from '@/types'

async function fetchExperience(): Promise<IExperience[]> {
  const { data } = await axios.get('/api/experience')
  return data
}

const emptyExperience: ExperienceInput = {
  jobTitle: '',
  company: '',
  startDate: '',
  endDate: null,
  current: false,
  description: '',
  skills: [],
  order: 0,
}

export default function ExperiencePage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [skillInput, setSkillInput] = useState('')

  const { data: experiences = [], isLoading } = useQuery({
    queryKey: ['experience-admin'],
    queryFn: fetchExperience,
  })

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceInput>({
    resolver: zodResolver(experienceSchema),
    defaultValues: emptyExperience,
  })

  const skills = watch('skills')
  const current = watch('current')

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['experience-admin'] })
    queryClient.invalidateQueries({ queryKey: ['experience'] })
  }

  const createMutation = useMutation({
    mutationFn: (data: ExperienceInput) => axios.post('/api/experience', data),
    onSuccess: () => {
      toast.success('Experience added')
      invalidate()
      closeForm()
    },
    onError: () => toast.error('Failed to add experience'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: ExperienceInput) => axios.put(`/api/experience/${editingId}`, data),
    onSuccess: () => {
      toast.success('Experience updated')
      invalidate()
      closeForm()
    },
    onError: () => toast.error('Failed to update experience'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/experience/${id}`),
    onSuccess: () => {
      toast.success('Experience deleted')
      invalidate()
    },
    onError: () => toast.error('Failed to delete experience'),
  })

  const openCreate = () => {
    setEditingId(null)
    reset(emptyExperience)
    setIsFormOpen(true)
  }

  const openEdit = (exp: IExperience) => {
    setEditingId(exp._id)
    reset({
      jobTitle: exp.jobTitle,
      company: exp.company,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().slice(0, 10) : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().slice(0, 10) : null,
      current: exp.current,
      description: exp.description || '',
      skills: exp.skills || [],
      order: exp.order,
    })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setSkillInput('')
  }

  const onSubmit = (data: ExperienceInput) => {
    if (editingId) updateMutation.mutate(data)
    else createMutation.mutate(data)
  }

  const addSkill = () => {
    const value = skillInput.trim()
    if (value && !skills.includes(value)) {
      setValue('skills', [...skills, value])
    }
    setSkillInput('')
  }

  const removeSkill = (skill: string) => {
    setValue('skills', skills.filter((s) => s !== skill))
  }

  const columns: DataTableColumn<IExperience>[] = [
    { header: 'Job Title', accessor: (row) => <span className="font-medium">{row.jobTitle}</span> },
    { header: 'Company', accessor: (row) => row.company },
    {
      header: 'Duration',
      accessor: (row) =>
        `${new Date(row.startDate).toLocaleDateString()} — ${row.current ? 'Present' : row.endDate ? new Date(row.endDate).toLocaleDateString() : '—'}`,
    },
  ]

  const inputStyle = {
    background: 'var(--bg-tertiary)',
    border: '1px solid var(--border)',
    color: 'var(--text-primary)',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
            Experience
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Manage your work experience timeline
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
        >
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <DataTable
        columns={columns}
        data={experiences}
        getRowId={(row) => row._id}
        onEdit={openEdit}
        onDelete={(row) => deleteMutation.mutate(row._id)}
        isLoading={isLoading}
        emptyMessage="No experience added yet."
      />

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border p-6"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Experience' : 'Add Experience'}
              </h2>
              <button onClick={closeForm} style={{ color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Job Title *
                </label>
                <input {...register('jobTitle')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                {errors.jobTitle && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.jobTitle.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Company *
                </label>
                <input {...register('company')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                {errors.company && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.company.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Start Date *
                  </label>
                  <input type="date" {...register('startDate')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                  {errors.startDate && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.startDate.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    End Date
                  </label>
                  <input
                    type="date"
                    {...register('endDate')}
                    disabled={current}
                    className="w-full px-4 py-2.5 rounded-lg text-sm outline-none disabled:opacity-50"
                    style={inputStyle}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" {...register('current')} id="current" className="w-4 h-4" />
                <label htmlFor="current" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Currently working here
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Description
                </label>
                <textarea {...register('description')} rows={3} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Skills Used
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addSkill()
                      }
                    }}
                    placeholder="Type and press Enter"
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle}
                  />
                  <button type="button" onClick={addSkill} className="px-3 rounded-lg text-sm" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Order
                </label>
                <input type="number" {...register('order', { valueAsNumber: true })} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
                >
                  {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? 'Save Changes' : 'Add Experience'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2.5 rounded-lg text-sm font-medium border"
                  style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}