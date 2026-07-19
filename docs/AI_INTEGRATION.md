# Life Wrapped AI Integration Documentation

This document explains how the "Life Wrapped" application uses Google's Gemini AI to dynamically generate personalized, trendy, and unhinged copy for every slide in the wrap experience.

## 1. Overview

The core feature of Life Wrapped is its ability to take a small set of user inputs (like a short story, a purpose, an anniversary date, or a delusional habit) and spin it into a highly personalized 8-slide "Spotify Wrapped" style story. 

Instead of hardcoding text like "My Top Artists", we use Gemini to dynamically generate *everything*—from slide titles and subtitles to fake statistics, "top genres", and "global artists"—so that the entire experience feels customized to the user's specific lore.

## 2. What We Send to the AI (The Inputs)

When a user submits the form on the landing page, we collect several fields. These fields are sent to our backend endpoint (`/api/generate-wrap`) and are mapped into the prompt.

**User Inputs:**
- `purpose`: The theme of the wrap (e.g., "couple", "travel", "birthday", "life", "group").
- `userNames`: Who the wrap is about.
- `anniversaryDate` (Optional): A significant date.
- `destinationCity` (Optional): A significant location.
- `travelHours` (Optional): Time spent traveling.
- `delusionalHabit` (Optional): An inside joke or funny habit.
- `birthYear` (Optional): For birthday wraps.
- `storyParagraph`: The main source material—a paragraph written by the user detailing their lore, inside jokes, and memories.
- `photoCount`: The number of photos uploaded.

## 3. How We Send It (The System Prompt)

We format these inputs into a strict prompt template that acts as the "System Prompt" for Gemini. We use the `gemini-2.5-flash-lite` model for fast, creative text generation.

### The Persona
We instruct Gemini to act as a **"world-class creative director for a viral 'Year Wrapped' experience."** We explicitly tell it to use Gen-Z slang (slay, era, main character, unhinged, etc.) and to make the copy witty, warm, and highly shareable.

### The Prompt Structure
1. **User Profile:** A bulleted list of the extracted metadata (purpose, names, song, habit, etc.).
2. **User's Story:** The raw paragraph provided by the user. We tell Gemini to use this heavily as the "soul of the wrap".
3. **Instructions:** Strict rules on tone, personalization, and JSON structure.
4. **JSON Schema:** The exact JSON shape we expect back, complete with inline examples and hints on what each field should represent.
5. **Critical Constraints:** Strict rules on array lengths (e.g., "globalArtists MUST have exactly 5 items") to prevent the UI from breaking.

## 4. Full Prompt Example

Here is an example of the exact text sent to Gemini after a user submits the form:

```text
You are a world-class creative director for a viral "Year Wrapped" experience — think Spotify Wrapped but for someone's LIFE. Your job is to write punchy, Gen-Z, unhinged-but-heartfelt, meme-aware copy that makes every slide screenshot-worthy.

## USER PROFILE
- Purpose: Couple / Love Story
- People involved: Sarah and Mark
- Anniversary/First date: October 12th
- Destination city: Paris
- Delusional habit / inside joke: Thinking we can walk 10 miles instead of taking the metro
- Photos uploaded: 5

## USER'S STORY (use this heavily — it's the soul of the wrap)
"We survived moving in together this year. We spent way too much money on iced lattes, binge-watched reality TV until 3 AM, and somehow didn't kill each other assembling IKEA furniture. Our Paris trip was amazing except we got lost trying to find a bakery and ended up walking in circles for two hours."

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

- "globalArtists" MUST have exactly 5 items.
- "worldCitizen.artists" MUST have exactly 6 items.
- "dashboard.topArtists" MUST have exactly 5 items.
- "dashboard.topSongs" MUST have exactly 5 items.
- "dashboard.topGenres" MUST have exactly 5 items.
- Return ONLY the JSON. No markdown code fences. No explanation.
```

## 5. Full Response Example

Here is an example of what Gemini returns for the prompt above. Notice how it weaves the story of "IKEA furniture", "walking 10 miles in Paris", and "iced lattes" into the slide content:

```json
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
```

## 6. Edge Cases & Resilience

### JSON Repair
Large language models sometimes return invalid JSON (e.g., trailing commas, unescaped quotes) or wrap the JSON in markdown code blocks like \`\`\`json ... \`\`\`. 
To handle this, our backend uses a two-step repair process:
1. `extractGeminiText`: Strips away markdown code blocks and arbitrary text before or after the JSON payload.
2. `repairJson`: A lightweight regex-based function that fixes trailing commas so `JSON.parse` doesn't throw an error.

### Fallbacks
In `components/player/pages.tsx`, every component that receives an AI-generated string provides a default hardcoded fallback. This ensures that:
- If an old wrap session is loaded from the cache (before certain AI fields were added), the UI won't crash from `undefined` values.
- If Gemini hallucinates or misses a specific field in its response, the page still renders perfectly with generic text (e.g., `ai.worldCitizen?.title || "World Citizen"`).

### Dynamic Counters
In the "World Citizen" slide, the text is meant to contain a dynamic counting animation for the number of countries. We instruct Gemini to include the literal string `{count}` in its output for `worldCitizen.description2`. On the frontend, we split the string by `{count}` and inject a Framer Motion React component in its place, preserving the animated effect while keeping the text around it fully AI-generated.
