"use client"

import { motion } from "framer-motion"
import { BgPatternLayer, DecorationLayer, CinematicBg } from "@/components/player/slide-effects"
import { Shell, Kicker } from "@/components/player/pages"
import { WrapFooter } from "@/components/player/burst"
import { c, typoClass, typoOutlineStyle } from "@/lib/design-utils"
import type { 
  SlideDesign, 
  ThreadPayload, 
  RadarPayload, 
  QuotePayload, 
  PolaroidPayload, 
  RoastPayload, 
  AwardPayload 
} from "@/lib/ai-types"
const HASHTAG = "#Wrapped"

/* ================================================================== */
/* 1. ThreadSlide (Fake iMessage / Chat)                              */
/* ================================================================== */
export function ThreadSlide({ design, content, photo }: { design: SlideDesign; content: ThreadPayload; photo?: string }) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)
  
  return (
    <Shell>
      <CinematicBg photo={photo} ink={bg} />
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      <div className="relative flex h-full w-full flex-col justify-center gap-6 px-4 py-8 md:px-14">
        <Kicker ink={ink}>{content.kicker}</Kicker>
        <div className="flex flex-col gap-4">
          {content.messages.map((m, i) => {
            const isMe = m.sender === "me"
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 120, damping: 14, delay: 0.2 + i * 0.4 }}
                className={`flex w-full ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 font-sans text-base font-medium leading-snug ${
                    isMe ? "rounded-tr-none" : "rounded-tl-none"
                  }`}
                  style={{
                    backgroundColor: isMe ? accent : "var(--wr-cream)",
                    color: isMe ? "var(--wr-ink)" : "var(--wr-ink)",
                    border: `2px solid ${ink}`,
                    boxShadow: `4px 4px 0px ${ink}`
                  }}
                >
                  {m.text}
                </div>
              </motion.div>
            )
          })}
        </div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-4 text-center font-display text-sm font-black tracking-widest opacity-60"
          style={{ color: ink }}
        >
          {content.footerNote}
        </motion.p>
        <div className="mt-auto flex justify-center">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* 2. RadarSlide (Hexagonal / Trait breakdown)                        */
