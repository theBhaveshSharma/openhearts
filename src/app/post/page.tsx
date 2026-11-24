"use client";

import { CommentSection } from "@/components/CommentSection";
import { CrisisBanner } from "@/components/CrisisBanner";
import { Header } from "@/components/Header";
import { SetupBanner } from "@/components/SetupBanner";
import { SupportButtons } from "@/components/SupportButtons";
import {
  ensureUser,
  formatTimeAgo,
  getComments,
  getPost,
  isBackendReady,
} from "@/lib/store";
import { MOOD_CONFIG } from "@/lib/types";
import type { Comment, Post, UserProfile } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";

function PostContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!id || !isBackendReady()) return;
    const [nextPost, nextComments] = await Promise.all([
      getPost(id),
      getComments(id),
    ]);
    setPost(nextPost);
    setComments(nextComments);
  }, [id]);

  useEffect(() => {
    let cancelled = false;

    async function boot() {
      if (!isBackendReady()) {
        setReady(true);
        return;
      }

      try {
        const profile = await ensureUser();
        if (cancelled) return;
        setUser(profile);
        await refresh();
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load post");
        }
      } finally {
        if (!cancelled) setReady(true);
      }
    }

    boot();
    return () => {
      cancelled = true;
    };
  }, [refresh]);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  if (!isBackendReady()) {
    return (
      <div className="mx-auto w-full max-w-2xl px-4 py-10 space-y-4">
        <SetupBanner />
        <Link href="/feed/" className="text-sm text-violet-600 underline">
          Back to feed
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen gap-4 px-4">
        <p className="text-rose-700 text-center">{error}</p>
        <Link href="/feed/" className="text-sm font-medium text-violet-600 underline">
          Back to feed
        </Link>
      </div>
    );
  }

  if (!post || !user) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen gap-4">
        <p className="text-violet-600">Post not found.</p>
        <Link href="/feed/" className="text-sm font-medium text-violet-600 underline">
          Back to feed
        </Link>
      </div>
    );
  }

  const mood = MOOD_CONFIG[post.mood];

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-violet-50/50 to-white min-h-screen">
      <Header userName={user.anonymousName} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 space-y-5">
        <Link
          href="/feed/"
          className="inline-flex items-center gap-1.5 text-sm text-violet-500 hover:text-violet-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to feed
        </Link>

        <article className="rounded-2xl bg-white border border-violet-100 p-6 shadow-sm">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-100 to-purple-100 text-sm font-semibold text-violet-700">
                {post.author.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-violet-950">{post.author}</p>
                <p className="text-xs text-violet-400">
                  {formatTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${mood.color}`}
            >
              {mood.emoji} {mood.label}
            </span>
          </div>

          <p className="text-base leading-relaxed text-violet-900/90 mb-6 whitespace-pre-wrap">
            {post.content}
          </p>

          <SupportButtons
            postId={post.id}
            userId={user.id}
            support={post.support}
            onUpdate={refresh}
          />
        </article>

        <div className="rounded-2xl bg-white border border-violet-100 p-6 shadow-sm">
          <CommentSection
            postId={post.id}
            authorId={user.id}
            authorName={user.anonymousName}
            comments={comments}
            onUpdate={refresh}
          />
        </div>

        <CrisisBanner compact />
      </main>
    </div>
  );
}

export default function PostPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-1 items-center justify-center min-h-screen">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
        </div>
      }
    >
      <PostContent />
    </Suspense>
  );
}
