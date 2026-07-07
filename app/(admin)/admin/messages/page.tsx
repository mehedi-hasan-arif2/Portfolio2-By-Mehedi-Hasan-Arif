'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { toast } from 'sonner'
import { X, Mail, MailOpen, Loader2 } from 'lucide-react'
import { DataTable, ConfirmDialog, type DataTableColumn } from '@/components/admin/AdminUI'
import { formatDate } from '@/lib/utils'
import type { IContact } from '@/types'

async function fetchMessages(): Promise<IContact[]> {
  const { data } = await axios.get('/api/contact')
  return data
}

export default function MessagesPage() {
  const queryClient = useQueryClient()
  const [selected, setSelected] = useState<IContact | null>(null)
  const [pendingDelete, setPendingDelete] = useState<IContact | null>(null)

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ['messages-admin'],
    queryFn: fetchMessages,
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['messages-admin'] })

  const markReadMutation = useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) => axios.put(`/api/contact/${id}`, { read }),
    onSuccess: () => invalidate(),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axios.delete(`/api/contact/${id}`),
    onSuccess: () => {
      toast.success('Message deleted')
      invalidate()
      setSelected(null)
    },
    onError: () => toast.error('Failed to delete message'),
  })

  const openMessage = (msg: IContact) => {
    setSelected(msg)
    if (!msg.read) {
      markReadMutation.mutate({ id: msg._id, read: true })
    }
  }

  const columns: DataTableColumn<IContact>[] = [
    {
      header: '',
      accessor: (row) =>
        row.read ? (
          <MailOpen size={15} style={{ color: 'var(--text-tertiary)' }} />
        ) : (
          <Mail size={15} style={{ color: 'var(--brand-primary)' }} />
        ),
      className: 'w-8',
    },
    { header: 'Name', accessor: (row) => <span className="font-medium">{row.name}</span> },
    { header: 'Email', accessor: (row) => row.email },
    { header: 'Subject', accessor: (row) => row.subject || '—' },
    { header: 'Date', accessor: (row) => formatDate(row.createdAt) },
  ]

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
          Messages
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)' }}>
          Messages received through your contact form
        </p>
      </div>

      <div
        className="rounded-xl border overflow-x-auto"
        style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
      >
        {isLoading ? (
          <div className="p-10 flex items-center justify-center">
            <Loader2 size={22} className="animate-spin" style={{ color: 'var(--brand-primary)' }} />
          </div>
        ) : messages.length === 0 ? (
          <div className="p-10 text-center text-sm" style={{ color: 'var(--text-tertiary)' }}>
            No messages yet.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {columns.map((col) => (
                  <th
                    key={col.header}
                    className={`text-left font-medium px-5 py-3.5 whitespace-nowrap ${col.className ?? ''}`}
                    style={{ color: 'var(--text-tertiary)' }}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {messages.map((row) => (
                <tr
                  key={row._id}
                  onClick={() => openMessage(row)}
                  className="border-b last:border-0 cursor-pointer transition-colors hover:bg-[var(--bg-tertiary)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  {columns.map((col) => (
                    <td key={col.header} className={`px-5 py-3.5 ${col.className ?? ''}`} style={{ color: 'var(--text-primary)' }}>
                      {col.accessor(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div
            className="w-full max-w-lg rounded-2xl border p-6"
            style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border)' }}
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                Message from {selected.name}
              </h2>
              <button onClick={() => setSelected(null)} style={{ color: 'var(--text-tertiary)' }}>
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-sm">
              <div>
                <span style={{ color: 'var(--text-tertiary)' }}>From: </span>
                <a href={`mailto:${selected.email}`} style={{ color: 'var(--brand-primary)' }}>
                  {selected.email}
                </a>
              </div>
              {selected.subject && (
                <div>
                  <span style={{ color: 'var(--text-tertiary)' }}>Subject: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{selected.subject}</span>
                </div>
              )}
              <div
                className="rounded-lg p-4 whitespace-pre-wrap leading-relaxed"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
              >
                {selected.message}
              </div>
              <div className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                Received {formatDate(selected.createdAt)}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white"
                style={{ backgroundImage: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))' }}
              >
                Reply
              </a>
              <button
                onClick={() => setPendingDelete(selected)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium border"
                style={{ borderColor: 'var(--border)', color: 'var(--color-error)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Delete this message?"
        message="This will permanently remove the message. This action cannot be undone."
        onConfirm={() => {
          if (pendingDelete) deleteMutation.mutate(pendingDelete._id)
          setPendingDelete(null)
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  )
}