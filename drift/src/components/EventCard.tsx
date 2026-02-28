"use client";

import type { DriftEvent } from "@/lib/types";

interface EventCardProps {
  event: DriftEvent;
  moodColor?: string;
}

export function EventCard({ event, moodColor = "#8B5E34" }: EventCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-1 flex items-start justify-between gap-2">
        <h3 className="font-semibold text-white font-[family-name:var(--font-display)] text-sm">
          {event.name}
        </h3>
      </div>
      <p className="text-xs text-white/50">{event.venue}</p>
      <p
        className="mt-1 text-xs font-medium"
        style={{ color: moodColor }}
      >
        {event.date}
      </p>
      <p className="mt-2 text-sm leading-snug text-white/60 line-clamp-2">
        {event.description}
      </p>
      {event.url && (
        <a
          href={event.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-center text-xs font-medium text-white transition-colors"
          style={{ backgroundColor: `${moodColor}35` }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
            <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
          </svg>
          {event.source ? `View on ${event.source}` : "View event details"}
        </a>
      )}
    </div>
  );
}
