import { NextRequest, NextResponse } from "next/server"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL = "llama-3.3-70b-versatile"

function buildPrompt(body: Record<string, unknown>): string {
  const {
    purpose,
    userNames,
    anniversaryDate,
    destinationCity,
    travelHours,
    delusionalHabit,
    birthYear,
    storyParagraph,
    photoCount,
    song,
  } = body

  const purposeLabels: Record<string, string> = {
    couple: "Couple / Love Story",
    travel: "Travel Memories",
    birthday: "Birthday Special",
    life: "Personal Life Journey",
    group: "Group & Family Chaos",
  }

  const purposeLabel = purposeLabels[(purpose as string) ?? "life"] ?? "Personal Life Journey"

  return `You are a world-class creative director for a viral "Life Wrapped" experience — think Spotify Wrapped but for someone's LIFE. Your job is to write punchy, Gen-Z, unhinged-but-heartfelt, meme-aware copy that makes every slide screenshot-worthy.

## USER PROFILE
- **Purpose**: ${purposeLabel}
- **People involved**: ${userNames || "the main character"}
${anniversaryDate ? `- **Anniversary/First date**: ${anniversaryDate}` : ""}
${destinationCity ? `- **Destination city**: ${destinationCity}` : ""}
${travelHours ? `- **Travel hours**: ${travelHours}` : ""}
${delusionalHabit ? `- **Delusional habit / inside joke**: ${delusionalHabit}` : ""}
${birthYear ? `- **Birth year**: ${birthYear}` : ""}
- **Photos uploaded**: ${photoCount || 0}
${song ? `- **Chosen theme song**: ${song}` : ""}

## USER'S STORY (use this heavily — it's the soul of the wrap)
"${storyParagraph || "No story provided — improvise based on the profile above."}"

## INSTRUCTIONS
Generate creative, personalized, trendy content for an 8-slide wrapped experience. The content must:
1. Be deeply personalized using the user's story and details
2. Sound like a mix of Spotify Wrapped + Instagram Reels + Twitter shitposting
3. Use Gen-Z slang naturally (slay, era, main character, unhinged, no cap, ate, etc.)
4. Reference specific details from their story paragraph
5. Be witty, warm, and shareable — every line should make someone want to screenshot it
6. Be unique — NEVER generic. If they mentioned a city, reference it. If they mentioned a habit, roast it lovingly.

Return ONLY a valid JSON object (no markdown, no backticks, no explanation) with this exact structure:

{
  "intro": {
    "kicker": "2-3 word punchy intro label (e.g. 'Now Streaming', 'Main Character Alert')",
    "lines": ["Word1", "Word2", "Word3"],
    "sub": "1-2 sentence witty subtitle that references their story. Make it personal and cinematic."
  },
  "share": {
    "title": "Creative 2-4 word title (e.g. 'Share your unhinged era')",
    "hashtag": "A personalized hashtag (e.g. '#YourLifeWrapped')"
  },
  "dataHighlight": {
    "kicker": "2-4 word label for the big number slide (e.g. 'Time on the clock', 'The receipts are in')",
    "label": "What the number represents (e.g. 'Days of chaos', 'Hours in transit')",
    "note": "A witty 1-2 sentence observation about this number. Reference their story."
  },
  "topTrack": {
    "kicker": "2-3 word label (e.g. 'Your anthem', 'On repeat')",
    "title": "A personalized song title that encapsulates their vibe or story (e.g. 'Espresso (But More Anxious)', 'Tokyo Drifting')",
    "artistLine": "A creative subtitle/artist line for the track card (e.g. 'the soundtrack of your villain arc')"
  },

  "globalArtistsTitle": "Creative title for global artists (e.g. 'Your Main Character Influences')",
  "globalArtists": [
    "Artist 1 or funny personality archetype",
    "Artist 2",
    "Artist 3",
    "Artist 4",
    "Artist 5"
  ],
  "artistStats": {
    "name": "Top artist name or main character persona",
    "streams": "A funny made-up number (e.g. '420.6')",
    "hours": "A funny made-up number (e.g. '69.4')",
    "listeners": "A funny made-up number (e.g. '100')",
    "countries": "A funny made-up number (e.g. '42')"
  },
  "worldCitizen": {
    "title": "Creative title for the globe slide (e.g. 'Mr. Worldwide')",
    "description1": "1 sentence describing their global footprint (e.g. 'When it comes to your chaos, borders disappear.')",
    "description2": "1 sentence describing their reach. MUST include '{count}' as a placeholder (e.g. 'Your delusions have traveled to {count} countries.')",
    "countriesCount": 42,
    "artists": [
      { "name": "Artist 1", "country": "Country 1" },
      { "name": "Artist 2", "country": "Country 2" },
      { "name": "Artist 3", "country": "Country 3" },
      { "name": "Artist 4", "country": "Country 4" },
      { "name": "Artist 5", "country": "Country 5" },
      { "name": "Artist 6", "country": "Country 6" }
    ]
  },
  "dashboard": {
    "topArtistsTitle": "Creative title for top artists (e.g. 'Your Holy Trinity (Plus Two)')",
    "topArtists": ["Artist 1", "Artist 2", "Artist 3", "Artist 4", "Artist 5"],
    "topSongs": ["Song 1 (life moment)", "Song 2", "Song 3", "Song 4", "Song 5"],
    "topGenresTitle": "Creative title for top genres (e.g. 'Your Chaotic Vibes')",
    "topGenres": ["Genre 1 (e.g. Chaotic Soft Pop)", "Genre 2", "Genre 3", "Genre 4", "Genre 5"],
    "minutesListened": "A funny made-up number (e.g. '69,420')"
  },
  "finale": {
    "title": "Creative title for the final slide (e.g. 'Your 2025 Era')",
    "tagline": "An epic, emotional 1-sentence farewell line. Make it feel like the end of a movie.",
    "minutesLived": "A funny huge number (e.g. '525,600')",
    "minutesLabel": "Creative label for minutes lived (e.g. 'min lived')",
    "topPercent": "A funny number between 1 and 9 (e.g. '1')",
    "topPercentLabel": "Creative label for top percent (e.g. 'main character')"
  }
}

Full Response Example- refer this

json
{
  "intro": {
    "kicker": "COUPLE ALERT",
    "lines": ["SARAH", "&", "MARK"],
    "sub": "You survived IKEA and moving in together. Truly, a miracle."
  },
  "share": {
    "title": "Share your \ncouple era",
    "hashtag": "#SarahAndMarkSurvived"
  },
  "dataHighlight": {
    "kicker": "The receipts are in",
    "label": "Steps walked in Paris",
    "note": "Because taking the metro is for the weak, apparently. Two hours for a bakery? Worth it."
  },
  "topTrack": {
    "kicker": "Your anthem",
    "title": "Espresso (But More Caffeinated)",
    "artistLine": "the soundtrack of your 3 AM reality TV binges"
  },
  "globalArtistsTitle": "Your Main Character Influences",
  "globalArtists": [
    "The IKEA Instruction Manual",
    "Your Barista",
    "The Reality TV Villains",
    "The Paris Metro Map",
    "Sabrina Carpenter"
  ],
  "artistStats": {
    "name": "Iced Latte Enthusiasts",
    "streams": "365",
    "hours": "700",
    "listeners": "2",
    "countries": "1 (But you walked 10 miles in it)"
  },
  "worldCitizen": {
    "title": "Mr & Mrs Worldwide",
    "description1": "When it comes to walking in circles, borders disappear.",
    "description2": "Your delusions have traveled to {count} countries.",
    "countriesCount": 1,
    "artists": [
      { "name": "The Lost Bakery", "country": "France" },
      { "name": "MALM Dresser", "country": "Sweden" },
      { "name": "Iced Latte", "country": "USA" },
      { "name": "Reality TV Drama", "country": "UK" },
      { "name": "Espresso", "country": "Global" },
      { "name": "Google Maps (Failed)", "country": "Internet" }
    ]
  },
  "dashboard": {
    "topArtistsTitle": "Your Holy Trinity (Plus Two)",
    "topArtists": ["Sabrina Carpenter", "The Barista", "IKEA Founder", "Reality TV Host", "Parisian Baker"],
    "topSongs": ["Espresso", "The Sound of IKEA Allen Keys", "3 AM TV Intro Theme", "Walking in Circles BGM", "Metro Announcements"],
    "topGenresTitle": "Your Chaotic Vibes",
    "topGenres": ["Caffeinated Pop", "IKEA Assembly Rage", "Reality TV Trash", "Parisian Lost-core", "Delusional Walking Beats"],
    "minutesListened": "8,760"
  },
  "finale": {
    "title": "Your 2025 Era",
    "tagline": "You didn't kill each other assembling furniture. That's true love.",
    "minutesLived": "525,600",
    "minutesLabel": "min survived together",
    "topPercent": "1",
    "topPercentLabel": "most delusional walkers"
  }
}

CRITICAL: 
- The "lines" array in "intro" MUST have exactly 3 short items (1-2 words each) — they're displayed as giant stacked text.
- "globalArtists" MUST have exactly 5 items.
- "worldCitizen.artists" MUST have exactly 6 items.
- "dashboard.topArtists" MUST have exactly 5 items.
- "dashboard.topSongs" MUST have exactly 5 items.
- "dashboard.topGenres" MUST have exactly 5 items.
- Return ONLY the JSON. No markdown code fences. No explanation.`
}

