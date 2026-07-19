import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get("q")

    if (!q) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    const apiKey = process.env.YOUTUBE_API_KEY

    if (apiKey) {
      console.log("[search-song] Using official YouTube Data API")
      const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${encodeURIComponent(
        q
      )}&type=video&key=${apiKey}`

      const res = await fetch(url)
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(`YouTube API returned ${res.status}: ${errText}`)
      }

      const data = await res.json()
      
      const videos = (data.items || []).map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        artist: item.snippet.channelTitle,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || "",
      }))

      return NextResponse.json({ results: videos })
    }

    // Fallback to scraping locally if no API key is provided
    console.log("[search-song] Using yt-search scraping fallback")
    const ytSearch = (await import("yt-search")).default
    const results = await ytSearch(q)
    
    // Filter to just videos and take top 5
    const videos = results.videos.slice(0, 5).map((v: any) => ({
      videoId: v.videoId,
      title: v.title,
      artist: v.author.name,
      thumbnail: v.thumbnail,
    }))

    return NextResponse.json({ results: videos })
  } catch (error: any) {
    console.error("[search-song] Error searching YouTube:", error)
    return NextResponse.json({ 
      error: "Failed to search YouTube", 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 })
  }
}
