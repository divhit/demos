"use client";

import { useEffect, useMemo } from "react";
import { EventCard } from "./EventCard";
import type { DriftPlace, DriftEvent } from "@/lib/types";

interface PlaceDetailProps {
  place: DriftPlace;
  onClose: () => void;
  moodColor?: string;
  events?: DriftEvent[];
}

function matchesVenue(event: DriftEvent, placeName: string): boolean {
  const eName = event.venue.toLowerCase();
  const pName = placeName.toLowerCase();
  // Match if either contains the other, or if they share a significant word (3+ chars)
  if (eName.includes(pName) || pName.includes(eName)) return true;
  const pWords = pName.split(/\s+/).filter((w) => w.length >= 3);
  return pWords.some((w) => eName.includes(w));
}

export function PlaceDetail({
  place,
  onClose,
  moodColor = "#8B5E34",
  events = [],
}: PlaceDetailProps) {
  const venueEvents = useMemo(
    () => events.filter((e) => matchesVenue(e, place.name)),
    [events, place.name]
  );
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const score = place.vibeAnalysis?.vibe_score;
  const scoreColor =
    score === undefined
      ? "white"
      : score >= 70
        ? "#22c55e"
        : score >= 45
          ? "#f59e0b"
          : "#94a3b8";

  const priceLabel = place.priceLevel
    ?.replace("PRICE_LEVEL_", "")
    .toLowerCase();

  return (
    <>
      <div
        className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="fixed inset-x-4 bottom-4 top-auto z-40 max-h-[80dvh] overflow-y-auto rounded-3xl bg-gray-900/95 p-6 shadow-2xl backdrop-blur-xl md:inset-auto md:right-8 md:top-1/2 md:w-[420px] md:-translate-y-1/2">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white/60 hover:bg-white/20 hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Photo */}
        {place.photoUri && (
          <div className="mb-4 overflow-hidden rounded-2xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.photoUri}
              alt={place.name}
              className="h-48 w-full object-cover md:h-56"
            />
          </div>
        )}

        {/* Name + Score */}
        <div className="mb-3 flex items-start justify-between">
          <h2 className="text-xl font-bold text-white font-[family-name:var(--font-display)]">
            {place.name}
          </h2>
          {score !== undefined && (
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
              style={{
                backgroundColor: `${scoreColor}30`,
                color: scoreColor,
              }}
            >
              {score}
            </div>
          )}
        </div>

        <p className="mb-4 text-sm text-white/50">{place.address}</p>

        {/* Vibe analysis */}
        {place.vibeAnalysis && (
          <div className="mb-4 rounded-xl bg-white/5 p-4">
            <p className="mb-2 text-sm leading-relaxed text-white/80">
              {place.vibeAnalysis.vibe_description}
            </p>
            {place.vibeAnalysis.standout_detail && (
              <p className="text-sm italic text-white/50">
                &ldquo;{place.vibeAnalysis.standout_detail}&rdquo;
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-1.5">
              {place.vibeAnalysis.matching_elements.map((el, i) => (
                <span
                  key={i}
                  className="rounded-full px-2.5 py-0.5 text-xs text-white/70"
                  style={{ backgroundColor: `${moodColor}25` }}
                >
                  {el}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap gap-3 text-sm text-white/50">
          {place.rating && (
            <span>
              {place.rating} stars
              {place.userRatingCount ? ` (${place.userRatingCount})` : ""}
            </span>
          )}
          {priceLabel && <span>{priceLabel}</span>}
        </div>

        {/* Events at this venue */}
        {venueEvents.length > 0 && (
          <div className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-white/50">
              Happening Here
            </h3>
            <div className="flex flex-col gap-2">
              {venueEvents.map((event, i) => (
                <EventCard key={i} event={event} moodColor={moodColor} />
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-5 flex gap-3">
          {place.websiteUri && (
            <a
              href={place.websiteUri}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded-xl bg-white/10 py-3 text-center text-sm font-medium text-white hover:bg-white/20"
            >
              Website
            </a>
          )}
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${place.location.latitude},${place.location.longitude}&destination_place_id=${place.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 rounded-xl py-3 text-center text-sm font-medium text-white hover:opacity-90"
            style={{ backgroundColor: `${moodColor}aa` }}
          >
            Get Directions
          </a>
        </div>
      </div>
    </>
  );
}
