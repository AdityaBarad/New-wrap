import type { Metadata } from "next"
import { createClient } from "@supabase/supabase-js"
import { WrapViewer } from "./wrap-viewer"
import type { WrapData, SongData } from "@/context/wrap-context"
import type { AiWrapContent } from "@/lib/ai-types"

type Props = {
  params: Promise<{ slug: string }>
}

// Supabase client for server-side data fetching
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

async function getWrap(slug: string) {
  const supabase = getSupabase()

  const { data, error } = await supabase
    .from("wraps")
    .select("*")
    .eq("slug", slug)
    .eq("is_public", true)
    .maybeSingle()

  if (error || !data) return null

  // Increment view count (fire-and-forget)
  supabase
    .from("wraps")
    .update({ views: (data.views || 0) + 1 })
    .eq("id", data.id)
    .then(() => {})

  return data
}

// Dynamic OG metadata for social sharing
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const wrap = await getWrap(slug)

  if (!wrap) {
    return {
      title: "Wrap Not Found — Your Life, Wrapped",
      description: "This wrap doesn't exist or has been removed.",
    }
  }

  const ai = wrap.ai_content as AiWrapContent
  const title = `${wrap.name}'s Life, Wrapped`
  const description = ai?.intro?.sub || "Check out this Life Wrapped!"

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      ...(wrap.personality_image_url
        ? { images: [{ url: wrap.personality_image_url, width: 512, height: 768 }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(wrap.personality_image_url
        ? { images: [wrap.personality_image_url] }
        : {}),
    },
  }
}

export default async function WrapPage({ params }: Props) {
  const { slug } = await params
  const wrap = await getWrap(slug)

  if (!wrap) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0b0b0b] text-white">
        <h1 className="font-display text-5xl font-black tracking-tight">404</h1>
        <p className="mt-4 text-lg text-white/60">This wrap doesn't exist or has been removed.</p>
        <a
          href="/"
          className="mt-8 rounded-full bg-white/10 px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
        >
          Go Home
        </a>
      </div>
    )
  }

  // Reconstruct WrapData from the stored fields
  const wrapData: WrapData = {
    name: wrap.name,
    phone: "", // Not stored in wraps table (privacy)
    whatsThisFor: "",
    promoCode: "",
    purpose: wrap.purpose,
    userNames: wrap.user_names || "",
    chatExportName: "",
    anniversaryDate: wrap.anniversary_date || "",
    destinationCity: wrap.destination_city || "",
    travelHours: wrap.travel_hours || "",
    delusionalHabit: wrap.delusional_habit || "",
    birthYear: wrap.birth_year || "",
    storyParagraph: wrap.story_paragraph || "",
    photos: (wrap.photo_urls || []).map((url: string, i: number) => ({
      name: `photo-${i + 1}`,
      url,
    })),
    song: wrap.song_title
      ? {
          videoId: wrap.song_video_id || "",
          title: wrap.song_title,
          artist: wrap.song_artist || "",
          thumbnail: wrap.song_thumbnail || "",
        } as SongData
      : null,
  }

  const aiContent = wrap.ai_content as AiWrapContent
  const personalityImageUrl = wrap.personality_image_url || null

  return (
    <WrapViewer
      wrapData={wrapData}
      aiContent={aiContent}
      personalityImageUrl={personalityImageUrl}
      slug={wrap.slug}
      views={wrap.views || 0}
    />
  )
}
