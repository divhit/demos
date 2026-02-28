"use client";

import type { DriftUIState } from "@/lib/types";

interface VibePulseProps {
  phase: DriftUIState;
  moodColor: string;
}

const PHASE_MESSAGES: Record<string, string> = {
  interpreting: "Understanding your vibe...",
  searching: "Finding places that match...",
  analyzing: "Analyzing the atmosphere...",
};

export function VibePulse({ phase, moodColor }: VibePulseProps) {
  return (
    <div className="fixed left-1/2 top-28 z-10 -translate-x-1/2">
      <div className="flex flex-col items-center gap-3">
        <div className="relative h-12 w-12">
          <div
            className="absolute inset-0 animate-ping rounded-full opacity-20"
            style={{ backgroundColor: moodColor }}
          />
          <div
            className="absolute inset-2 animate-pulse rounded-full opacity-40"
            style={{ backgroundColor: moodColor }}
          />
          <div
            className="absolute inset-4 rounded-full"
            style={{ backgroundColor: moodColor }}
          />
        </div>
        <p className="text-sm font-medium text-white/70">
          {PHASE_MESSAGES[phase] ?? ""}
        </p>
      </div>
    </div>
  );
}
