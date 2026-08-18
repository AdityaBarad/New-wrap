'use client'

import React from 'react'
import s from '@/app/my-wraps/page.module.css'
import { WrapCard, type WrapCardProps } from '@/components/shared/wrap-card'
import { SPOTIFY_COLORS } from '@/lib/color'

type FeaturedWrap = {
  slug: string
  name: string
  wrap_title: string | null
  purpose: string
  photo_urls: string[] | null
  user_names: string | null
  personality_image_url: string | null
  card_color: string | null
}

const BIRTHDAY_IMGS = ["images (23).jpg", "images (24).jpg", "images (25).jpg", "images (26).jpg", "images (27).jpg", "images (28).jpg", "images (29).jpg", "images (30).jpg", "images (31).jpg"].map(i => `/dummy/birthday/${i}`)
const COUPLE_IMGS = ["couple 1 (1).jpg", "couple 1 (2).jpg", "couple 1 (3).jpg", "couple 1 (4).jpg", "couple 1 (5).jpg", "couple 1 (6).jpg"].map(i => `/dummy/couple/${i}`)
const GROUP_IMGS = ["images (16).jpg", "images (17).jpg", "images (18).jpg", "images (19).jpg", "images (20).jpg", "images (21).jpg", "images (22).jpg"].map(i => `/dummy/family&group/${i}`)
const PERSONAL_IMGS = ["images (1).jpg", "images (2).jpg", "images (3).jpg", "images (4).jpg", "images (5).jpg", "images (6).jpg", "images (7).jpg", "images (8).jpg", "images.jpg", "images (32).jpg"].map(i => `/dummy/personal/${i}`)
const TRAVEL_IMGS = ["travel (1).jpg", "travel (2).jpg", "travel (3).jpg", "travel (4).jpg", "travel (5).jpg", "travel (6).jpg", "travel (7).jpg"].map(i => `/dummy/travel/${i}`)

let wrapCounter = 0;
function createWrap(purpose: string, pool: string[], name: string, subtitle: string): WrapCardProps {
  const c = wrapCounter++;
  const slug = `demo-${purpose}-${c}`;
  const photos = [
    pool[(c * 3) % pool.length],
    pool[(c * 3 + 1) % pool.length],
    pool[(c * 3 + 2) % pool.length],
  ]
  return {
    slug, name, purpose, photos,
    // Strip the "With " prefix so WrapCard re-adds it as the subtitle
    userNames: subtitle.replace(/^With\s+/, ""),
    personalityImageUrl: null,
    // Multiply by a prime number (23) to pseudo-randomly jump around the sorted color array
    // This perfectly scrambles the color distribution so no two adjacent wraps look similar
    cardColor: SPOTIFY_COLORS[(c * 23) % SPOTIFY_COLORS.length]
  }
}

const ROW_1 = [
  createWrap("couple", COUPLE_IMGS, "Our Anniversary", "With Priya"),
  createWrap("travel", TRAVEL_IMGS, "Euro Summer '26", "With Sam, Alex"),
  createWrap("birthday", BIRTHDAY_IMGS, "Rohan's 21st", "With The Gang"),
  createWrap("group", GROUP_IMGS, "Goa Diaries", "With Family"),
  createWrap("personal", PERSONAL_IMGS, "My 2026 Wrapped", "A personal recap"),
  createWrap("couple", COUPLE_IMGS, "Valentine's Day", "With Sarah"),
  createWrap("travel", TRAVEL_IMGS, "Bali Retreat", "With Rahul"),
  createWrap("birthday", BIRTHDAY_IMGS, "Mom's 50th", "With Dad, Sister"),
  createWrap("group", GROUP_IMGS, "The Boys", "With Amit, Rahul"),
  createWrap("personal", PERSONAL_IMGS, "College Days", "With Roommates"),
]

const ROW_2 = [
  createWrap("personal", PERSONAL_IMGS, "Aesthetic Dump", "Vibes only"),
  createWrap("travel", TRAVEL_IMGS, "Japan 2025", "Tokyo, Kyoto"),
  createWrap("group", GROUP_IMGS, "Family Reunion", "Summer at the lake"),
  createWrap("birthday", BIRTHDAY_IMGS, "Sweet 16", "Party vibes"),
  createWrap("couple", COUPLE_IMGS, "Weekend Getaway", "Cabin in the woods"),
  createWrap("personal", PERSONAL_IMGS, "OOTD Hits", "My style journey"),
  createWrap("travel", TRAVEL_IMGS, "Roadtrip West", "California coast"),
  createWrap("group", GROUP_IMGS, "Office Party", "End of year"),
  createWrap("birthday", BIRTHDAY_IMGS, "Dad's 60th", "Surprise party"),
  createWrap("couple", COUPLE_IMGS, "Date Nights", "Food & fun"),
]