/** Attempt to repair truncated JSON by closing open structures */
function repairJson(raw: string): string {
  let s = raw.trim()
  // Remove trailing commas before closing brackets
  s = s.replace(/,\s*$/, "")

  // Count open/close braces and brackets
  let braces = 0
  let brackets = 0
  let inString = false
  let escape = false

  for (const ch of s) {
    if (escape) { escape = false; continue }
    if (ch === "\\") { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === "{") braces++
    else if (ch === "}") braces--
    else if (ch === "[") brackets++
    else if (ch === "]") brackets--
  }

  // If we're inside a string, close it
  if (inString) s += '"'

  // Close any open brackets/braces
  while (brackets > 0) { s += "]"; brackets-- }
  while (braces > 0) { s += "}"; braces-- }

  return s
}

/** Extract text content from Groq/OpenAI-compatible response */
function extractGroqText(response: Record<string, unknown>): string {
  return (response as any)?.choices?.[0]?.message?.content ?? ""
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY not configured" },
        { status: 500 },
      )
    }

    const body = await req.json()
    const prompt = buildPrompt(body)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000)

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 1.0,
        max_tokens: 8192,
        response_format: { type: "json_object" },
      }),
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const errText = await res.text()
      console.error("[generate-wrap] Groq API error:", res.status, errText)
      return NextResponse.json(
        { error: `Groq API returned ${res.status}` },
        { status: 502 },
      )
    }

    const groqResponse = await res.json()

    const rawText = extractGroqText(groqResponse)

    if (!rawText) {
      console.error("[generate-wrap] Empty response from Groq. Full response:", JSON.stringify(groqResponse).slice(0, 500))
      return NextResponse.json(
        { error: "Empty response from AI" },
        { status: 502 },
      )
    }

    // Clean up potential markdown fences
    let cleaned = rawText.trim()
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\s*/, "").replace(/\s*```$/, "")
    }

    // Try parsing, with repair on failure
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      console.warn("[generate-wrap] JSON parse failed, attempting repair...")
      try {
        const repaired = repairJson(cleaned)
        parsed = JSON.parse(repaired)
        console.log("[generate-wrap] JSON repair succeeded")
      } catch {
        console.error("[generate-wrap] JSON repair also failed. Raw text (first 1000 chars):", cleaned.slice(0, 1000))
        return NextResponse.json(
          { error: "AI returned malformed JSON" },
          { status: 502 },
        )
      }
    }

    // Basic structural validation
    if (
      !parsed.intro ||
      !parsed.dataHighlight ||
      !parsed.topTrack ||
      !parsed.dashboard ||
      !parsed.finale
    ) {
      console.error("[generate-wrap] Invalid JSON structure. Keys found:", Object.keys(parsed))
      return NextResponse.json(
        { error: "AI returned invalid structure" },
        { status: 502 },
      )
    }

    return NextResponse.json({ content: parsed })
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json(
        { error: "AI generation timed out" },
        { status: 504 },
      )
    }
    console.error("[generate-wrap] Unexpected error:", err)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    )
  }
}

