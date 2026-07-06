'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Plus, X, Loader2 } from 'lucide-react'
import { DataTable, ImageUpload, StatusBadge, type DataTableColumn } from '@/components/admin/AdminUI'
import TiptapEditor from '@/components/admin/TiptapEditor'
import { blogSchema, type BlogInput } from '@/lib/validations'
import { slugify } from '@/lib/utils'
import type { IBlog } from '@/types'

async function fetchBlogs(): Promise<IBlog[]> {
  const { data } = await axios.get('/api/blogs?all=true')
  return data
}

const emptyBlog: BlogInput = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  tags: [],
  status: 'draft',
}

export default function BlogsPage() {
  const queryClient = useQueryClient()
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingSlug, setEditingSlug] = useState<string | null>(null)
  const [tagInput, setTagInput] = useState('')
  const [slugTouched, setSlugTouched] = useState(false)

  const { data: blogs = [], isLoading } = useQuery({
    queryKey: ['blogs-admin'],
    queryFn: fetchBlogs,
  })

  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BlogInput>({
    resolver: zodResolver(blogSchema),
    defaultValues: emptyBlog,
  })

  const tags = watch('tags')
  const title = watch('title')
  const content = watch('content')

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['blogs-admin'] })
    queryClient.invalidateQueries({ queryKey: ['blogs'] })
  }

  const createMutation = useMutation({
    mutationFn: (data: BlogInput) => axios.post('/api/blogs', data),
    onSuccess: () => {
      toast.success('Blog created')
      invalidate()
      closeForm()
    },
    onError: () => toast.error('Failed to create blog'),
  })

  const updateMutation = useMutation({
    mutationFn: (data: BlogInput) => axios.put(`/api/blogs/${editingSlug}`, data),
    onSuccess: () => {
      toast.success('Blog updated')
      invalidate()
      closeForm()
    },
    onError: () => toast.error('Failed to update blog'),
  })

  const deleteMutation = useMutation({
    mutationFn: (slug: string) => axios.delete(`/api/blogs/${slug}`),
    onSuccess: () => {
      toast.success('Blog deleted')
      invalidate()
    },
    onError: () => toast.error('Failed to delete blog'),
  })

  const openCreate = () => {
    setEditingSlug(null)
    setSlugTouched(false)
    reset(emptyBlog)
    setIsFormOpen(true)
  }

  const openEdit = (blog: IBlog) => {
    setEditingSlug(blog.slug)
    setSlugTouched(true)
    reset({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || '',
      content: blog.content,
      coverImage: blog.coverImage || '',
      category: blog.category || '',
      tags: blog.tags || [],
      status: blog.status,
    })
    setIsFormOpen(true)
  }

  const closeForm = () => {
    setIsFormOpen(false)
    setEditingSlug(null)
    setTagInput('')
  }

  const onSubmit = (data: BlogInput) => {
    if (editingSlug) updateMutation.mutate(data)
    else createMutation.mutate(data)
  }

  const handleTitleChange = (value: string) => {
    setValue('title', value)
    if (!slugTouched) {
      setValue('slug', slugify(value))
    }
  }

  const addTag = () => {
    const value = tagInput.trim()
    if (value && !tags.includes(value)) {
      setValue('tags', [...tags, value])
    }
    setTagInput('')
  }

  const removeTag = (tag: string) => {
    setValue('tags', tags.filter((t) => t !== tag))
  }

  const columns: DataTableColumn<IBlog>[] = [
    { header: 'Title', accessor: (row) => <span className="font-medium">{row.title}</span> },
    { header: 'Category', accessor: (row) => row.category || '—' },
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
            Blogs
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
            Manage your blog posts
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
          style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
        >
          <Plus size={16} /> Write Blog
        </button>
      </div>

      <DataTable
        columns={columns}
        data={blogs}
        getRowId={(row) => row._id}
        onEdit={openEdit}
        onDelete={(row) => deleteMutation.mutate(row.slug)}
        isLoading={isLoading}
        emptyMessage="No blog posts yet."
      />

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border p-6"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                {editingSlug ? 'Edit Blog' : 'Write Blog'}
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
                <input
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
                {errors.title && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.title.message}</p>}
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Slug (auto-generated, editable)
                </label>
                <input
                  {...register('slug')}
                  onChange={(e) => {
                    setSlugTouched(true)
                    setValue('slug', e.target.value)
                  }}
                  className="w-full px-4 py-2.5 rounded-lg text-sm outline-none"
                  style={inputStyle}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Category
                  </label>
                  <input {...register('category')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle} />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                    Status
                  </label>
                  <select {...register('status')} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none" style={inputStyle}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Excerpt
                </label>
                <textarea {...register('excerpt')} rows={2} className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none" style={inputStyle} />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Tags
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                    placeholder="Type and press Enter"
                    className="flex-1 px-4 py-2.5 rounded-lg text-sm outline-none"
                    style={inputStyle}
                  />
                  <button type="button" onClick={addTag} className="px-3 rounded-lg text-sm" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-primary)' }}>
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span key={tag} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>
                        <X size={11} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Cover Image
                </label>
                <Controller
                  name="coverImage"
                  control={control}
                  render={({ field }) => (
                    <ImageUpload value={field.value || ''} onChange={(v) => field.onChange(v)} folder="blogs" />
                  )}
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: 'var(--text-secondary)' }}>
                  Content *
                </label>
                <TiptapEditor content={content} onChange={(html) => setValue('content', html)} />
                {errors.content && <p className="text-xs mt-1" style={{ color: 'var(--color-error)' }}>{errors.content.message}</p>}
              </div>

              <div className="flex gap-3 mt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-white disabled:opacity-60"
                  style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
                >
                  {isSubmitting && <Loader2 size={15} className="animate-spin" />}
                  {editingSlug ? 'Save Changes' : 'Publish'}
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