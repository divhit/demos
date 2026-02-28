"use client";

import { useState, useCallback, useRef } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import { DriftMap } from "@/components/DriftMap";
import { SearchBar } from "@/components/SearchBar";
import { VibePulse } from "@/components/VibePulse";
import { ResultsPanel } from "@/components/ResultsPanel";
import { PlaceDetail } from "@/components/PlaceDetail";
import type {
  DriftUIState,
  DriftPlace,
  DriftEvent,
  VibeInterpretation,
  DriftPlaceUpdate,
} from "@/lib/types";

export default function DriftPage() {
  const [uiState, setUIState] = useState<DriftUIState>("idle");
  const [interpretation, setInterpretation] =
    useState<VibeInterpretation | null>(null);
  const [places, setPlaces] = useState<DriftPlace[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<DriftPlace | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [events, setEvents] = useState<DriftEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const getUserLocation = useCallback((): Promise<{
    lat: number;
    lng: number;
  }> => {
    if (userLocation) return Promise.resolve(userLocation);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          resolve(loc);
        },
        () => {
          const fallback = { lat: 49.2827, lng: -123.1207 };
          setUserLocation(fallback);
          resolve(fallback);
        }
      );
    });
  }, [userLocation]);

  const handleSearch = useCallback(
    async (query: string) => {
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;

      setUIState("interpreting");
      setPlaces([]);
      setEvents([]);
      setInterpretation(null);
      setSelectedPlace(null);
      setError(null);

      try {
        const location = await getUserLocation();

        const res = await fetch("/api/drift", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query,
            latitude: location.lat,
            longitude: location.lng,
          }),
          signal: ac.signal,
        });

        if (!res.ok || !res.body) throw new Error("Search failed");

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          // SSE events are delimited by double newlines
          const parts = buffer.split("\n\n");
          buffer = parts.pop() ?? "";

          for (const part of parts) {
            const lines = part.split("\n");
            let eventType = "";
            let dataStr = "";

            for (const line of lines) {
              if (line.startsWith("event: ")) {
                eventType = line.slice(7).trim();
              } else if (line.startsWith("data: ")) {
                dataStr += line.slice(6);
              }
            }

            if (!eventType || !dataStr) continue;

            const data = JSON.parse(dataStr);

            switch (eventType) {
              case "interpreting":
                setInterpretation(data as VibeInterpretation);
                setUIState("searching");
                break;
              case "searching":
                setPlaces(data as DriftPlace[]);
                setUIState("analyzing");
                break;
              case "analyzing": {
                const update = data as DriftPlaceUpdate;
                setPlaces((prev) =>
                  prev.map((p) =>
                    p.id === update.placeId
                      ? { ...p, vibeAnalysis: update.vibeAnalysis }
                      : p
                  )
                );
                break;
              }
              case "events":
                setEvents(data as DriftEvent[]);
                break;
              case "complete":
                setUIState("results");
                break;
              case "error":
                setError(data.message);
                setUIState("idle");
                break;
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError((err as Error).message);
          setUIState("idle");
        }
      }
    },
    [getUserLocation]
  );

  const sortedPlaces = [...places].sort(
    (a, b) =>
      (b.vibeAnalysis?.vibe_score ?? 0) - (a.vibeAnalysis?.vibe_score ?? 0)
  );

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="relative h-dvh w-full overflow-hidden">
        <DriftMap
          places={places}
          selectedPlace={selectedPlace}
          onSelectPlace={setSelectedPlace}
          userLocation={userLocation}
          moodColor={interpretation?.mood_color}
        />

        <SearchBar
          onSearch={handleSearch}
          uiState={uiState}
          vibeSummary={interpretation?.vibe_summary}
        />

        {(uiState === "interpreting" ||
          uiState === "searching" ||
          uiState === "analyzing") && (
          <VibePulse
            phase={uiState}
            moodColor={interpretation?.mood_color ?? "#8B5E34"}
          />
        )}

        {places.length > 0 && (
          <ResultsPanel
            places={sortedPlaces}
            selectedPlace={selectedPlace}
            onSelectPlace={setSelectedPlace}
            uiState={uiState}
            events={events}
            moodColor={interpretation?.mood_color}
          />
        )}

        {selectedPlace && (
          <PlaceDetail
            place={selectedPlace}
            onClose={() => setSelectedPlace(null)}
            moodColor={interpretation?.mood_color}
            events={events}
          />
        )}

        {error && (
          <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-red-500/90 px-6 py-3 text-sm text-white backdrop-blur-sm">
            {error}
            <button
              onClick={() => setError(null)}
              className="ml-3 text-white/70 hover:text-white"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </APIProvider>
  );
}
