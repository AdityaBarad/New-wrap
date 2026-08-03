'use client'

import React from 'react'
import s from '@/app/my-wraps/page.module.css'

const PURPOSE_LABELS: Record<string, string> = {
  couple: "COUPLE",
  travel: "TRAVEL",
  birthday: "BIRTHDAY",
  personal: "LIFE",
  group: "GROUP / FAMILY",
}

const SPOTIFY_COLORS = [
  "#ff6666", "#ff8a8a", "#ffa1a1", "#ff4da8", "#ff66b3", 
  "#ff99cc", "#ffb3e6", "#e60073", "#ff4d4d", "#ff6a13", 
  "#ff876a", "#ff9640", "#ffb366", "#ffcc99", "#ffdb4d", 
  "#ffe854", "#ffff66", "#c4f033", "#a6ff4d", "#ccff99", 
  "#21e065", "#3de3a3", "#4de3a8", "#66ffcc", "#00e673", 
  "#33cc33", "#4dd2ff", "#66c2ff", "#7ac5ff", "#99ddff", 
  "#3399ff", "#0073e6", "#4d4dff", "#7b2ff2", "#9933ff", 
  "#b366ff", "#cca3ff", "#d6a3ff", "#e6ccff", "#ff33cc", 
  "#ff66d9", "#ff99e6", "#cc0099", "#ff5050", "#ff9999", 
  "#ffd480", "#80ffaa", "#80bfff", "#d279d2", "#e6b3b3"
]

const BIRTHDAY_IMGS = ["images (23).jpg", "images (24).jpg", "images (25).jpg", "images (26).jpg", "images (27).jpg", "images (28).jpg", "images (29).jpg", "images (30).jpg", "images (31).jpg"].map(i => `/dummy/birthday/${i}`)
const COUPLE_IMGS = ["couple 1 (1).jpg", "couple 1 (2).jpg", "couple 1 (3).jpg", "couple 1 (4).jpg", "couple 1 (5).jpg", "couple 1 (6).jpg"].map(i => `/dummy/couple/${i}`)
const GROUP_IMGS = ["images (16).jpg", "images (17).jpg", "images (18).jpg", "images (19).jpg", "images (20).jpg", "images (21).jpg", "images (22).jpg"].map(i => `/dummy/family&group/${i}`)
const PERSONAL_IMGS = ["images (1).jpg", "images (2).jpg", "images (3).jpg", "images (4).jpg", "images (5).jpg", "images (6).jpg", "images (7).jpg", "images (8).jpg", "images.jpg", "images (32).jpg"].map(i => `/dummy/personal/${i}`)
const TRAVEL_IMGS = ["travel (1).jpg", "travel (2).jpg", "travel (3).jpg", "travel (4).jpg", "travel (5).jpg", "travel (6).jpg", "travel (7).jpg"].map(i => `/dummy/travel/${i}`)

let wrapCounter = 0;
function createWrap(purpose: string, pool: string[], name: string, subtitle: string) {
  const c = wrapCounter++;
  const slug = `demo-${purpose}-${c}`;
  const photos = [
    pool[(c * 3) % pool.length],
    pool[(c * 3 + 1) % pool.length],
    pool[(c * 3 + 2) % pool.length],
  ]
  return {
    slug, name, purpose, photos, subtitle,
    // Multiply by a prime number (23) to pseudo-randomly jump around the sorted color array
    // This perfectly scrambles the color distribution so no two adjacent wraps look similar
    color: SPOTIFY_COLORS[(c * 23) % SPOTIFY_COLORS.length]
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

function WrapRow({ title, wraps }: { title: string, wraps: any[] }) {
  return (
    <div className="mb-12 last:mb-0">
      <div className="flex justify-between items-end mb-6">
        <h2 className="font-display text-2xl font-black text-white hover:underline cursor-pointer">
          {title}
        </h2>
        <span className="text-sm font-bold text-[#b3b3b3] hover:underline cursor-pointer hidden sm:block">
          Show all
        </span>
      </div>
      
      <div 
        className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory items-start [&::-webkit-scrollbar]:hidden" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {wraps.map((wrap) => {
          const label = PURPOSE_LABELS[wrap.purpose] ?? wrap.purpose.toUpperCase()
          
          return (
            <div 
              key={wrap.slug} 
              className={`snap-start ${s.card}`} 
              style={{ width: '220px', minWidth: '220px', flex: '0 0 220px' }}
              onClick={(e) => e.preventDefault()}
            >
              <div 
                className={s.imageArea} 
                style={{ 
                  backgroundColor: wrap.color,
                  "--card-bg": wrap.color
                } as React.CSSProperties}
              >
                <div className={s.circlesContainer}>
                  <img src={wrap.photos[1]} alt="" className={`${s.circleImage} ${s.leftCircle}`} />
                  <img src={wrap.photos[2]} alt="" className={`${s.circleImage} ${s.rightCircle}`} />
                  <img src={wrap.photos[0]} alt="" className={`${s.circleImage} ${s.centerCircle}`} />
                </div>
                
                <img src="/logo/black-transparent.png" alt="Logo" className={s.logo} />
                
                <span className={s.badge}>
                  {label}
                </span>
                
                <h3 className={s.name}>{wrap.name}</h3>

                <div className={s.playButton}>
                  <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: '24px', height: '24px', color: '#000', marginLeft: '2px' }}>
                    <path d="M7 6v12l10-6z" />
                  </svg>
                </div>
              </div>
              
              <p className={s.subtitle}>{wrap.subtitle}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function DummyWrapsDemo() {
  return (
    <section className="relative w-full bg-[#121212] px-4 py-16 md:px-8 md:py-24 border-y-4 border-ink">
      <div className="mx-auto max-w-[1600px]">
        <WrapRow title="Popular wraps" wraps={ROW_1} />
        <WrapRow title="Trending Now" wraps={ROW_2} />
        <WrapRow title="Made For You" wraps={ROW_3} />
      </div>
    </section>
  )
}
