"use client";

import type { DriftPlace } from "@/lib/types";

interface PlaceCardProps {
  place: DriftPlace;
  isSelected: boolean;
  onClick: () => void;
  compact?: boolean;
}

export function PlaceCard({
  place,
  isSelected,
  onClick,
  compact = false,
}: PlaceCardProps) {
  const score = place.vibeAnalysis?.vibe_score;
  const analyzing = !!place.photoName && !place.vibeAnalysis;

  const scoreColor =
    score === undefined
      ? "text-white/40"
      : score >= 70
        ? "text-green-400"
        : score >= 45
          ? "text-amber-400"
          : "text-slate-400";

  return (
    <button
      onClick={onClick}
      className={`group w-full text-left rounded-2xl border transition-all duration-200 ${
        isSelected
          ? "border-white/30 bg-white/15"
          : "border-white/5 bg-white/5 hover:border-white/15 hover:bg-white/10"
      } ${compact ? "p-3" : "p-4"}`}
    >
      <div className="flex gap-3">
        {place.photoUri && (
          <div
            className={`relative shrink-0 overflow-hidden rounded-xl ${compact ? "h-16 w-16" : "h-20 w-20"}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.photoUri}
              alt={place.name}
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`truncate font-semibold text-white font-[family-name:var(--font-display)] ${compact ? "text-sm" : "text-base"}`}
            >
              {place.name}
            </h3>
            <div className={`shrink-0 ${scoreColor}`}>
              {analyzing ? (
                <div className="h-5 w-8 animate-pulse rounded bg-white/10" />
              ) : score !== undefined ? (
                <span className="text-lg font-bold">{score}</span>
              ) : null}
            </div>
          </div>

          {place.rating && (
            <p className="text-xs text-white/40">
              {place.rating} stars
              {place.userRatingCount ? ` (${place.userRatingCount})` : ""}
            </p>
          )}

          {place.vibeAnalysis?.vibe_description && !compact && (
            <p className="mt-1.5 line-clamp-2 text-sm leading-snug text-white/60">
              {place.vibeAnalysis.vibe_description}
            </p>
          )}

          {place.vibeAnalysis?.standout_detail && compact && (
            <p className="mt-1 truncate text-xs text-white/50">
              {place.vibeAnalysis.standout_detail}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}
