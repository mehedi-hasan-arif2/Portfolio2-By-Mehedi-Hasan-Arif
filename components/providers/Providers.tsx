'use client'

import { ThemeProvider } from 'next-themes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { useState } from 'react'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster
          position="top-right"
          gap={10}
          toastOptions={{
            duration: 4500,
            style: {
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              color: 'var(--text-primary)',
              boxShadow: '0 12px 32px rgba(0, 0, 0, 0.28)',
              padding: '14px 16px',
              fontSize: '14px',
            },
            classNames: {
              title: 'font-semibold',
              description: 'text-sm text-[var(--text-secondary)]',
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  )
}