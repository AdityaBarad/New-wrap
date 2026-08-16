import fs from 'fs';
import path from 'path';

// URL for Groq API
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

// Add any models you want to test here!
const modelsToTest = [
  // "llama-3.1-8b-instant",
  "llama-3.3-70b-versatile",
  // "meta-llama/llama-4-scout-17b-16e-instruct",
  // "qwen/qwen3-32b",
  // "moonshotai/kimi-k2-instruct",
  "openai/gpt-oss-120b",
  // "openai/gpt-oss-20b",
  // NOTE: Whisper models are for audio transcription (speech-to-text) 
  // and will return an error if used in this chat generation script!
  // "whisper-large-v3",
  // "whisper-large-v3-turbo"
];

const prompt = `You are a world-class creative director for a viral "Story Wrapped" experience — think Spotify Wrapped but for someone's STORY. Your job is to write punchy, Gen-Z, unhinged-but-heartfelt, meme-aware copy that makes every slide screenshot-worthy.

## USER PROFILE
- **Purpose**: Couple / Love Story
- **People involved**: sam
- **Photos uploaded**: 0

## USER'S STORY (THIS IS THE MOST IMPORTANT INPUT — USE EVERY SINGLE DETAIL)
"One year together and somehow “Sharma ji” still hasn’t learned to eat on time.

Her love language is reminding me to eat. My love language is pretending I didn’t hear her.

I call her Chashmish. She calls me Sharma ji. Somehow both of us think we won this naming battle.

She acts like a responsible girlfriend until the smallest inconvenience happens… then my girlfriend is suddenly 5 years old.

I roast her for being short. She gets offended. I call her Bauni. She gets more offended. I continue anyway.

She’s the designated responsible adult in this relationship. Unfortunately, she’s also the one who acts like a kid.

We can spend hours planning where to eat, only to end up at the same place we always go.  

Travelling together is basically 20% exploring and 80% roasting each other in different locations.

“Sharma ji, khana kha liya?” is basically her daily attendance call.

She can be mad at me and still somehow remember that I haven’t eaten yet. Priorities.     

Our relationship is 50% eating, 30% travelling, and 20% me getting bullied for absolutely no reason.

I make fun of her height so much that at this point, Bauni might actually be her legal name.

She acts cute, I roast her. She gets annoyed, I roast her more. This is apparently our version of romance.

We’re the kind of couple who can turn a normal meal into a full-blown comedy show.        

One year later, still my favourite person to eat with, travel with, and annoy for the rest of my life."

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
    "kicker": "2-4 word label for the big number slide — Frame it around a fun made-up stat.",
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
- Return ONLY the JSON. No markdown code fences. No explanation.`;

async function testModel(model) {
  // Load API key from environment
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing GROQ_API_KEY.");
    console.error("Run this script with: node --env-file=.env.local test-models.mjs");
    process.exit(1);
  }

  console.log(`\n==========================================`);
  console.log(`🤖 Testing model: ${model}`);
  console.log(`==========================================`);

  const startTime = Date.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 180000); // 3-minute timeout for slow models

    let seconds = 0;
    const loadingInterval = setInterval(() => {
      seconds += 5;
      process.stdout.write(`\r⏳ Still waiting for ${model}... (${seconds}s elapsed)`);
    }, 5000);

    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      signal: controller.signal,
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: 1.0,
        max_tokens: 5000,
        // Tell reasoning models (like gpt-oss) to think less and just output the answer.
        // This drastically reduces the hidden "thinking" tokens that eat your budget!
        reasoning_effort: "low"
      }),
    });

    clearInterval(loadingInterval);
    clearTimeout(timeoutId);
    console.log(); // Print newline after loading indicator

    const data = await res.json();
    const timeTaken = Date.now() - startTime;

    if (!res.ok) {
      console.error(`[Error] HTTP ${res.status}: `, JSON.stringify(data, null, 2));
      return;
    }

    const text = data?.choices?.[0]?.message?.content || "";
    const finishReason = data?.choices?.[0]?.finish_reason || "unknown";
    const usage = data?.usage || {};

    // ===== TOKEN MATH (Beginner Friendly!) =====
    const promptTokens = usage.prompt_tokens || 0;       // How many tokens YOUR PROMPT used
    const completionTokens = usage.completion_tokens || 0; // How many tokens the AI WROTE BACK
    const totalTokens = usage.total_tokens || 0;           // prompt + completion = total
    const maxTokensRequested = 5000;                       // What we asked for in max_tokens

    console.log(`\n⏱️  Time taken: ${timeTaken}ms`);
    console.log(`📏 Output length: ${text.length} characters`);
    console.log(``);
    console.log(`📊 ===== TOKEN BREAKDOWN =====`);
    console.log(`   📤 Prompt tokens (what you SENT):      ${promptTokens}`);
    console.log(`   📥 Completion tokens (AI's RESPONSE):  ${completionTokens}`);
    console.log(`   📦 Total tokens used:                  ${totalTokens} (${promptTokens} + ${completionTokens})`);
    console.log(`   🎯 max_tokens we requested:            ${maxTokensRequested}`);
    console.log(`   🏁 Finish reason:                      ${finishReason}`);

    if (finishReason === "length") {
      console.log(`   ⚠️  OUTPUT WAS CUT OFF! The AI ran out of tokens before finishing.`);
      console.log(`      → The AI used all ${completionTokens} completion tokens and still wasn't done.`);
      console.log(`      → Fix: Increase max_tokens (but watch your Groq free tier TPM limit!)`);
    } else if (finishReason === "stop") {
      console.log(`   ✅ AI finished naturally (it had enough tokens to complete the full response).`);
    }

    console.log(`   💡 Groq Free Tier TPM Limit: ~6,000-8,000 tokens/minute`);
    console.log(`      Your request used ${totalTokens} of that budget.`);
    console.log(`   =============================\n`);

    // Save to a file for easy viewing
    const filename = `test-result-${model.replace(/[:/]/g, '-')}.json`;

    // Cleanup any markdown fences from the output before saving
    let cleaned = text.trim();
    if (cleaned.startsWith("\`\`\`")) {
      cleaned = cleaned.replace(/^\`\`\`(?:json)?\s*/, "").replace(/\s*\`\`\`$/, "");
    }

    fs.writeFileSync(filename, cleaned);
    console.log(`💾 Saved output to ${filename}`);

    // Test if JSON is valid
    try {
      JSON.parse(cleaned);
      console.log("✅ JSON is perfectly valid!");
    } catch (e) {
      console.log("❌ JSON is INVALID:", e.message);
    }

  } catch (error) {
    console.error(`Failed to test ${model}:`, error);
  }
}

async function runTests() {
  console.log("🚀 Starting AI Model Tests...");
  for (const model of modelsToTest) {
    await testModel(model);
  }
  console.log("\n✨ All tests completed! Check the generated test-result-*.json files.");
}

runTests();
