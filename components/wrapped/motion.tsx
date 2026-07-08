'use client'

import { motion, type Variants } from 'framer-motion'
import type { ReactNode } from 'react'

const spring = { type: 'spring', stiffness: 420, damping: 22, mass: 0.9 } as const

type Dir = 'up' | 'down' | 'left' | 'right' | 'spin' | 'pop'

const offsets: Record<Dir, { x?: number; y?: number; rotate?: number; scale?: number }> = {
  up: { y: 80 },
  down: { y: -80 },
  left: { x: 120 },
  right: { x: -120 },
  spin: { rotate: -14, scale: 0.8 },
  pop: { scale: 0.4 },
}

export function Pop({
  children,
  from = 'up',
  delay = 0,
  className,
  once = true,
}: {
  children: ReactNode
  from?: Dir
  delay?: number
  className?: string
  once?: boolean
}) {
  const o = offsets[from]
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...o }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
      viewport={{ once, amount: 0.3 }}
      transition={{ ...spring, delay }}
    >
      {children}
    </motion.div>
  )
}

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const item: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.85 },
  show: { opacity: 1, y: 0, scale: 1, transition: spring },
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  )
}

export { motion, spring }