const ROW_3 = [
  createWrap("group", GROUP_IMGS, "Festival Squad", "Coachella vibes"),
  createWrap("personal", PERSONAL_IMGS, "Gym Gains", "1 Year Progress"),
  createWrap("travel", TRAVEL_IMGS, "Backpacking", "South America"),
  createWrap("birthday", BIRTHDAY_IMGS, "25th Birthday", "Quarter century"),
  createWrap("couple", COUPLE_IMGS, "First Date", "Where it started"),
  createWrap("group", GROUP_IMGS, "Graduation Day", "Class of '26"),
  createWrap("personal", PERSONAL_IMGS, "Quiet Moments", "Reading & Coffee"),
  createWrap("travel", TRAVEL_IMGS, "Ski Trip", "Alps 2025"),
  createWrap("birthday", BIRTHDAY_IMGS, "Dog's Birthday", "Good boy turns 3"),
  createWrap("couple", COUPLE_IMGS, "Engagement", "She said yes!"),
]

function WrapRow({ title, wraps, direction = 'left' }: { title: string, wraps: WrapCardProps[], direction?: 'left' | 'right' }) {
  const scrollClass = direction === 'left' ? s.scrollLeft : s.scrollRight;

  const renderCards = (isCopy = false) => (
    <>
      {wraps.map((wrap) => (
        <div
          key={`${wrap.slug}${isCopy ? '-copy' : ''}`}
          className={`snap-start ${s.cardWrapper}`}
        >
          <WrapCard wrap={wrap} />
        </div>
      ))}
    </>
  )

  return (
    <div className="mb-2 last:mb-0">
      <div className="flex justify-between items-end" style={{ marginBottom: '12px' }}>
        <h2 className="font-display text-2xl font-black text-white hover:underline cursor-pointer">
          {title}
        </h2>
      </div>

      <div className={s.marqueeContainer}>
        <div className={`${s.marqueeTrack} ${scrollClass}`}>
          <div className={s.marqueeGroup}>
            {renderCards(false)}
          </div>
          <div className={s.marqueeGroup}>
            {renderCards(true)}
          </div>
        </div>
      </div>
    </div>
  )
}

function toCard(w: FeaturedWrap): WrapCardProps {
  return {
    name: w.wrap_title || w.name,
    purpose: w.purpose,
    slug: w.slug,
    photos: w.photo_urls || [],
    userNames: w.user_names,
    personalityImageUrl: w.personality_image_url,
    cardColor: w.card_color || undefined,
    href: `/wrap/${w.slug}`,
  }
}

const shift = (arr: WrapCardProps[], n: number) => [...arr.slice(n), ...arr.slice(0, n)]

type Row = { title: string, wraps: WrapCardProps[], direction: 'left' | 'right' }

function buildRows(wraps: WrapCardProps[]): Row[] {
  if (wraps.length === 0) {
    return [
      { title: "Popular wraps", wraps: ROW_1, direction: "left" },
      { title: "Trending Now", wraps: ROW_2, direction: "right" },
      { title: "Made For You", wraps: ROW_3, direction: "left" },
    ]
  }

  return [
    { title: "Popular wraps", wraps, direction: "left" },
    { title: "Trending Now", wraps: shift(wraps, 3), direction: "right" },
    { title: "Made For You", wraps: shift(wraps, 5), direction: "left" },
  ]
}

export function DummyWrapsDemo({ featuredWraps = [] }: { featuredWraps?: FeaturedWrap[] }) {
  const rows = buildRows(featuredWraps.map(toCard))

  return (
    <section id="popular-wraps" className="relative w-full bg-ink px-4 py-16 md:px-8 md:py-24 border-y-4 border-ink">
      <div className="mx-auto max-w-[1600px]">
        {rows.map((row) => (
          <WrapRow key={row.title} title={row.title} wraps={row.wraps} direction={row.direction} />
        ))}
      </div>
    </section>
  )
}