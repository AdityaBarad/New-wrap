"use client"

import { cn } from "@/lib/utils"
import type { InputHTMLAttributes } from "react"

export function Field({
  label,
  optional,
  className,
  ...props
}: { label: string; optional?: boolean } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 flex items-baseline gap-2 font-display text-xs font-black uppercase tracking-widest text-foreground/70">
        {label}
        {optional && <span className="text-[10px] font-bold text-foreground/40">optional</span>}
      </span>
      <input
        {...props}
        className="w-full rounded-md border-2 border-foreground/20 bg-ink px-4 py-3 font-sans text-base font-medium text-foreground placeholder:text-foreground/30 transition-colors focus:border-green focus:outline-none"
      />
    </label>
  )
}
