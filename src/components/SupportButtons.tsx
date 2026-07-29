"use client";

import type { SupportType } from "@/lib/types";
import { SUPPORT_CONFIG } from "@/lib/types";
import { giveSupport, hasGivenSupport } from "@/lib/store";
import { useState } from "react";

interface SupportButtonsProps {
  postId: string;
  support: Record<SupportType, number>;
  onUpdate: () => void;
}

export function SupportButtons({ postId, support, onUpdate }: SupportButtonsProps) {
  const [animating, setAnimating] = useState<SupportType | null>(null);

  function handleSupport(type: SupportType) {
    if (hasGivenSupport(postId, type)) return;
    const success = giveSupport(postId, type);
    if (success) {
      setAnimating(type);
      setTimeout(() => setAnimating(null), 600);
      onUpdate();
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(SUPPORT_CONFIG) as SupportType[]).map((type) => {
        const config = SUPPORT_CONFIG[type];
        const given = hasGivenSupport(postId, type);
        const count = support[type];

        return (
          <button
            key={type}
            onClick={() => handleSupport(type)}
            disabled={given}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all ${
              given
                ? "bg-violet-100 text-violet-700 ring-1 ring-violet-200"
                : "bg-violet-50 text-violet-600 hover:bg-violet-100 hover:scale-105"
            } ${animating === type ? "scale-110" : ""}`}
          >
            <span className="text-base">{config.emoji}</span>
            <span className="font-medium">{count}</span>
          </button>
        );
      })}
    </div>
  );
}
