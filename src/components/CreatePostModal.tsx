"use client";

import type { Mood } from "@/lib/types";
import { MOOD_CONFIG } from "@/lib/types";
import { X } from "lucide-react";
import { useState } from "react";

interface CreatePostModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (content: string, mood: Mood) => void | Promise<void>;
}

export function CreatePostModal({ open, onClose, onSubmit }: CreatePostModalProps) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("sad");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || busy) return;
    setBusy(true);
    try {
      await onSubmit(content.trim(), mood);
      setContent("");
      setMood("sad");
      onClose();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-violet-950/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg rounded-t-3xl sm:rounded-3xl bg-white p-6 shadow-2xl shadow-violet-200/50 animate-in">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-violet-950">Share what&apos;s on your mind</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-violet-400 hover:bg-violet-50 hover:text-violet-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-violet-700 mb-2">
              How are you feeling?
            </label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(MOOD_CONFIG) as Mood[]).map((m) => {
                const config = MOOD_CONFIG[m];
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMood(m)}
                    className={`inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-sm transition-all ${
                      mood === m
                        ? `${config.color} ring-2 ring-violet-300 scale-105`
                        : "bg-violet-50 text-violet-600 hover:bg-violet-100"
                    }`}
                  >
                    {config.emoji} {config.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="You're in a safe space. Share as much or as little as you'd like..."
              rows={5}
              maxLength={2000}
              className="w-full rounded-xl border border-violet-200 bg-violet-50/30 px-4 py-3 text-[15px] text-violet-900 placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300 resize-none"
              autoFocus
            />
            <p className="mt-1 text-xs text-violet-400 text-right">
              {content.length}/2000
            </p>
          </div>

          <p className="text-xs text-violet-400 leading-relaxed">
            Your post is anonymous. Be kind — this is a space for support, not judgment.
          </p>

          <button
            type="submit"
            disabled={!content.trim() || busy}
            className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white shadow-sm shadow-violet-200 hover:bg-violet-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {busy ? "Sharing..." : "Share with the community"}
          </button>
        </form>
      </div>
    </div>
  );
}
