"use client";

import type { Mood } from "@/lib/types";
import { MOOD_CONFIG } from "@/lib/types";

interface MoodFilterProps {
  selected: Mood | "all";
  onChange: (mood: Mood | "all") => void;
}

export function MoodFilter({ selected, onChange }: MoodFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange("all")}
        className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-all ${
          selected === "all"
            ? "bg-violet-600 text-white shadow-sm"
            : "bg-white text-violet-600 border border-violet-200 hover:bg-violet-50"
        }`}
      >
        All
      </button>
      {(Object.keys(MOOD_CONFIG) as Mood[]).map((mood) => {
        const config = MOOD_CONFIG[mood];
        return (
          <button
            key={mood}
            onClick={() => onChange(mood)}
            className={`shrink-0 rounded-full px-3 py-2 text-sm font-medium transition-all ${
              selected === mood
                ? "bg-violet-600 text-white shadow-sm"
                : "bg-white text-violet-600 border border-violet-200 hover:bg-violet-50"
            }`}
          >
            {config.emoji} {config.label}
          </button>
        );
      })}
    </div>
  );
}
