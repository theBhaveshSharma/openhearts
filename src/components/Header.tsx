"use client";

import { Heart, Plus } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  userName?: string;
  onNewPost?: () => void;
}

export function Header({ userName, onNewPost }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-violet-100/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
        <Link href="/feed" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-sm shadow-violet-200">
            <Heart className="h-4.5 w-4.5 text-white fill-white" />
          </div>
          <span className="text-lg font-semibold text-violet-950 group-hover:text-violet-700 transition-colors">
            OpenHearts
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {userName && (
            <span className="hidden sm:block text-sm text-violet-600/70">
              {userName}
            </span>
          )}
          {onNewPost && (
            <button
              onClick={onNewPost}
              className="flex items-center gap-1.5 rounded-xl bg-violet-600 px-4 py-2 text-sm font-medium text-white shadow-sm shadow-violet-200 hover:bg-violet-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Share
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
