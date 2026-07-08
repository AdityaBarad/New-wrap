import { cn } from '@/lib/utils'

export function Marquee({
  text,
  className,
  reverse = false,
  textClassName,
}: {
  text: string
  className?: string
  reverse?: boolean
  textClassName?: string
}) {
  const items = Array.from({ length: 8 })
  return (
    <div className={cn('flex w-full overflow-hidden', className)}>
      <div className={cn('flex shrink-0', reverse ? 'marquee-track-rev' : 'marquee-track')}>
        {items.map((_, i) => (
          <span
            key={i}
            className={cn(
              'whitespace-nowrap px-4 font-display text-2xl font-black uppercase tracking-tight md:text-4xl',
              textClassName,
            )}
          >
            {text}
          </span>
        ))}
      </div>
    </div>
  )
}
