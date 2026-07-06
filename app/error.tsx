'use client'

import { AlertTriangle } from 'lucide-react'
import { RotateCw } from 'lucide-react'
export default function Error({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Icon */}
      <div className="mb-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          <AlertTriangle
            size={34}
            style={{ color: 'var(--brand-secondary)' }}
          />
        </div>
      </div>

      {/* Text */}
      <p className="text-5xl md:text-6xl font-bold text-gradient mb-3">
        Oops!
      </p>

      <h2
        className="text-lg md:text-xl font-semibold mb-2"
        style={{ color: 'var(--text-primary)' }}
      >
        Something went wrong
      </h2>

      <p
        className="mb-8 text-sm max-w-md leading-relaxed"
        style={{ color: 'var(--text-secondary)' }}
      >
        {process.env.NODE_ENV === 'development'
          ? error.message
          : 'An unexpected error occurred. Please try again.'}
      </p>

      <button
        onClick={reset}
        className="group px-7 py-3 rounded-full font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
        style={{
          background:
            'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))',
        }}
      >
        <RotateCw
          size={18}
          className="transition-transform duration-500 group-hover:rotate-180"
        />
        Try Again
      </button>
    </div>
  )
}