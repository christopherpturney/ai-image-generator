import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

    // Generate 4 images in parallel using DALL-E 3
    const imagePromises = Array(4).fill(null).map(() =>
      openai.images.generate({
        model: "dall-e-3",
        prompt,
        n: 1,
        size: size as "1024x1024" | "1792x1024" | "1024x1792",
        quality: quality as "standard" | "hd",
        style: style as "vivid" | "natural",
      })
    );

    const responses = await Promise.all(imagePromises);
    
    // Extract URLs from responses
    const images = responses.map(response => response.data[0].url);

    return NextResponse.json({ output: images });
  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
} 