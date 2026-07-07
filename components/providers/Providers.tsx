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
          gap={12}
          toastOptions={{
            duration: 4500,
            style: {
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border)',
              borderRadius: '14px',
              color: 'var(--text-primary)',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.35)',
              padding: '16px 18px',
              fontSize: '15px',
              minWidth: '320px',
            },
            classNames: {
              title: 'font-semibold text-[15px]',
              description: 'text-sm text-[var(--text-secondary)] mt-0.5',
              icon: 'scale-110',
            },
          }}
        />
      </QueryClientProvider>
    </ThemeProvider>
  )
}