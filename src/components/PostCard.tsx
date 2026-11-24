"use client";

import type { Post } from "@/lib/types";
import { MOOD_CONFIG } from "@/lib/types";
import { formatTimeAgo } from "@/lib/store";
import { SupportButtons } from "./SupportButtons";
import { MessageCircle } from "lucide-react";
import Link from "next/link";

interface PostCardProps {
  post: Post;
  userId: string;
  onUpdate: () => void | Promise<void>;
}

export function PostCard({ post, userId, onUpdate }: PostCardProps) {
  const mood = MOOD_CONFIG[post.mood];

  return (
    <article className="rounded-2xl bg-white border border-violet-100 p-5 shadow-sm shadow-violet-50 hover:shadow-md hover:shadow-violet-100/50 transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-sm font-semibold text-violet-700">
            {post.author.charAt(0)}
          </div>
          <div>
            <p className="text-sm font-medium text-violet-950">{post.author}</p>
            <p className="text-xs text-violet-400">{formatTimeAgo(post.createdAt)}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${mood.color}`}
        >
          {mood.emoji} {mood.label}
        </span>
      </div>

      <p className="text-[15px] leading-relaxed text-violet-900/90 mb-4 whitespace-pre-wrap">
        {post.content}
      </p>

      <div className="flex items-center justify-between gap-3 pt-3 border-t border-violet-50">
        <SupportButtons
          postId={post.id}
          userId={userId}
          support={post.support}
          onUpdate={onUpdate}
        />
        <Link
          href={`/post/?id=${post.id}`}
          className="flex items-center gap-1 text-sm text-violet-500 hover:text-violet-700 transition-colors shrink-0"
        >
          <MessageCircle className="h-4 w-4" />
          Reply
        </Link>
      </div>
    </article>
  );
}
