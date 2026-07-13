"use client"

import { useEffect, useRef } from "react"

// Constants for the animation
const ANIM_DURATION_MS = 12000 // 12 seconds
const TEXT = "2021" // Configurable text

export function SpiralRibbon({ children }: { children?: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let startTime: number | null = null

    // Handle high DPI displays
    const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1
    
    // Resize handler
    let cw = 0
    let ch = 0
    let maxRadius = 0
    let b = 0
    let maxTheta = 0
    let maxS = 0
    let s_arr: number[] = []
    let theta_arr: number[] = []

    const resize = () => {
      const parent = canvas.parentElement
      cw = parent ? parent.clientWidth : window.innerWidth
      ch = parent ? parent.clientHeight : window.innerHeight
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      ctx.scale(dpr, dpr)
      
      // Calculate spiral parameters
      maxRadius = Math.sqrt(cw * cw + ch * ch) / 2 + 100 // ensure it covers corners
      const turns = 4.5
      maxTheta = turns * 2 * Math.PI
      b = maxRadius / maxTheta
      
      // Pre-calculate arc lengths (s) for various theta to map distance -> theta
      const steps = 1000
      s_arr = [0]
      theta_arr = [0]
      let s = 0
      for (let i = 1; i <= steps; i++) {
        const th = (i / steps) * maxTheta
        const prevTh = ((i - 1) / steps) * maxTheta
        const r1 = b * prevTh
        const r2 = b * th
        const x1 = r1 * Math.cos(prevTh)
        const y1 = r1 * Math.sin(prevTh)
        const x2 = r2 * Math.cos(th)
        const y2 = r2 * Math.sin(th)
        s += Math.hypot(x2 - x1, y2 - y1)
        s_arr.push(s)
        theta_arr.push(th)
      }
      maxS = s_arr[s_arr.length - 1]
    }

    window.addEventListener("resize", resize)
    resize()

    // Helper to get theta for a given arc length distance
    const getTheta = (targetS: number) => {
      if (targetS <= 0) return 0
      if (targetS >= maxS) return maxTheta
      for (let i = 1; i < s_arr.length; i++) {
        if (s_arr[i] >= targetS) {
          const t = (targetS - s_arr[i - 1]) / (s_arr[i] - s_arr[i - 1])
          return theta_arr[i - 1] + t * (theta_arr[i] - theta_arr[i - 1])
        }
      }
      return maxTheta
    }

    // Helper to get arc length for a given theta
    const getS = (targetTheta: number) => {
      if (targetTheta <= 0) return 0
      if (targetTheta >= maxTheta) return maxS
      for (let i = 1; i < theta_arr.length; i++) {
        if (theta_arr[i] >= targetTheta) {
          const t = (targetTheta - theta_arr[i - 1]) / (theta_arr[i] - theta_arr[i - 1])
          return s_arr[i - 1] + t * (s_arr[i] - s_arr[i - 1])
        }
      }
      return maxS
    }

    // Helper to draw a true 4-pointed sparkle star
    const drawStar = (cx: number, cy: number, rot: number, size: number, wRatio = 0.2) => {
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(rot)
      ctx.beginPath()
      ctx.moveTo(0, -size)
      ctx.quadraticCurveTo(size * wRatio, -size * wRatio, size, 0)
      ctx.quadraticCurveTo(size * wRatio, size * wRatio, 0, size)
      ctx.quadraticCurveTo(-size * wRatio, size * wRatio, -size, 0)
      ctx.quadraticCurveTo(-size * wRatio, -size * wRatio, 0, -size)
      ctx.fillStyle = "#e60026" // Red stars
      ctx.fill()
      ctx.restore()
    }

    // Animation loop
    const render = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const elapsed = timestamp - startTime
      let progress = elapsed / ANIM_DURATION_MS
      
      // Easing: easeOutCubic
      progress = 1 - Math.pow(1 - Math.min(progress, 1), 3)

      ctx.clearRect(0, 0, cw, ch)
      
      // Shift center slightly to the left (e.g. 10% of width)
      const cx = (cw / 2) - (cw * 0.1)
      const cy = ch / 2
      
      const gap = b * 2 * Math.PI
      // outlineWidth must be slightly larger than the gap so adjacent coils touch perfectly
      // This forms a solid black background everywhere the ribbon isn't drawn!
      const outlineWidth = gap + 2 
      const ribbonWidth = gap * 0.82 // Pink ribbon is 82% of the gap, leaving an 18% black gap

      // Instead of growing maxTheta, we increase minTheta (the tail of the snake)
      // so it slithers outwards and disappears.
      const currentMinTheta = progress * maxTheta

      // 1. Draw the ribbon background
      if (currentMinTheta < maxTheta) {
        ctx.save()
        ctx.translate(cx, cy)
        
        // Draw black outline
        ctx.beginPath()
        let startedOutline = false
        for (let t = currentMinTheta; t <= maxTheta + Math.PI; t += 0.05) {
          const r = b * t
          const x = r * Math.cos(t)
          const y = r * Math.sin(t)
          if (!startedOutline) {
            ctx.moveTo(x, y)
            startedOutline = true
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.lineCap = "round"
        ctx.lineJoin = "round"
        ctx.lineWidth = outlineWidth
        ctx.strokeStyle = "#0b0b0b" // Ink color
        ctx.stroke()

        // Draw pink inner
        ctx.beginPath()
        let startedInner = false
        for (let t = currentMinTheta; t <= maxTheta + Math.PI; t += 0.05) {
          const r = b * t
          const x = r * Math.cos(t)
          const y = r * Math.sin(t)
          if (!startedInner) {
            ctx.moveTo(x, y)
            startedInner = true
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.lineWidth = ribbonWidth
        ctx.strokeStyle = "#FFB6C6" // Pink color
        ctx.stroke()
        
        ctx.restore()
      }

      // 2. Draw markings (flowing outwards)
      ctx.save()
      ctx.translate(cx, cy)
      
      // Calculate true arc length of the tail so text is perfectly glued to the ribbon
      const tailS = getS(currentMinTheta)
      
      const patternSpacing = ribbonWidth * 4.5
      // To cover the whole spiral, we need enough patterns from tailS up to maxS + some extra
      const maxPossiblePatterns = Math.floor(maxS / patternSpacing) + 5
      
      const textHeight = ribbonWidth * 0.65
      ctx.fillStyle = "#e60026" // Red text
      ctx.font = `900 ${textHeight}px 'Archivo', sans-serif`
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"

      for (let i = 0; i < maxPossiblePatterns; i++) {
        // Markings are anchored to the tail, moving outwards with it
        const s = tailS + (i * patternSpacing)
        
        // Only draw if it hasn't fallen off the outer edge
        if (s <= maxS * 1.5) {
          
          // 1. Draw "2021" curved along the path
          let currentS = s
          for (let char of TEXT) {
            const charWidth = ctx.measureText(char).width
            const charCenterS = currentS + charWidth / 2
            
            if (charCenterS <= maxS + gap) {
              const t = getTheta(charCenterS)
              if (t >= currentMinTheta && t <= maxTheta + Math.PI) {
                const r = b * t
                const x = r * Math.cos(t)
                const y = r * Math.sin(t)
                
                const dx = b * Math.cos(t) - r * Math.sin(t)
                const dy = b * Math.sin(t) + r * Math.cos(t)
                const angle = Math.atan2(dy, dx)
                
                ctx.save()
                ctx.translate(x, y)
                ctx.rotate(angle)
                ctx.fillText(char, 0, 0)
                ctx.restore()
              }
            }
            currentS = charCenterS + charWidth / 2 + textHeight * 0.08
          }
          
          // 2. Draw star cluster between texts
          const starCenterS = s + patternSpacing / 2
          if (starCenterS <= maxS + gap) {
            const t = getTheta(starCenterS)
            if (t >= currentMinTheta && t <= maxTheta + Math.PI) {
              const r = b * t
              const x = r * Math.cos(t)
              const y = r * Math.sin(t)
              
              const dx = b * Math.cos(t) - r * Math.sin(t)
              const dy = b * Math.sin(t) + r * Math.cos(t)
              const angle = Math.atan2(dy, dx)
              
              ctx.save()
              ctx.translate(x, y)
              ctx.rotate(angle)
              
              // Draw a cluster of true 4-pointed stars
              drawStar(-ribbonWidth * 0.4, -ribbonWidth * 0.15, Math.PI / 8, ribbonWidth * 0.28)
              drawStar(ribbonWidth * 0.2, ribbonWidth * 0.25, Math.PI / 4, ribbonWidth * 0.18)
              drawStar(ribbonWidth * 0.55, -ribbonWidth * 0.1, -Math.PI / 6, ribbonWidth * 0.14)
              
              // Add some tiny dots like in the image
              ctx.beginPath()
              ctx.arc(-ribbonWidth * 0.1, ribbonWidth * 0.3, ribbonWidth * 0.04, 0, Math.PI * 2)
              ctx.arc(ribbonWidth * 0.7, 0, ribbonWidth * 0.035, 0, Math.PI * 2)
              ctx.fill()
              
              ctx.restore()
            }
          }
        }
      }
      
      ctx.restore()

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(render)
      } else {
        // Continue rotating the stars slightly or stop. We'll stop since it will advance automatically.
      }
    }

    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener("resize", resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden">
      {children}
      <canvas ref={canvasRef} className="absolute inset-0 z-50 pointer-events-none block" />
    </div>
  )
}
