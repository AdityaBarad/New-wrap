'use client'

import { cn } from '@/lib/utils'

/** Builds a spiky starburst polygon points string. */
function starburstPoints(spikes: number, outer: number, inner: number, cx = 50, cy = 50) {
  const pts: string[] = []
  const step = Math.PI / spikes
  for (let i = 0; i < spikes * 2; i++) {
    const r = i % 2 === 0 ? outer : inner
    const a = i * step - Math.PI / 2
    pts.push(`${(cx + Math.cos(a) * r).toFixed(2)},${(cy + Math.sin(a) * r).toFixed(2)}`)
  }
  return pts.join(' ')
}

export function Starburst({
  className,
  color = 'currentColor',
  spikes = 12,
  spin = false,
}: {
  className?: string
  color?: string
  spikes?: number
  spin?: boolean
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      aria-hidden="true"
      className={cn(spin && 'spin-slow', className)}
    >
      <polygon points={starburstPoints(spikes, 48, 22)} fill={color} />
    </svg>
  )
}

export function Blob({
  className,
  color = 'currentColor',
}: {
  className?: string
  color?: string
}) {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className}>
      <path
        fill={color}
        d="M50 4c8 0 12 10 20 12s18-4 24 3-1 18 1 26 10 13 8 22-13 9-19 16-6 18-15 21-16-6-25-6-16 9-25 6-9-14-15-21S3 73 1 64s6-14 8-22-5-19 1-26 16-1 24-3S42 4 50 4Z"
      />
    </svg>
  )
}

/** Small black-and-yellow checkerboard corner accent used across Wrapped cards. */
export function Checker({ className, color = '#000' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      {Array.from({ length: 16 }).map((_, i) => {
        const x = (i % 4) * 10
        const y = Math.floor(i / 4) * 10
        const on = (Math.floor(i / 4) + (i % 4)) % 2 === 0
        return on ? <rect key={i} x={x} y={y} width={10} height={10} fill={color} /> : null
      })}
    </svg>
  )
}
