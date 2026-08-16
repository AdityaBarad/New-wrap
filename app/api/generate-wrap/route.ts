import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
const GROQ_MODEL = "llama-3.3-70b-versatile"

function buildPrompt(body: Record<string, unknown>): string {
  const {
    purpose,
    userNames,
    anniversaryDate,
    destinationCity,
    travelHours,
    birthYear,
    storyParagraph,
    photoCount,
  } = body

  const purposeLabels: Record<string, string> = {
    couple: "Couple / Love Story",
    travel: "Travel Memories",
    birthday: "Birthday Special",
    life: "Personal / Self",
    group: "Group / Family",
  }

  const purposeLabel = purposeLabels[(purpose as string) ?? "life"] ?? "Personal / Self"

  return `You are a world-class creative director for a viral "Story Wrapped" experience — think Spotify Wrapped but for someone's STORY. Your job is to write punchy, Gen-Z, unhinged-but-heartfelt, meme-aware copy that makes every slide screenshot-worthy.

## USER PROFILE
- **Purpose**: ${purposeLabel}
- **People involved**: ${userNames || "the main character"}
${anniversaryDate ? `- **Anniversary/First date**: ${anniversaryDate}` : ""}
${destinationCity ? `- **Destination city**: ${destinationCity}` : ""}
${travelHours ? `- **Travel hours**: ${travelHours}` : ""}
${birthYear ? `- **Birth year**: ${birthYear}` : ""}
- **Photos uploaded**: ${photoCount || 0}

## USER'S STORY (THIS IS THE MOST IMPORTANT INPUT — USE EVERY SINGLE DETAIL)
"${storyParagraph || "No story provided — improvise based on the profile above."}"

## INSTRUCTIONS
Generate creative, personalized, trendy unique content for an 8-slide wrapped experience. The content must:
1. Be deeply personalized using the user's story and details
2. Sound like a mix of spotify Wrapped + Instagram Reels + Twitter shitposting
3. Use Gen-Z slang naturally (slay, era, main character, unhinged, no cap, ate, etc.)
4. Be witty, warm, and shareable — every line should make someone want to screenshot it
5. Be unique — NEVER generic. If they mentioned a city, reference it. If they mentioned a habit, roast it lovingly.
6. Don't assume things on your own, stay with the data only that users gave.
7. This is NOT about music or songs. Do NOT reference any songs, artists, albums, music, or Spotify-specific terms. This is a STORY wrap about the person's LIFE.

## USE EVERY DETAIL FROM THE STORY
The user has written a paragraph with many specific details, memories, habits, places, foods, inside jokes, and quirks. You MUST use ALL of them:
- First, break the user's story into individual facts/details (e.g. "loves phuchkas", "steals hoodies", "fights about AC temperature", "binge watches K-dramas").
- Then distribute ALL of those details across the slides — every single one must appear somewhere in the output.
- If the user mentioned 15 things, all 15 must appear across the wrap. Do NOT skip or ignore any detail.
- Use the less obvious, quirky details for the ranking lists, dashboard items, and stat labels — these are perfect for those slots.

## ABSOLUTE NO-REPETITION RULE
Each detail is a ONE-TIME-USE token:
- If you mention a detail (e.g. "phuchkas", "stealing hoodies", "late night calls") on ANY slide, you are PERMANENTLY BANNED from using that same detail on ANY other slide.
- Before writing each slide, mentally check: "Have I already used this detail?" If yes, pick a DIFFERENT detail.
- Spread details evenly — use each one ONLY ONCE across the entire wrap.
- This applies to ALL fields: intro.sub, highlightCard, topList items, blockRanking items, summaryDashboard lists, globalFootprint descriptions, statProfile labels, dataHighlight note, personalityCard description, and finale tagline.
- If two slides end up referencing the same food, habit, joke, person, or memory, the ENTIRE output is INVALID.

Return ONLY a valid JSON object (no markdown, no backticks, no explanation) adhering STRICTLY to the following structure and constraints.
IMPORTANT: The values you generate MUST be wildly creative, unique, and deeply personalized to the user's story. DO NOT use generic Spotify defaults. Capture the true Spotify Wrapped vibe (punchy, rhythmic, slightly roasting, deeply celebratory).

{
  "intro": {
    "kicker": "Short welcoming phrase (e.g. 'Hello', 'Ready?')",
    "lines": ["WORD1", "WORD2", "WORD3"], // ONE OF THESE MUST BE THE USER'S NAME
    "sub": "A warm subtitle to get them excited"
  },
  "share": {
    "title": "Creative 2-3 word title",
    "hashtag": "A personalized camelCase hashtag"
  },
  "dataHighlight": {
    "kicker": "2-4 word label for the big number slide — ${anniversaryDate ? 'The number is DAYS since their anniversary/first date. Frame kicker, label, and note around days together.' : travelHours ? 'The number is their TOTAL TRAVEL HOURS. Frame kicker, label, and note around travel time.' : birthYear ? `The number is their AGE (born ${birthYear}, currently ${new Date().getFullYear() - Number(birthYear)} years old). Frame kicker, label, and note around their age/years of life.` : 'Frame it around a fun made-up stat.'}",
    "label": "What the number represents (e.g. DAYS SINCE WE MET, YEARS OF EXCELLENCE)",
    "note": "A witty 1-2 sentence observation about this number."
  },
  "highlightCard": {
    "kicker": "2-3 word label (NOT music-related, e.g. 'Core Memory', 'Main Highlight', 'Defining Moment')",
    "title": "A personalized title about a key memory or trait (NOT a song name). E.g. 'Biggest Fight', 'Best Meal', 'The Meltdown'",
    "subtitle": "A creative subtitle describing this moment (NOT an artist name)"
  },
  "topListTitle": "Creative title for a top 5 list (e.g. 'Top Delusions', 'Top Inside Jokes') ",
  "topList": [
    "Item 1 (MAX 20 CHARACTERS 2 words)",
    "Item 2 (MAX 20 CHARACTERS 2 words)",
    "Item 3 (MAX 20 CHARACTERS 2 words)",
    "Item 4 (MAX 20 CHARACTERS 2 words)",
    "Item 5 (MAX 20 CHARACTERS 2 words)"
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
      "title": "Creative title for a general impact-based slide (e.g. 'Main Character Energy', 'Unstoppable')",
      "description1": "1 punchy sentence describing their undeniable presence or vibe.",
      "description2": "1 punchy sentence describing how far their energy reaches."
    },
    "photoRanking": {
      "title": "Creative title for a ranking list (e.g. 'Top Red Flags', 'Most Used Excuses')",
      "items": ["Item 1 (2-4 words, MAX 25 CHARACTERS)", "Item 2 (2-4 words, MAX 25 CHARACTERS)", "Item 3 (2-4 words, MAX 25 CHARACTERS)", "Item 4 (2-4 words, MAX 25 CHARACTERS)", "Item 5 (2-4 words, MAX 25 CHARACTERS)"]
    },
    "blockRanking": {
      "title": "Creative title for another ranking list (e.g. 'Iconic Quotes', 'Top Excuses')",
      "items": ["Item 1 (3-4 words, MAX 25 CHARACTERS)", "Item 2 (3-4 words, MAX 25 CHARACTERS)", "Item 3 (3-4 words, MAX 25 CHARACTERS)", "Item 4 (3-4 words, MAX 25 CHARACTERS)", "Item 5 (3-4 words, MAX 25 CHARACTERS)"]
    },
  "summaryDashboard": {
    "list1Title": "Creative title for list 1 (e.g. 'Top Red Flags')",
    "list1": ["Item 1 (1-2 words, MAX 20 CHARACTERS)", "Item 2", "Item 3", "Item 4", "Item 5"],
    "list2Title": "Creative title for list 2 (e.g. 'Top Iconic Quotes')",
    "list2": ["Item 1 (1-2 words, MAX 20 CHARACTERS)", "Item 2", "Item 3", "Item 4", "Item 5"],
    "list3Title": "Creative title for list 3 (e.g. 'Top Excuses')",
    "list3": ["Item 1 (1-2 words, MAX 20 CHARACTERS)", "Item 2", "Item 3", "Item 4", "Item 5"],
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
    "imagePrompt": "A highly detailed image generation prompt for Stable Diffusion. It MUST specify: 'Spotify Wrapped character card style, flat vector illustration and mystical.' followed by the specific imagery for the archetype."
  }
}

CRITICAL: 
- The "lines" array in "intro" MUST have exactly 3 items. ONE OF THE ITEMS MUST BE THE USER'S EXACT NAME AS PROVIDED (even if it contains multiple names or symbols like "Aditya & Geet"), and the other two items should be short (1-2 words).
- "photoRanking.items" MUST have exactly 5 items, and EACH ITEM MUST BE 2-4 WORDS (MAXIMUM OF 25 CHARACTERS).
- "blockRanking.items" MUST have exactly 5 items, and EACH ITEM MUST BE 3-4 WORDS (MAXIMUM OF 25 CHARACTERS).
- "summaryDashboard.list1" MUST have exactly 5 items, EACH 1-2 WORDS (MAX 20 CHARACTERS).
- "summaryDashboard.list2" MUST have exactly 5 items, EACH 1-2 WORDS (MAX 20 CHARACTERS).
- "summaryDashboard.list3" MUST have exactly 5 items, EACH 1-2 WORDS (MAX 20 CHARACTERS).
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

    if (body?.phone) {
      Sentry.setUser({ id: body.phone })
    }

    const prompt = buildPrompt(body)
    console.log("[generate-wrap] Full prompt:\n", prompt)

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
      Sentry.captureException(new Error(`Groq API error: ${res.status} ${errText}`))
      return NextResponse.json(
        { error: `Groq API returned ${res.status}` },
        { status: 502 },
      )
    }

    const groqResponse = await res.json()

    const rawText = extractGroqText(groqResponse)

    if (!rawText) {
      console.error("[generate-wrap] Empty response from Groq. Full response:", JSON.stringify(groqResponse).slice(0, 500))
      Sentry.captureException(new Error(`Empty response from Groq`))
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
        Sentry.captureException(new Error(`JSON repair failed`))
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
      Sentry.captureException(new Error(`Invalid JSON structure`))
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
    Sentry.captureException(err)
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 },
    )
  }
}

