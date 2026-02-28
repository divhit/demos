"use client";

import { PlaceCard } from "./PlaceCard";
import { EventCard } from "./EventCard";
import type { DriftPlace, DriftEvent, DriftUIState } from "@/lib/types";

interface ResultsPanelProps {
  places: DriftPlace[];
  selectedPlace: DriftPlace | null;
  onSelectPlace: (place: DriftPlace) => void;
  uiState: DriftUIState;
  events?: DriftEvent[];
  moodColor?: string;
}

export function ResultsPanel({
  places,
  selectedPlace,
  onSelectPlace,
  uiState,
  events = [],
  moodColor,
}: ResultsPanelProps) {
  const loaded = uiState === "results";

  return (
    <>
      {/* Desktop: right panel */}
      <div
        className={`fixed right-0 top-0 z-10 hidden h-full w-96 transform transition-transform duration-500 ease-out md:block ${
          places.length > 0 ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full overflow-y-auto bg-black/60 p-4 pt-6 backdrop-blur-xl">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-medium uppercase tracking-wider text-white/50">
              {loaded
                ? `${places.length} places found`
                : "Finding vibes..."}
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            {places.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                isSelected={selectedPlace?.id === place.id}
                onClick={() => onSelectPlace(place)}
              />
            ))}
          </div>

          {events.length > 0 && (
            <div className="mt-6">
              <h2 className="mb-3 text-sm font-medium uppercase tracking-wider text-white/50">
                What&apos;s Happening
              </h2>
              <div className="flex flex-col gap-3">
                {events.map((event, i) => (
                  <EventCard key={i} event={event} moodColor={moodColor} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile: bottom sheet */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-10 transform transition-transform duration-500 ease-out md:hidden ${
          places.length > 0 ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="max-h-[45dvh] overflow-y-auto rounded-t-3xl bg-black/70 p-4 pt-2 backdrop-blur-xl">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/20" />
          <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2">
            {places.map((place) => (
              <div key={place.id} className="min-w-[280px] snap-start">
                <PlaceCard
                  place={place}
                  isSelected={selectedPlace?.id === place.id}
                  onClick={() => onSelectPlace(place)}
                  compact
                />
              </div>
            ))}
          </div>

          {events.length > 0 && (
            <div className="mt-2 border-t border-white/10 pt-3">
              <h2 className="mb-2 text-xs font-medium uppercase tracking-wider text-white/50">
                What&apos;s Happening
              </h2>
              <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-4">
                {events.map((event, i) => (
                  <div key={i} className="min-w-[260px] snap-start">
                    <EventCard event={event} moodColor={moodColor} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
