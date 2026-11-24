"use client";

import type { SupportType } from "@/lib/types";
import { SUPPORT_CONFIG } from "@/lib/types";
import { getGivenSupport, giveSupport } from "@/lib/store";
import { useEffect, useState } from "react";

interface SupportButtonsProps {
  postId: string;
  userId: string;
  support: Record<SupportType, number>;
  onUpdate: () => void | Promise<void>;
}

export function SupportButtons({
  postId,
  userId,
  support,
  onUpdate,
}: SupportButtonsProps) {
  const [animating, setAnimating] = useState<SupportType | null>(null);
  const [given, setGiven] = useState<SupportType[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getGivenSupport(postId, userId)
      .then((types) => {
        if (!cancelled) setGiven(types);
      })
      .catch(() => {
        if (!cancelled) setGiven([]);
      });
    return () => {
      cancelled = true;
    };
  }, [postId, userId]);

  async function handleSupport(type: SupportType) {
    if (given.includes(type) || busy) return;
    setBusy(true);
    try {
      const success = await giveSupport(postId, userId, type);
      if (success) {
        setGiven((prev) => [...prev, type]);
        setAnimating(type);
        setTimeout(() => setAnimating(null), 600);
        await onUpdate();
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(SUPPORT_CONFIG) as SupportType[]).map((type) => {
        const config = SUPPORT_CONFIG[type];
        const alreadyGiven = given.includes(type);
        const count = support[type];

        return (
          <button
            key={type}
            onClick={() => handleSupport(type)}
            disabled={alreadyGiven || busy}
            className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-all ${
              alreadyGiven
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
