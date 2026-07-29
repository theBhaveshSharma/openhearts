"use client";

import { addComment, formatTimeAgo } from "@/lib/store";
import { Send } from "lucide-react";
import { useState } from "react";

interface CommentSectionProps {
  postId: string;
  authorName: string;
  comments: { id: string; author: string; content: string; createdAt: string }[];
  onUpdate: () => void;
}

export function CommentSection({
  postId,
  authorName,
  comments,
  onUpdate,
}: CommentSectionProps) {
  const [content, setContent] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    addComment(postId, authorName, content.trim());
    setContent("");
    onUpdate();
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-violet-800">
        {comments.length} {comments.length === 1 ? "reply" : "replies"}
      </h3>

      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-600">
            {comment.author.charAt(0)}
          </div>
          <div className="flex-1 rounded-xl bg-violet-50/60 px-4 py-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-violet-800">
                {comment.author}
              </span>
              <span className="text-xs text-violet-400">
                {formatTimeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-violet-900/80">
              {comment.content}
            </p>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Send words of support..."
          maxLength={500}
          className="flex-1 rounded-xl border border-violet-200 bg-white px-4 py-2.5 text-sm text-violet-900 placeholder:text-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-300"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="flex items-center justify-center rounded-xl bg-violet-600 px-4 text-white hover:bg-violet-700 disabled:opacity-40 transition-colors"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
