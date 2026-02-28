import { NextRequest } from "next/server";
import { interpretVibe, analyzePhoto, findEvents } from "@/lib/gemini";
import {
  searchPlaces,
  fetchPhotoAsBase64,
  getPhotoDisplayUrl,
} from "@/lib/places";
import type { DriftRequest, DriftPlace, DriftPlaceUpdate } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

function sse(type: string, data: unknown): string {
  return `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  const body: DriftRequest = await request.json();
  const { query, latitude, longitude, radius = 5000 } = body;

  if (!query || !latitude || !longitude) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const stream = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (type: string, data: unknown) =>
        controller.enqueue(enc.encode(sse(type, data)));

      try {
        // Phase 1: Interpret vibe
        const interpretation = await interpretVibe(query);
        send("interpreting", interpretation);

        // Phase 2: Search places
        const allPlaces: DriftPlace[] = [];
        const seen = new Set<string>();

        const queries = interpretation.search_queries.slice(0, 3);
        const results = await Promise.all(
          queries.map((q) => searchPlaces(q, latitude, longitude, radius))
        );

        for (const batch of results) {
          for (const place of batch) {
            if (!seen.has(place.id) && allPlaces.length < 12) {
              seen.add(place.id);
              if (place.photoName) {
                place.photoUri = getPhotoDisplayUrl(place.photoName);
              }
              allPlaces.push(place);
            }
          }
        }

        send("searching", allPlaces);

        // Phase 3: Analyze photos
        const withPhotos = allPlaces.filter((p) => p.photoName);
        const BATCH = 4;

        for (let i = 0; i < withPhotos.length; i += BATCH) {
          const batch = withPhotos.slice(i, i + BATCH);
          await Promise.all(
            batch.map(async (place) => {
              try {
                const { base64, mimeType } = await fetchPhotoAsBase64(
                  place.photoName!,
                  400
                );
                const analysis = await analyzePhoto(
                  base64,
                  mimeType,
                  interpretation.vibe_attributes,
                  interpretation.vibe_summary
                );
                const update: DriftPlaceUpdate = {
                  placeId: place.id,
                  vibeAnalysis: analysis,
                };
                send("analyzing", update);
              } catch (err) {
                console.error(`Analysis failed for ${place.id}:`, err);
              }
            })
          );
        }

        // Phase 4: Find live events via Google Search Grounding
        try {
          const placeNames = allPlaces.map((p) => p.name);
          const events = await findEvents(
            interpretation.vibe_summary,
            placeNames,
            latitude,
            longitude
          );
          if (events.length > 0) {
            send("events", events);
          }
        } catch (err) {
          console.error("Events search failed:", err);
        }

        send("complete", { totalPlaces: allPlaces.length });
      } catch (error) {
        send("error", {
          message:
            error instanceof Error ? error.message : "Something went wrong",
          phase: "interpreting",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
