'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, X, Loader2 } from 'lucide-react'
import { DataTable, type DataTableColumn } from '@/components/admin/AdminUI'
import { skillSchema, type SkillInput } from '@/lib/validations'
import type { ISkill } from '@/types'

async function fetchSkills(): Promise<ISkill[]> {
  const { data } = await axios.get('/api/skills')
  return data
}

const emptySkill: SkillInput = { name: '', category: 'frontend', order: 0 }

const categories = ['frontend', 'backend', 'tools', 'other']

export default function SkillsPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  const { data: skills = [], isLoading } = useQuery({
    queryKey: ['skills-admin'],
    queryFn: fetchSkills,
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: emptySkill,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['skills-admin'] })
    queryClient.invalidateQueries({ queryKey: ['skills'] })
  }

  const createMutation = useMutation({
    mutationFn: (data: SkillInput) => axios.post('/api/skills', data),
    onSuccess: () => {
      toast.success('Skill added')
      invalidate()
      closeForm()
    },
    onError: () => toast.error('Failed to add skill'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: SkillInput) => axios.put(`/api/skills/${editingId}`, data),
    onSuccess: () => {
      toast.success('Skill updated')
      invalidate()
      closeForm()
    },
    onError: () => toast.error('Failed to update skill'),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/skills/${id}`),
    onSuccess: () => {
      toast.success('Skill deleted')
      invalidate()
    },
    onError: () => toast.error('Failed to delete skill'),
  })

  const openCreate = () => {
    setEditingId(null)
    reset(emptySkill)
    setIsFormOpen(true)
  }

  const openEdit = (skill: ISkill) => {
    setEditingId(skill._id)
    reset({ name: skill.name, category: skill.category, order: skill.order })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingId(null)
  }

  const onSubmit = (data: SkillInput) => {
    if (editingId) updateMutation.mutate(data)
    else createMutation.mutate(data)
  }

  const columns: DataTableColumn<ISkill>[] = [
    { header: 'Name', accessor: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Category', accessor: (row) => <span className="capitalize">{row.category}</span> },
    { header: 'Order', accessor: (row) => row.order },
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
            Skills
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Manage skills shown on your portfolio
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
        >
          <Plus size={16} /> Add Skill
        </button>
      </div>

      <DataTable
        columns={columns}
        data={skills}
        getRowId={(row) => row._id}
        onEdit={openEdit}
        onDelete={(row) => deleteMutation.mutate(row._id)}
        isLoading={isLoading}
        emptyMessage="No skills added yet."
      />

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="w-full max-w-md rounded-2xl border p-6"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {editingId ? 'Edit Skill' : 'Add Skill'}
              </h2>
              <button onClick={closeForm} style={{ color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Name *
                </label>
                <input {...register('name')} placeholder="e.g. React.js" className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                {errors.name && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.name.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Category *
                </label>
                <select {...register('category')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none capitalize" style={inputStyle}>
                  {categories.map((c) => (
                    <option key={c} value={c} className="capitalize">
                      {c}
                    </option>
                  ))}
                </select>
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
                  {editingId ? 'Save Changes' : 'Add Skill'}
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