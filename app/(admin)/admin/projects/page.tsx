'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, X, Loader2, Star } from 'lucide-react'
import { DataTable, ImageUpload, StatusBadge, type DataTableColumn } from '@/components/admin/AdminUI'
import { projectSchema, type ProjectInput } from '@/lib/validations'
import type { IProject } from '@/types'

async function fetchProjects(): Promise<IProject[]> {
  const { data } = await axios.get('/api/projects')
  return data
}

const emptyProject: ProjectInput = {
  title: '',
  subtitle: '',
  description: '',
  techStack: [],
  liveUrl: '',
  githubUrl: '',
  imageUrl: '',
  featured: false,
  status: 'completed',
  order: 0,
}

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [techInput, setTechInput] = useState('')

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: fetchProjects,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: emptyProject,
  })

  const techStack = watch('techStack')

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['projects'] })

  const createMutation = useMutation({
    mutationFn: (data: ProjectInput) => axios.post('/api/projects', data),
    onSuccess: () => {
      toast.success('Project created')
      invalidate()
      closeForm()
    },
    onError: () => toast.error('Failed to create project'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: ProjectInput) => axios.put(`/api/projects/${editingId}`, data),
    onSuccess: () => {
      toast.success('Project updated')
      invalidate()
      closeForm()
    },
    onError: () => toast.error('Failed to update project'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/projects/${id}`),
    onSuccess: () => {
      toast.success('Project deleted')
      invalidate()
    },
    onError: () => toast.error('Failed to delete project'),
  })

  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, featured }: { id: string; featured: boolean }) =>
      axios.put(`/api/projects/${id}`, { featured }),
    onSuccess: () => invalidate(),
  })

  const openCreate = () => {
    setEditingId(null)
    reset(emptyProject)
    setIsFormOpen(true)
  }

  const openEdit = (project: IProject) => {
    setEditingId(project._id)
    reset({
      title: project.title,
      subtitle: project.subtitle || '',
      description: project.description,
      techStack: project.techStack || [],
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      imageUrl: project.imageUrl || '',
      featured: project.featured,
      status: project.status,
      order: project.order,
    })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
    setTechInput('')
  }

  const onSubmit = (data: ProjectInput) => {
    if (editingId) updateMutation.mutate(data)
    else createMutation.mutate(data)
  }

  const addTech = () => {
    const value = techInput.trim()
    if (value && !techStack.includes(value)) {
      setValue('techStack', [...techStack, value])
    }
    setTechInput('')
  }

  const removeTech = (tech: string) => {
    setValue('techStack', techStack.filter((t) => t !== tech))
  }

  const columns: DataTableColumn<IProject>[] = [
    {
      header: 'Title',
      accessor: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: 'Featured',
      accessor: (row) => (
        <button
          onClick={() => toggleFeaturedMutation.mutate({ id: row._id, featured: !row.featured })}
          aria-label="Toggle featured"
        >
          <Star
            size={16}
            fill={row.featured ? 'var(--brand-accent)' : 'none'}
            style={{ color: row.featured ? 'var(--brand-accent)' : 'var(--text-tertiary)' }}
          />
        </button>
      ),
    },
    { header: 'Status', accessor: (row) => <StatusBadge status={row.status} /> },
    { header: 'Date', accessor: (row) => new Date(row.createdAt).toLocaleDateString() },
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
            Projects
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Manage your portfolio projects
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
        >
          <Plus size={16} /> Add Project
        </button>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        getRowId={(row) => row._id}
        onEdit={openEdit}
        onDelete={(row) => deleteMutation.mutate(row._id)}
        isLoading={isLoading}
        emptyMessage="No projects yet. Add your first one."
      />

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Project' : 'Add Project'}
              </h2>
              <button onClick={closeForm} style={{ color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Title *
                </label>
                <input {...register('title')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                {errors.title && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.title.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Subtitle
                </label>
                <input {...register('subtitle')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Description *
                </label>
                <textarea {...register('description')} rows={3} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
                {errors.description && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.description.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Tech Stack
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTech()
                      }
                    }}
                    placeholder="Type and press Enter"
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle}
                  />
                  <button type="button" onClick={addTech} className="px-3 rounded-lg text-sm" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {techStack.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
                      style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                    >
                      {tech}
                      <button type="button" onClick={() => removeTech(tech)}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Live URL
                  </label>
                  <input {...register('liveUrl')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                  {errors.liveUrl && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.liveUrl.message}</p>}
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    GitHub URL
                  </label>
                  <input {...register('githubUrl')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                  {errors.githubUrl && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.githubUrl.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Status
                  </label>
                  <select {...register('status')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Order
                  </label>
                  <input type="number" {...register('order', { valueAsNumber: true })} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" {...register('featured')} id="featured" className="w-4 h-4" />
                <label htmlFor="featured" className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Featured project
                </label>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Cover Image
                </label>
                <Controller
                  name="imageUrl"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload value={field.value || ''} onChange={(v) => field.onChange(v)} folder="projects" />
                  )}
                />
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
                >
                  {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                  {editingId ? 'Save Changes' : 'Create Project'}
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