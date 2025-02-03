import { config } from "@/lib/config";
import { NextResponse } from "next/server";

// Add type for the expected request body
interface ChatRequest {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
  }>;
}

// Add lead source types with more specific details
const LEAD_SOURCES = {
  TV: {
    source: "TV commercial about final expense insurance",
    context:
      "Just saw your commercial during my favorite show about protecting my family",
    commonPhrases: [
      "saw your commercial on TV",
      "watching the news when I saw your ad",
      "commercial about funeral costs",
    ],
    commonObjections: [
      "need to discuss with my children first",
      "living on a fixed income",
      "already have some insurance through AARP",
    ],
  },
  ONLINE: {
    source: "Online advertisement about final expense coverage",
    context: "Saw your ad while checking my email/news",
    commonPhrases: [
      "clicked on your website ad",
      "saw your online advertisement",
      "reading news when I saw your ad",
    ],
  },
  FACEBOOK: {
    source: "Facebook ad about protecting your family",
    context:
      "Scrolling through Facebook when I saw your ad about final expense",
    commonPhrases: [
      "saw your Facebook post",
      "your ad appeared on my Facebook",
      "looking at pictures of my grandkids when I saw your ad",
    ],
  },
  YOUTUBE: {
    source: "YouTube ad about funeral cost coverage",
    context: "Watching videos when I saw your advertisement",
    commonPhrases: [
      "your video ad on YouTube",
      "watching videos when I saw your commercial",
      "ad about funeral expenses",
    ],
  },
} as const;

// Cache uncertainty markers
const UNCERTAINTY_MARKERS = new Set([
  "um",
  "uh",
  "like",
  "maybe",
  "i think",
  "sort of",
  "kind of",
  "possibly",
  "probably",
  "i guess",
  "not sure",
  "might",
]);

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": config.anthropic.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-sonnet-20240229",
        messages: messages,
        max_tokens: 1024,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      content: data.content[0].text,
      error: null,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}
