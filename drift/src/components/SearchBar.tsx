"use client";

import { useState, useRef, useEffect } from "react";
import type { DriftUIState } from "@/lib/types";

interface SearchBarProps {
  onSearch: (query: string) => void;
  uiState: DriftUIState;
  vibeSummary?: string;
}

const EXAMPLE_VIBES = [
  "cozy rainy day with a good book and coffee",
  "date night, intimate but not stuffy",
  "loud dive bar, live music, cheap beer",
  "quiet workspace with fast wifi and natural light",
  "upscale brunch with friends, good mimosas",
];

export function SearchBar({ onSearch, uiState, vibeSummary }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isIdle = uiState === "idle";
  const [placeholder, setPlaceholder] = useState(EXAMPLE_VIBES[0]);

  useEffect(() => {
    if (!isIdle) return;
    inputRef.current?.focus();
    const interval = setInterval(() => {
      setPlaceholder(
        EXAMPLE_VIBES[Math.floor(Math.random() * EXAMPLE_VIBES.length)]
      );
    }, 4000);
    return () => clearInterval(interval);
  }, [isIdle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) onSearch(query.trim());
  };

  return (
    <div
      className={`fixed left-1/2 z-20 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 transition-all duration-500 ease-out ${
        isIdle ? "top-1/2 -translate-y-1/2" : "top-6 translate-y-0"
      }`}
    >
      {/* Brand */}
      {isIdle && (
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white font-[family-name:var(--font-display)]">
            drift
          </h1>
          <p className="mt-2 text-sm text-white/40">
            discover places by how they feel
          </p>
        </div>
      )}

      {/* Vibe summary chip */}
      {vibeSummary && !isIdle && (
        <div className="mb-3 text-center">
          <span className="inline-block rounded-full bg-white/10 px-4 py-1.5 text-sm text-white/80 backdrop-blur-md">
            {vibeSummary}
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            disabled={!isIdle && uiState !== "results"}
            className={`w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-white placeholder-white/30 shadow-2xl backdrop-blur-xl outline-none transition-all duration-300 focus:border-white/25 focus:ring-1 focus:ring-white/10 disabled:opacity-60 ${
              isIdle ? "py-5 text-lg" : "py-4 text-base"
            }`}
          />
          <button
            type="submit"
            disabled={!query.trim() || (!isIdle && uiState !== "results")}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl bg-white/15 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-white/25 disabled:cursor-not-allowed disabled:opacity-30"
          >
            Drift
          </button>
        </div>
      </form>
    </div>
  );
}
