export function SkeletonText({ className = '' }: { className?: string }) {
  return (
    <span
      className={`inline-block rounded animate-pulse ${className}`}
      style={{ background: 'var(--bg-tertiary)' }}
    />
  )
}

export function SkeletonAvatar({ size = 80 }: { size?: number }) {
  return (
    <div
      className="rounded-full animate-pulse"
      style={{ width: size, height: size, background: 'var(--bg-tertiary)' }}
    />
  )
}

export function SkeletonCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`rounded-lg animate-pulse ${className}`}
      style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
      }}
    >
      <div
        className="w-full h-40 rounded-t-lg animate-pulse"
        style={{ background: 'var(--bg-tertiary)' }}
      />
      <div className="p-4 flex flex-col gap-3">
        <SkeletonText className="h-5 w-3/4" />
        <SkeletonText className="h-4 w-full" />
        <SkeletonText className="h-4 w-2/3" />
      </div>
    </div>
  )
}

export function SkeletonGrid({
  count = 3,
  columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
}: {
  count?: number
  columns?: string
}) {
  return (
    <div className={`grid ${columns} gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonLine({ width = 'w-full' }: { width?: string }) {
  return <SkeletonText className={`h-4 ${width}`} />
}
