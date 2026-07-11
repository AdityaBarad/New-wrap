import { NextRequest, NextResponse } from "next/server"

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent"

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
    couple: "Love Story / Relationship",
    travel: "Travel Adventures",
    birthday: "Birthday Special",
    life: "Personal Life Journey",
    group: "Group Chat Chaos",
  }

  const purposeLabel = purposeLabels[(purpose as string) ?? "life"] ?? "Personal Life Journey"

  return `You are a world class creative UI builder and copywriter for a viral "Year Wrapped" web app experience. Your job is to generate a completely unique, personalized sequence of 6 to 8 slides that tell the user's specific story in a highly shareable, Gen-Z, unhinged-but-heartfelt way.

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

## USER'S STORY (use this heavily to determine the slides and content)
"${storyParagraph || "No story provided — improvise based on the profile above."}"

## INSTRUCTIONS
You must return a JSON object with a single root property: "slides".
The "slides" array should contain 6 to 8 slide objects. Choose the sequence and types of slides that best tell their story.
For example, a "couple" might get an intro, a thread (texting), a polaroid, a radar chart (compatibility), and a finale. A "group" might get a roast, a versus board, a receipt, etc.
Always start with an "intro" slide and end with a "finale" slide.

**CRITICAL PHRASING RULES**:
- If Purpose is "Love Story / Relationship", the entire wrap MUST use relational phrasing: "moments together", "our era", "songs we loved", "chats with each other". If the partner's name isn't provided, refer to them as "your partner" or use "Your Love Story". Do NOT just say "User's wrap".
- If Purpose is "Group Chat Chaos", use group phrasing: "the squad", "our group chat", "messages we sent".
- Metrics and labels must reflect this context (e.g., "Hours spent together" instead of "Time on the clock").

Available slide types and their content schemas:

1. "intro": { "kicker": "1-3 words", "lines": ["Word1", "Word2", "Word3"], "sub": "1-2 sentence subtitle" } (MUST have exactly 3 words in 'lines')
2. "dataHighlight": { "kicker": "short label", "label": "what the number is", "note": "funny observation", "valueOverride": 1234 }
3. "topTrack": { "kicker": "label", "artistLine": "creative description", "anthemTitleOverride": "song name" }
4. "receipts": { "title": "receipt title", "rows": [{ "label": "metric", "value": "stat" }] } (MUST have exactly 4 rows)
5. "versus": { "kicker": "label", "left": "name 1", "right": "name 2", "leagueTitle": "funny title" }
6. "versusBoard": { "kicker": "label", "title": "board title", "games": [{ "team1": "A", "team2": "B", "competition": "context" }] } (MUST have exactly 4 games)
7. "dashboard": { "topArtists": ["1","2","3"], "topSongs": ["1","2","3"], "topGenre": "genre" } (MUST have exactly 3 artists and 3 songs)
8. "finale": { "tagline": "epic 1-sentence farewell" }
9. "thread": { "kicker": "label", "messages": [{ "sender": "me"|"them", "text": "msg" }], "footerNote": "funny note" }
10. "radar": { "title": "radar title", "traits": [{ "label": "Trait 1", "value": 85 }], "verdict": "short verdict" } (MUST have 3-5 traits with values 0-100)
11. "quote": { "quote": "unhinged quote from their year", "author": "- someone" }
12. "polaroid": { "kicker": "label", "captions": ["Caption 1", "Caption 2"] }
13. "roast": { "title": "The Roast", "roastLines": ["Line 1", "Line 2", "Line 3"] }
14. "award": { "awardName": "The Award", "recipientCategory": "Category", "reason": "Why they won" }

Every slide object must also have a "design" object:
"design": { "bg": "green"|"pink"|"yellow"|"ink"|"purple"|"orange", "ink": "...", "accent": "...", "layout": "split-left"|"split-right"|"centered"|"stacked", "bgPattern": "halftone"|"grid"|"dots"|"gradient"|"noise"|"clean", "decoration": "cubes"|"circles"|"stars"|"lines"|"none", "typoStyle": "massive"|"elegant"|"rotated"|"outlined" }

DESIGN RULES:
- bg and ink MUST be different colors. "ink" is a dark/black color.
- If bg is "ink" (dark), ink text should be a bright color (green/pink/yellow/purple/orange).
- If bg is a bright color, ink text should be "ink" (dark).
- Vary the layouts, patterns, and typography styles heavily across the slides so every slide feels completely new!

Return ONLY the JSON. No markdown code fences. No explanation.
Example structure:
{
  "slides": [
    { "type": "intro", "design": { "bg": "green", "ink": "ink", "accent": "pink", "layout": "split-left", "bgPattern": "noise", "decoration": "none", "typoStyle": "massive" }, "content": { "kicker": "...", "lines": ["a", "b", "c"], "sub": "..." } },
    { "type": "roast", "design": { ... }, "content": { "title": "...", "roastLines": [...] } }
  ]
}
`
}

/** Attempt to repair truncated JSON by closing open structures */
function repairJson(raw: string): string {
  let s = raw.trim()
  s = s.replace(/,\\s*$/, "")

  let braces = 0
  let brackets = 0
  let inString = false
  let escape = false

  for (const ch of s) {
    if (escape) { escape = false; continue }
    if (ch === "\\\\") { escape = true; continue }
    if (ch === '"') { inString = !inString; continue }
    if (inString) continue
    if (ch === "{") braces++
    else if (ch === "}") braces--
    else if (ch === "[") brackets++
    else if (ch === "]") brackets--
  }

  if (inString) s += '"'
  while (brackets > 0) { s += "]"; brackets-- }
  while (braces > 0) { s += "}"; braces-- }
  return s
}

/** Extract the actual text content from Gemini response */
function extractGeminiText(response: Record<string, unknown>): string {
  const parts = (response as any)?.candidates?.[0]?.content?.parts
  if (!Array.isArray(parts) || parts.length === 0) return ""
  for (let i = parts.length - 1; i >= 0; i--) {
    if (parts[i].text !== undefined && !parts[i].thought) {
      return parts[i].text
    }
  }
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
      return NextResponse.json({ error: "GEMINI_API_KEY not configured" }, { status: 500 })
    }

    const body = await req.json()
    const prompt = buildPrompt(body)

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 45000) // 45s timeout

    const res = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
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
      return NextResponse.json({ error: `Gemini API returned ${res.status}` }, { status: 502 })
    }

    const geminiResponse = await res.json()
    const rawText = extractGeminiText(geminiResponse)

    if (!rawText) {
      return NextResponse.json({ error: "Empty response from AI" }, { status: 502 })
    }

    let cleaned = rawText.trim()
    if (cleaned.startsWith("```")) {
      cleaned = cleaned.replace(/^```(?:json)?\\s*/, "").replace(/\\s*```$/, "")
    }

    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(cleaned)
    } catch {
      try {
        const repaired = repairJson(cleaned)
        parsed = JSON.parse(repaired)
      } catch (e2) {
        return NextResponse.json({ error: "AI returned malformed JSON" }, { status: 502 })
      }
    }

    if (!parsed.slides || !Array.isArray(parsed.slides)) {
      console.error("[generate-wrap] Invalid JSON structure. Missing slides array.")
      return NextResponse.json({ error: "AI returned invalid structure" }, { status: 502 })
    }

    return NextResponse.json({ content: parsed })
  } catch (err) {
    if (err instanceof Error && err.name === "AbortError") {
      return NextResponse.json({ error: "AI generation timed out" }, { status: 504 })
    }
    console.error("[generate-wrap] Unexpected error:", err)
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
