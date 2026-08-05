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

  return `You are a world-class creative director for a viral "Story Wrapped" experience — think Wrapsy Wrapped but for someone's STORY. Your job is to write punchy, Gen-Z, unhinged-but-heartfelt, meme-aware copy that makes every slide screenshot-worthy.

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
2. Sound like a mix of Wrapsy Wrapped + Instagram Reels + Twitter shitposting
3. Use Gen-Z slang naturally (slay, era, main character, unhinged, no cap, ate, etc.)
4. Reference specific details from their story paragraph
5. Be witty, warm, and shareable — every line should make someone want to screenshot it
6. Be unique — NEVER generic. If they mentioned a city, reference it. If they mentioned a habit, roast it lovingly.
7. CRITICAL LENGTH LIMIT: For "globalArtists" list, EACH item MUST be MAXIMUM 15 CHARACTERS (e.g. 'Maggie Mei', 'Momos Mafia'). Keep them short so they fit on screen!

Return ONLY a valid JSON object (no markdown, no backticks, no explanation) adhering STRICTLY to the following structure and constraints.
IMPORTANT: The values you generate MUST be wildly creative, unique, and deeply personalized to the user's story. DO NOT use generic Spotify defaults. Capture the true Spotify Wrapped vibe (punchy, rhythmic, slightly roasting, deeply celebratory).

{
  "intro": {
    "kicker": "2-3 word punchy intro label",
    "lines": ["Exactly", "Three", "Words"],
    "sub": "1-2 sentence witty subtitle that references their story."
  },
  "share": {
    "title": "Creative 2-4 word title",
    "hashtag": "A personalized camelCase hashtag"
  },
  "dataHighlight": {
    "kicker": "2-4 word label for a big number slide",
    "label": "What the number represents",
    "note": "A witty 1-2 sentence observation about this number."
  },
  "highlightCard": {
    "kicker": "2-3 word label",
    "title": "A personalized title (e.g. for a couple, 'Biggest Fight', for travel 'Best Meal')",
    "subtitle": "A creative subtitle for this card"
  },
  "topListTitle": "Creative title for a top 5 list (e.g. 'Top Delusions', 'Top Inside Jokes')",
  "topList": [
    "Item 1 (MAX 15 CHARACTERS)",
    "Item 2 (MAX 15 CHARACTERS)",
    "Item 3 (MAX 15 CHARACTERS)",
    "Item 4 (MAX 15 CHARACTERS)",
    "Item 5 (MAX 15 CHARACTERS)"
  ],
  "statProfile": {
    "name": "The main subject (e.g. the person's name or the group's name)",
    "stat1Label": "Creative label for a metric (e.g. 'Tears Shed')",
    "stat1Value": "A funny exaggerated number",
    "stat2Label": "Creative label for a metric (e.g. 'Inside Jokes')",
    "stat2Value": "A funny exaggerated number",
    "stat3Label": "Creative label for a metric (e.g. 'Late Nights')",
    "stat3Value": "A tiny or massive number",
    "stat4Label": "Creative label for a metric (e.g. 'Apologies')",
    "stat4Value": "A funny number or short text"
  },
  "globalFootprint": {
    "title": "Creative title for a location-based slide (e.g. 'Where You Caused Chaos')",
    "description1": "1 sentence describing their footprint.",
    "description2": "1 sentence describing their reach. MUST include '{count}' as a placeholder.",
    "locationsCount": 42,
    "locations": [
      { "name": "Funny Location 1", "location": "City/Country 1" },
      { "name": "Funny Location 2", "location": "City/Country 2" },
      { "name": "Funny Location 3", "location": "City/Country 3" },
      { "name": "Funny Location 4", "location": "City/Country 4" },
      { "name": "Funny Location 5", "location": "City/Country 5" },
      { "name": "Funny Location 6", "location": "City/Country 6" }
    ]
  },
  "summaryDashboard": {
    "list1Title": "Creative title for list 1 (e.g. 'Top Red Flags')",
    "list1": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    "list2Title": "Creative title for list 2 (e.g. 'Top Iconic Quotes')",
    "list2": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    "list3Title": "Creative title for list 3 (e.g. 'Top Excuses')",
    "list3": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
    "bottomMetric": "A huge made-up number",
    "bottomMetricLabel": "Creative label for the bottom metric (e.g. 'Minutes Wasted')"
  },
  "finale": {
    "title": "Creative title for the final slide",
    "tagline": "An epic, emotional 1-sentence farewell line.",
    "metricValue": "A funny huge number",
    "metricLabel": "Creative label for this metric",
    "topPercent": "A number between 1 and 9",
    "topPercentLabel": "Creative label for the top percent metric"
  },
  "personalityCard": {
    "title": "A 1-2 word personality archetype",
    "description": "A punchy 1-2 sentence description of why they got this personality.",
    "imagePrompt": "A highly detailed image generation prompt for Stable Diffusion. It MUST specify: 'Wrapsy Wrapped character card style, flat vector illustration, neon glowing colors on dark black background, surreal and mystical.' followed by the specific imagery for the archetype."
  }
}

CRITICAL: 
- The "lines" array in "intro" MUST have exactly 3 short items (1-2 words each) — they're displayed as giant stacked text.
- "topList" MUST have exactly 5 items, and EACH ITEM MUST BE A MAXIMUM OF 15 CHARACTERS so text does not overlap background graphics.
- "globalFootprint.locations" MUST have exactly 6 items.
- "summaryDashboard.list1" MUST have exactly 5 items.
- "summaryDashboard.list2" MUST have exactly 5 items.
- "summaryDashboard.list3" MUST have exactly 5 items.
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
      !(parsed.highlightCard || parsed.topTrack) ||
      !(parsed.summaryDashboard || parsed.dashboard) ||
      !parsed.finale ||
      !parsed.personalityCard
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

