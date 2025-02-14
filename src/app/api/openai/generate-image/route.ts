import { NextResponse } from "next/server";
import OpenAI from "openai";

// Configure route segment config for Vercel
export const runtime = 'edge'; // Use Edge Runtime
export const maxDuration = 60; // Set maximum duration to 60 seconds

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 30000, // 30 second timeout for API calls
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "OpenAI API key not configured" },
      { status: 500 }
    );
  }

  try {
    const { prompt, size = "1024x1024", quality = "standard", style = "vivid" } = await request.json();

    // Generate images sequentially with timeout handling
    const images = [];
    for (let i = 0; i < 4; i++) {
      try {
        const response = await openai.images.generate({
          model: "dall-e-3",
          prompt,
          n: 1,
          size: size as "1024x1024" | "1792x1024" | "1024x1792",
          quality: quality as "standard" | "hd",
          style: style as "vivid" | "natural",
        });
        if (response.data[0].url) {
          images.push(response.data[0].url);
        }
      } catch (error) {
        console.error(`Error generating image ${i + 1}:`, error);
        // Continue with remaining images if one fails
        continue;
      }
    }

    if (images.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate any images" },
        { status: 500 }
      );
    }

    return NextResponse.json({ output: images });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
} 