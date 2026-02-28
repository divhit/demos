"use client";

interface VibePinProps {
  score?: number;
  isSelected: boolean;
  moodColor?: string;
}

export function VibePin({
  score,
  isSelected,
  moodColor = "#8B5E34",
}: VibePinProps) {
  const getColor = () => {
    if (score === undefined) return moodColor;
    if (score >= 70) return "#22c55e";
    if (score >= 45) return "#f59e0b";
    return "#94a3b8";
  };

  const color = getColor();
  const analyzing = score === undefined;

  return (
    <div
      className={`relative transition-transform duration-200 ${isSelected ? "scale-125" : "scale-100"}`}
    >
      {score !== undefined && score >= 70 && (
        <div
          className="absolute -inset-2 rounded-full opacity-30 blur-sm"
          style={{ backgroundColor: color }}
        />
      )}
      <div
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 border-white/20 shadow-lg backdrop-blur-sm ${analyzing ? "animate-pulse" : ""}`}
        style={{ backgroundColor: `${color}dd` }}
      >
        {score !== undefined ? (
          <span className="text-xs font-semibold text-white font-[family-name:var(--font-display)]">
            {score}
          </span>
        ) : (
          <div className="h-2 w-2 rounded-full bg-white/80" />
        )}
      </div>
      <div
        className="mx-auto h-2 w-2 -translate-y-1 rotate-45"
        style={{ backgroundColor: `${color}dd` }}
      />
    </div>
  );
}
