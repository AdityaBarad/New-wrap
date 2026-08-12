import { NextRequest, NextResponse } from "next/server"
import * as Sentry from "@sentry/nextjs"

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 },
      )
    }

    const accountId = process.env.CLOUDFLARE_ACCOUNT_ID
    const apiToken = process.env.CLOUDFLARE_API_TOKEN

    // Try Cloudflare first if credentials exist
    if (accountId && apiToken) {
      try {
        const res = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/run/@cf/stabilityai/stable-diffusion-xl-base-1.0`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt }),
          }
        )

        if (res.ok) {
          const imageBuffer = await res.arrayBuffer()
          return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
              "Content-Type": "image/png",
              "Cache-Control": "public, max-age=31536000",
            },
          })
        } else {
          const errText = await res.text()
          console.warn("[generate-image] Cloudflare API failed, falling back to pollinations...", res.status, errText)
        }
      } catch (cfErr) {
        console.warn("[generate-image] Cloudflare request failed, falling back to pollinations...", cfErr)
      }
    }

    // Fallback to Pollinations.ai (Free, no keys required)
    console.log("[generate-image] Using Pollinations.ai fallback for prompt:", prompt)
    const encodedPrompt = encodeURIComponent(prompt)
    const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=768&nologo=true`
    
    const fallbackRes = await fetch(pollinationsUrl)
    
    if (!fallbackRes.ok) {
      throw new Error(`Pollinations API returned ${fallbackRes.status}`)
    }

    const fallbackBuffer = await fallbackRes.arrayBuffer()

    return new NextResponse(fallbackBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    })

  } catch (err) {
    console.error("[generate-image] Unexpected error:", err)
    Sentry.captureException(err)
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 },
    )
  }
}
