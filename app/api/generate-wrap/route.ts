import { NextRequest, NextResponse } from "next/server"

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent"

function buildPrompt(body: Record<string, unknown>): string {
  const {
    name,
    purpose,
    userNames,
    vibe,
    anthemTitle,
    anniversaryDate,
    destinationCity,
    travelHours,
    delusionalHabit,
    birthYear,
    storyParagraph,
    photoCount,
  } = body

  const purposeLabels: Record<string, string> = {
    couple: "Couple / Love Story",
    travel: "Travel Memories",
    birthday: "Birthday Special",
    life: "Personal Life Journey",
    group: "Group & Family Chaos",
  }

  const purposeLabel = purposeLabels[(purpose as string) ?? "life"] ?? "Personal Life Journey"

  return `You are a world-class creative director for a viral "Year Wrapped" experience — think Spotify Wrapped but for someone's LIFE. Your job is to write punchy, Gen-Z, unhinged-but-heartfelt, meme-aware copy that makes every slide screenshot-worthy.

## USER PROFILE
- **Name**: ${name || "User"}
- **Purpose**: ${purposeLabel}
- **People involved**: ${userNames || name || "the main character"}
- **Sonic vibe**: ${vibe || "hyperpop"}
- **Anthem song**: ${anthemTitle || "their song"}
${anniversaryDate ? `- **Anniversary/First date**: ${anniversaryDate}` : ""}
${destinationCity ? `- **Destination city**: ${destinationCity}` : ""}
${travelHours ? `- **Travel hours**: ${travelHours}` : ""}
${delusionalHabit ? `- **Delusional habit / inside joke**: ${delusionalHabit}` : ""}
${birthYear ? `- **Birth year**: ${birthYear}` : ""}
- **Photos uploaded**: ${photoCount || 0}

## USER'S STORY (use this heavily — it's the soul of the wrap)
"${storyParagraph || "No story provided — improvise based on the profile above."}"

## INSTRUCTIONS
Generate creative, personalized, trendy content for an 8-slide wrapped experience. The content must:
1. Be deeply personalized using the user's name, story, and details
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
  "dataHighlight": {
    "kicker": "2-4 word label for the big number slide (e.g. 'Time on the clock', 'The receipts are in')",
    "label": "What the number represents (e.g. 'Days of chaos', 'Hours in transit')",
    "note": "A witty 1-2 sentence observation about this number. Reference their story."
  },
  "topTrack": {
    "kicker": "2-3 word label (e.g. 'Your anthem', 'On repeat')",
    "artistLine": "A creative subtitle for the track card (e.g. 'the soundtrack of your villain arc')"
  },
  "receipts": {
    "title": "A creative title for the stats receipt (e.g. 'The damage report', 'Chat wrapped')",
    "rows": [
      { "label": "Creative metric name personalized to their story", "value": "A fun made-up stat value" },
      { "label": "Another personalized metric", "value": "Another stat" },
      { "label": "Third metric", "value": "Third stat" },
      { "label": "Fourth metric", "value": "Fourth stat" }
    ]
  },
  "versus": {
    "kicker": "2-3 word label (e.g. 'The main event', 'Head to head')",
    "left": "Left side name — something from their story or a personality trait (1-3 words)",
    "right": "Right side name — opposing thing (1-3 words)",
    "leagueTitle": "A funny league/competition name relevant to their life"
  },
  "versusBoard": {
    "kicker": "2-3 word label",
    "title": "Creative board title (e.g. 'Top matchups', 'The bracket')",
    "games": [
      { "team1": "Something from their life", "team2": "Opposing thing", "competition": "Funny context" },
      { "team1": "Another thing", "team2": "Another opposing", "competition": "Another context" },
      { "team1": "Third thing", "team2": "Third opposing", "competition": "Third context" },
      { "team1": "Fourth thing", "team2": "Fourth opposing", "competition": "Fourth context" }
    ]
  },
  "dashboard": {
    "topArtists": ["3 creative artist names or personality archetypes from their story"],
    "topSongs": ["3 creative 'song titles' that are actually life moments from their story"],
    "topGenre": "A funny made-up genre that describes their year (e.g. 'Chaotic Soft Pop')"
  },
  "finale": {
    "tagline": "An epic, emotional 1-sentence farewell line. Make it feel like the end of a movie."
  }
}

CRITICAL: 
- The "lines" array in "intro" MUST have exactly 3 short items (1-2 words each) — they're displayed as giant stacked text.
- "receipts.rows" MUST have exactly 4 items.
- "versusBoard.games" MUST have exactly 4 items.
- "dashboard.topArtists" MUST have exactly 3 items.
- "dashboard.topSongs" MUST have exactly 3 items.
- Make "versus" entries feel like a personal battle/duality from their life, not generic sports.
- Make "versusBoard.games" entries feel like life moments or personality clashes, not actual sports games.
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

/** Extract the actual text content from Gemini response (handles 2.5 Flash thinking parts) */
function extractGeminiText(response: Record<string, unknown>): string {
  const parts = (response as any)?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts) || parts.length === 0) return ""

  // Gemini 2.5 Flash puts thinking in earlier parts, text in the last part
  // Find the last part that has a "text" field (not a "thought" field)
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].text !== undefined && !parts[i].thought) {
      return parts[i].text
    }
  }
  // Fallback: just grab the last text
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].text !== undefined) {
      return parts[i].text
    }
  }
  return ""
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY not configured" },
        { status: 500 },
      )
    }

    const body = await req.json()
    const prompt = buildPrompt(body)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000) // 45s timeout for thinking model

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 1.0,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
        },
      }),
    })

    clearTimeout(timeout)

    if (!res.ok) {
      const errText = await res.text()
      console.error("[generate-wrap] Gemini API error:", res.status, errText)
      return NextResponse.json(
        { error: `Gemini API returned ${res.status}` },
        { status: 502 },
      )
    }

    const geminiResponse = await res.json()

    // Check if the response was truncated (finish reason)
    const finishReason = (geminiResponse as any)?.candidates?.[0]?.finishReason
    if (finishReason && finishReason !== "STOP" && finishReason !== "END_TURN") {
      console.warn("[generate-wrap] Non-standard finish reason:", finishReason)
    }

    // Extract the text from Gemini's response (handles 2.5 Flash thinking parts)
    const rawText = extractGeminiText(geminiResponse)

    if (!rawText) {
      console.error("[generate-wrap] Empty response from Gemini. Full response:", JSON.stringify(geminiResponse).slice(0, 500))
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
      } catch (e2) {
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
      !parsed.receipts ||
      !parsed.versus ||
      !parsed.versusBoard ||
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

