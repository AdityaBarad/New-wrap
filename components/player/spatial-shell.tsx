"use client"

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { motion } from "framer-motion"
import type { SlideDesignProfile } from "@/lib/design-tokens"
import { BackgroundWarp } from "@/components/player/background-warp"
import { Halftone } from "@/components/player/burst"

/* ================================================================== */
/* SlideDesignContext — provides the active profile to all children    */
/* ================================================================== */

const SlideDesignCtx = createContext<SlideDesignProfile | null>(null)

export function SlideDesignProvider({
  profile,
  children,
}: {
  profile: SlideDesignProfile
  children: ReactNode
}) {
  return (
    <SlideDesignCtx.Provider value={profile}>
      {children}
    </SlideDesignCtx.Provider>
  )
}

export function useSlideDesign(): SlideDesignProfile {
  const ctx = useContext(SlideDesignCtx)
  if (!ctx) throw new Error("useSlideDesign must be used within SlideDesignProvider")
  return ctx
}

/* ================================================================== */
/* Parallax pointer hook                                               */
/* ================================================================== */

/**
 * Tracks normalized pointer position (−1 … +1) for parallax offsets.
 * Returns { nx, ny } updated via RAF for smooth 60fps reads.
 */
function useParallaxPointer() {
  const [pos, setPos] = useState({ nx: 0, ny: 0 })
  const target = useRef({ nx: 0, ny: 0 })
  const raf = useRef<number>(0)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      target.current = {
        nx: (e.clientX / window.innerWidth) * 2 - 1,
        ny: (e.clientY / window.innerHeight) * 2 - 1,
      }
    }
    window.addEventListener("pointermove", onMove, { passive: true })

    // Lerp to target for buttery smooth motion
    const tick = () => {
      setPos((prev) => ({
        nx: prev.nx + (target.current.nx - prev.nx) * 0.08,
        ny: prev.ny + (target.current.ny - prev.ny) * 0.08,
      }))
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener("pointermove", onMove)
      cancelAnimationFrame(raf.current)
    }
  }, [])

  return pos
}

/* ================================================================== */
/* SpatialShell — 6-depth multilayer parallax container                */
/*                                                                     */
/* Layer 0: Background warp (conic gradient / glow)                    */
/* Layer 1: Grid overlay (scrolling grid lines)                        */
/* Layer 2: Halftone / texture                                         */
/* Layer 3: Content (typography + data) — passed as children           */
/* Layer 4: Foreground particles — passed via `particles` prop         */
/* Layer 5: UI chrome — passed via `chrome` prop                       */
/* ================================================================== */

export function SpatialShell({
  children,
  particles,
  chrome,
  showWarp = false,
  showGrid = false,
  showHalftone = true,
}: {
  children: ReactNode
  particles?: ReactNode
  chrome?: ReactNode
  showWarp?: boolean
  showGrid?: boolean
  showHalftone?: boolean
}) {
  const profile = useSlideDesign()
  const { nx, ny } = useParallaxPointer()
  const { layers, grid, bg, ink } = profile

  return (
    <div className="relative h-full w-full overflow-hidden gpu-layer">
      {/* Layer 0 — Background warp */}
      {showWarp && (
        <ParallaxFrame depth={layers[0]} nx={nx} ny={ny} className="z-0">
          <BackgroundWarp profile={profile} />
        </ParallaxFrame>
      )}

      {/* Layer 1 — Grid overlay */}
      {showGrid && grid.opacity > 0 && (
        <ParallaxFrame depth={layers[1]} nx={nx} ny={ny} className="z-[1]">
          <ScrollingGrid ink={ink} size={grid.size} opacity={grid.opacity} speed={grid.driftSpeed} />
        </ParallaxFrame>
      )}

      {/* Layer 2 — Halftone texture */}
      {showHalftone && (
        <ParallaxFrame depth={layers[2]} nx={nx} ny={ny} className="z-[2]">
          <Halftone dark={bg !== "var(--wr-ink)"} />
        </ParallaxFrame>
      )}

      {/* Layer 3 — Main content */}
      <ParallaxFrame depth={layers[3]} nx={nx} ny={ny} className="relative z-[3]">
        {children}
      </ParallaxFrame>

      {/* Layer 4 — Foreground particles */}
      {particles && (
        <ParallaxFrame depth={layers[4]} nx={nx} ny={ny} className="z-[4]">
          {particles}
        </ParallaxFrame>
      )}

      {/* Layer 5 — UI chrome */}
      {chrome && (
        <div className="relative z-[5]">
          {chrome}
        </div>
      )}
    </div>
  )
}

/* ================================================================== */
/* ParallaxFrame — wraps a layer with pointer-driven offset            */
/* ================================================================== */

function ParallaxFrame({
  depth,
  nx,
  ny,
  children,
  className,
}: {
  depth: { driftX: number; driftY: number }
  nx: number
  ny: number
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      className={`absolute inset-0 gpu-layer backface-hidden ${className ?? ""}`}
      style={{
        x: nx * depth.driftX,
        y: ny * depth.driftY,
      }}
    >
      {children}
    </motion.div>
  )
}

/* ================================================================== */
/* ScrollingGrid — animated grid overlay with GPU-safe animation       */
/* ================================================================== */

function ScrollingGrid({
  ink,
  size,
  opacity,
  speed,
}: {
  ink: string
  size: number
  opacity: number
  speed: number
}) {
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 gpu-layer"
      style={{
        backgroundImage: `linear-gradient(${ink}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 1px, transparent 1px), linear-gradient(90deg, ${ink}${Math.round(opacity * 255).toString(16).padStart(2, "0")} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
      animate={{ backgroundPosition: [`0px 0px`, `${size}px ${size}px`] }}
      transition={{ duration: speed, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
    />
  )
}
