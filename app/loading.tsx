export default function Loading() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-5"
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        {/* Rotating gradient ring */}
        <svg
          className="absolute inset-0 w-full h-full animate-spin"
          style={{ animationDuration: '1.1s' }}
          viewBox="0 0 64 64"
          fill="none"
        >
          <defs>
            <linearGradient id="loaderRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0" />
              <stop offset="55%" stopColor="var(--brand-primary)" />
              <stop offset="100%" stopColor="var(--brand-secondary)" />
            </linearGradient>
          </defs>
          <circle
            cx="32"
            cy="32"
            r="27"
            stroke="url(#loaderRing)"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        </svg>

        {/* Brand initial */}
        <span className="font-heading text-xl font-bold text-gradient" aria-hidden>
          A
        </span>
      </div>

      {/* Subtle sequential dot pulse */}
      <div className="flex items-center gap-1.5" role="status" aria-label="Loading">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full"
            style={{
              background: 'var(--text-tertiary)',
              animation: 'loaderDotPulse 1.2s ease-in-out infinite',
              animationDelay: `${i * 0.15}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes loaderDotPulse {
          0%, 100% { opacity: 0.25; transform: scale(0.85); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}