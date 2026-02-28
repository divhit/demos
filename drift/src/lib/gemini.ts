import { GoogleGenAI } from "@google/genai";
import type { VibeInterpretation, PhotoAnalysis, DriftEvent } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const VIBE_SCHEMA = {
  type: "object" as const,
  properties: {
    search_queries: {
      type: "array" as const,
      items: { type: "string" as const },
    },
    place_types: {
      type: "array" as const,
      items: { type: "string" as const },
    },
    vibe_attributes: {
      type: "array" as const,
      items: { type: "string" as const },
    },
    vibe_summary: { type: "string" as const },
    mood_color: { type: "string" as const },
  },
  required: [
    "search_queries",
    "place_types",
    "vibe_attributes",
    "vibe_summary",
    "mood_color",
  ],
};

const PHOTO_SCHEMA = {
  type: "object" as const,
  properties: {
    vibe_score: { type: "number" as const },
    matching_elements: {
      type: "array" as const,
      items: { type: "string" as const },
    },
    vibe_description: { type: "string" as const },
    standout_detail: { type: "string" as const },
  },
  required: [
    "vibe_score",
    "matching_elements",
    "vibe_description",
    "standout_detail",
  ],
};

export async function interpretVibe(
  query: string
): Promise<VibeInterpretation> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      systemInstruction: `You are a place discovery AI for "Drift", the anti-Yelp.
Given a user's mood or vibe description, interpret what kinds of physical spaces would match.
Consider: atmosphere, lighting, sound level, decor style, crowd energy, and activity type.
Generate 2-4 specific search queries that would find matching places on Google Maps.
Pick place_types from: restaurant, cafe, bar, bakery, book_store, library, park, museum, art_gallery, spa, night_club, movie_theater, bowling_alley, gym, clothing_store.
For vibe_attributes, focus on VISUAL elements visible in photos.
The mood_color should be a hex color that emotionally represents the vibe (warm amber for cozy, cool blue for serene, deep red for romantic, bright green for energetic, etc.).`,
      temperature: 0.7,
      responseMimeType: "application/json",
      responseSchema: VIBE_SCHEMA,
    },
  });

  return JSON.parse(response.text ?? "{}") as VibeInterpretation;
}

export async function analyzePhoto(
  photoBase64: string,
  mimeType: string,
  vibeAttributes: string[],
  vibeSummary: string
): Promise<PhotoAnalysis> {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `Analyze this photo of a place. The user is looking for: "${vibeSummary}".
Desired vibe attributes: ${vibeAttributes.join(", ")}.
Score how well this place matches the vibe on a 0-100 scale.

Scoring guide:
- 80-100: Strong match — most vibe attributes clearly present
- 60-79: Good match — several matching elements, would satisfy the mood
- 40-59: Partial match — some elements present but missing key aspects
- 20-39: Weak match — few matching elements
- 0-19: Poor match — completely different vibe

Be generous but honest. Most real places that broadly fit the category should score 40-70. Only truly perfect matches get 80+. Focus on overall atmosphere and feeling, not just literal checklist items.`,
          },
          {
            inlineData: { mimeType, data: photoBase64 },
          },
        ],
      },
    ],
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      responseSchema: PHOTO_SCHEMA,
    },
  });

  return JSON.parse(response.text ?? "{}") as PhotoAnalysis;
}

const EVENTS_SCHEMA = {
  type: "object" as const,
  properties: {
    events: {
      type: "array" as const,
      items: {
        type: "object" as const,
        properties: {
          name: { type: "string" as const },
          venue: { type: "string" as const },
          date: { type: "string" as const },
          description: { type: "string" as const },
          url: { type: "string" as const },
          source: { type: "string" as const },
        },
        required: ["name", "venue", "date", "description"],
      },
    },
  },
  required: ["events"],
};

export async function findEvents(
  vibeSummary: string,
  placeNames: string[],
  latitude: number,
  longitude: number
): Promise<DriftEvent[]> {
  const today = new Date();
  const dateStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `Find live events, shows, performances, or special happenings this week near latitude ${latitude}, longitude ${longitude}.

The user is in the mood for: "${vibeSummary}"
They're considering visiting places like: ${placeNames.slice(0, 5).join(", ")}

Today is ${dateStr}. Find real events happening tonight, tomorrow, or this week that match this vibe. Include concerts, live music, comedy shows, art openings, food festivals, pop-ups, DJ sets, trivia nights, open mics, or any relevant happenings.

Return up to 6 events. Only include events you can verify are actually happening. Include the source URL where you found each event.`,
    config: {
      tools: [{ googleSearch: {} }],
      temperature: 0.5,
      responseMimeType: "application/json",
      responseSchema: EVENTS_SCHEMA,
    },
  });

  const parsed = JSON.parse(response.text ?? '{"events":[]}');
  return (parsed.events ?? []) as DriftEvent[];
}
