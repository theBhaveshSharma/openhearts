"use client";

import { CommentSection } from "@/components/CommentSection";
import { CrisisBanner } from "@/components/CrisisBanner";
import { Header } from "@/components/Header";
import { SupportButtons } from "@/components/SupportButtons";
import { generateAnonymousName } from "@/lib/anonymous";
import {
  formatTimeAgo,
  getComments,
  getPost,
  getUser,
  setUser,
} from "@/lib/store";
import { MOOD_CONFIG } from "@/lib/types";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PostContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id") ?? "";
  const [ready, setReady] = useState(false);
  const [userName, setUserName] = useState("");
  const [post, setPost] = useState<ReturnType<typeof getPost>>(undefined);
  const [comments, setComments] = useState<ReturnType<typeof getComments>>([]);

  useEffect(() => {
    let user = getUser();
    if (!user) {
      user = {
        anonymousName: generateAnonymousName(),
        joinedAt: new Date().toISOString(),
      };
      setUser(user);
    }
    setUserName(user.anonymousName);
    setPost(id ? getPost(id) : undefined);
    setComments(id ? getComments(id) : []);
    setReady(true);
  }, [id]);

  function refresh() {
    if (!id) return;
    setPost(getPost(id));
    setComments(getComments(id));
  }

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  if (!post) {
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
      <Header userName={userName} />

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

          <SupportButtons postId={post.id} support={post.support} onUpdate={refresh} />
        </article>

        <div className="rounded-2xl bg-white border border-violet-100 p-6 shadow-sm">
          <CommentSection
            postId={post.id}
            authorName={userName}
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