/* ================================================================== */
export function RadarSlide({ design, content, photo }: { design: SlideDesign; content: RadarPayload; photo?: string }) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)

  return (
    <Shell>
      <CinematicBg photo={photo} ink={bg} />
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-6 px-6 py-8 text-center">
        <Kicker ink={ink}>{content.title}</Kicker>
        <div className="flex w-full max-w-sm flex-col gap-4 my-6">
          {content.traits.map((t, i) => (
            <motion.div key={i} className="flex flex-col gap-1 text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.15 }}
            >
              <div className="flex justify-between font-display text-sm font-black uppercase" style={{ color: ink }}>
                <span>{t.label}</span>
                <span>{t.value}%</span>
              </div>
              <div className="h-4 w-full rounded-full border-2 overflow-hidden" style={{ borderColor: ink, backgroundColor: `${ink}22` }}>
                <motion.div 
                  className="h-full"
                  style={{ backgroundColor: accent }}
                  initial={{ width: 0 }}
                  animate={{ width: `${t.value}%` }}
                  transition={{ delay: 0.6 + i * 0.15, duration: 0.8, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className={typoClass(design.typoStyle)}
          style={{ color: ink }}
        >
          {content.verdict}
        </motion.p>
        <div className="mt-4">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* 3. QuoteSlide (Massive Typography)                                 */
/* ================================================================== */
export function QuoteSlide({ design, content, photo }: { design: SlideDesign; content: QuotePayload; photo?: string }) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)

  return (
    <Shell>
      <CinematicBg photo={photo} ink={bg} />
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <div className="relative flex h-full w-full flex-col justify-center px-8 md:px-16 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 14 }}
          className="relative z-10"
        >
          <span className="absolute -left-4 -top-8 font-display text-8xl" style={{ color: accent }}>"</span>
          <h2 
            className={`relative z-10 font-display text-4xl leading-tight md:text-6xl font-black uppercase ${design.typoStyle === "outlined" ? "" : ""}`}
            style={{ color: ink, ...typoOutlineStyle(design.typoStyle, ink) }}
          >
            {content.quote}
          </h2>
          <span className="absolute -bottom-12 -right-4 font-display text-8xl" style={{ color: accent }}>"</span>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 font-display text-xl font-bold tracking-widest"
          style={{ color: accent }}
        >
          {content.author}
        </motion.p>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* 4. RoastSlide                                                      */
/* ================================================================== */
export function RoastSlide({ design, content, photo }: { design: SlideDesign; content: RoastPayload; photo?: string }) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)

  return (
    <Shell>
      <CinematicBg photo={photo} ink={bg} />
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <DecorationLayer style={design.decoration} colors={[accent, ink]} ink={ink} />
      <div className="relative flex h-full w-full flex-col items-center justify-center gap-8 px-6 text-center md:px-14">
        <Kicker ink={ink}>{content.title}</Kicker>
        <div className="flex flex-col gap-6 w-full max-w-lg">
          {content.roastLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30, rotate: i % 2 === 0 ? -2 : 2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 12, delay: 0.3 * i }}
              className="w-full"
            >
              <motion.div
                animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                className="border-4 p-4 shadow-[8px_8px_0_0_rgba(0,0,0,0.2)] w-full"
                style={{ borderColor: ink, backgroundColor: "var(--wr-cream)", boxShadow: `6px 6px 0 0 ${ink}` }}
              >
                <p className="font-sans text-lg font-bold" style={{ color: "var(--wr-ink)" }}>{line}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
        <div className="mt-8">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* 5. AwardSlide (Certificate)                                        */
/* ================================================================== */
export function AwardSlide({ design, content, photo }: { design: SlideDesign; content: AwardPayload; photo?: string }) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  const accent = c(design.accent)

  return (
    <Shell>
      <CinematicBg photo={photo} ink={bg} />
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <div className="relative flex h-full w-full flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="relative w-full max-w-sm"
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="border-8 bg-cream p-8 text-center flex flex-col items-center gap-4 shadow-2xl"
            style={{ borderColor: accent, backgroundColor: "var(--wr-cream)", color: "var(--wr-ink)" }}
          >
            <div className="w-16 h-16 rounded-full border-4 flex items-center justify-center mb-2" style={{ borderColor: ink, backgroundColor: accent }}>
              ⭐
            </div>
            <p className="font-display text-sm font-black uppercase tracking-widest opacity-60">
              {content.recipientCategory}
            </p>
            <h2 className="font-display text-4xl font-black uppercase leading-tight" style={{ color: ink }}>
              {content.awardName}
            </h2>
            <div className="h-1 w-full bg-ink/20 my-2" />
            <p className="font-sans text-base font-semibold leading-relaxed">
              {content.reason}
            </p>
            <div className="mt-4 opacity-50">
              <WrapFooter ink="var(--wr-ink)" hashtag={HASHTAG} />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </Shell>
  )
}

/* ================================================================== */
/* 6. PolaroidSlide (Photos scattered)                                */
/* ================================================================== */
export function PolaroidSlide({ design, content, photos }: { design: SlideDesign; content: PolaroidPayload, photos: string[] }) {
  const bg = c(design.bg)
  const ink = c(design.ink)
  
  // Use uploaded photos or fallbacks
  const p1 = photos[0] || "/wrapped-portrait-1.png"
  const p2 = photos[1] || p1

  return (
    <Shell>
      <CinematicBg photo={p1} ink={bg} />
      <BgPatternLayer pattern={design.bgPattern} ink={ink} dark={bg !== "var(--wr-ink)"} />
      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden px-4">
        <div className="absolute top-12">
          <Kicker ink={ink}>{content.kicker}</Kicker>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: -100, rotate: -20 }}
          animate={{ opacity: 1, y: 0, rotate: -8 }}
          transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.2 }}
          className="absolute z-10 w-[60%] max-w-[16rem]"
          style={{ left: "10%", top: "25%" }}
        >
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, 2, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="border-[12px] border-b-[40px] bg-white shadow-2xl"
            style={{ borderColor: "white" }}
          >
            <div className="aspect-square w-full bg-ink overflow-hidden">
              <img src={p1} className="w-full h-full object-cover grayscale opacity-80 mix-blend-screen" alt="Memory 1" />
            </div>
            <p className="absolute bottom-[-32px] left-0 w-full text-center font-hand text-xl font-bold text-black opacity-80" style={{ fontFamily: 'var(--font-caveat), cursive' }}>
              {content.captions[0] || "Memory"}
            </p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 100, rotate: 20 }}
          animate={{ opacity: 1, y: 0, rotate: 12 }}
          transition={{ type: "spring", stiffness: 100, damping: 14, delay: 0.5 }}
          className="absolute z-20 w-[65%] max-w-[18rem]"
          style={{ right: "5%", top: "45%" }}
        >
          <motion.div
            animate={{ y: [0, -15, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="border-[12px] border-b-[40px] bg-white shadow-2xl"
            style={{ borderColor: "white" }}
          >
            <div className="aspect-square w-full bg-ink overflow-hidden">
              <img src={p2} className="w-full h-full object-cover" alt="Memory 2" />
            </div>
            <p className="absolute bottom-[-32px] left-0 w-full text-center font-hand text-xl font-bold text-black opacity-80" style={{ fontFamily: 'var(--font-caveat), cursive' }}>
              {content.captions[1] || "Good times"}
            </p>
          </motion.div>
        </motion.div>
        
        <div className="absolute bottom-8">
          <WrapFooter ink={ink} hashtag={HASHTAG} />
        </div>
      </div>
    </Shell>
  )
}
