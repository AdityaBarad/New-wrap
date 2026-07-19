import { NextRequest, NextResponse } from "next/server"
import ytSearch from "yt-search"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")

    if (!q) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    // Perform the search
    const results = await ytSearch(q)
    
    // Filter to just videos and take top 5
    const videos = results.videos.slice(0, 5).map((v) => ({
      videoId: v.videoId,
      title: v.title,
      artist: v.author.name,
      thumbnail: v.thumbnail,
    }))

    return NextResponse.json({ results: videos })
  } catch (error) {
    console.error("[search-song] Error searching YouTube:", error)
    return NextResponse.json({ error: "Failed to search YouTube" }, { status: 500 })
  }
}
