import { NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = 'edge';
export const preferredRegion = 'iad1'; // US East (N. Virginia)
export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return new NextResponse(
      JSON.stringify({ error: "OpenAI API key not configured" }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  try {
    const { prompt, size = "1024x1024", quality = "standard", style = "vivid" } = await request.json();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: size as "1024x1024" | "1792x1024" | "1024x1792",
      quality: quality as "standard" | "hd",
      style: style as "vivid" | "natural",
    });

    if (!response.data[0].url) {
      return new NextResponse(
        JSON.stringify({ error: "Failed to generate image" }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    return new NextResponse(
      JSON.stringify({ output: [response.data[0].url] }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error("Error in main handler:", error);
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 