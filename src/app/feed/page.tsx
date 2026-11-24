"use client";

import { CrisisBanner } from "@/components/CrisisBanner";
import { CreatePostModal } from "@/components/CreatePostModal";
import { Header } from "@/components/Header";
import { MoodFilter } from "@/components/MoodFilter";
import { PostCard } from "@/components/PostCard";
import { SetupBanner } from "@/components/SetupBanner";
import {
  createPost,
  ensureUser,
  getPosts,
  isBackendReady,
} from "@/lib/store";
import type { Mood, Post, UserProfile } from "@/lib/types";
import { useCallback, useEffect, useState } from "react";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [moodFilter, setMoodFilter] = useState<Mood | "all">("all");
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isBackendReady()) return;
    const nextPosts = await getPosts();
    setPosts(nextPosts);
  }, []);

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
          setError(err instanceof Error ? err.message : "Failed to load feed");
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

  async function handleCreate(content: string, mood: Mood) {
    if (!user) return;
    await createPost(user.id, user.anonymousName, content, mood);
    await refresh();
  }

  const filtered =
    moodFilter === "all" ? posts : posts.filter((p) => p.mood === moodFilter);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-violet-50/50 to-white min-h-screen">
      <Header
        userName={user?.anonymousName}
        onNewPost={user ? () => setShowCreate(true) : undefined}
      />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 space-y-5">
        <CrisisBanner compact />
        <SetupBanner />

        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </div>
        )}

        {user && (
          <div className="rounded-2xl bg-white/60 border border-violet-100 p-4">
            <p className="text-sm text-violet-700 mb-3">
              Welcome, <span className="font-semibold">{user.anonymousName}</span>.
              You&apos;re in a safe space — posts are shared with everyone.
            </p>
            <MoodFilter selected={moodFilter} onChange={setMoodFilter} />
          </div>
        )}

        <div className="space-y-4">
          {!isBackendReady() ? null : filtered.length === 0 ? (
            <div className="rounded-2xl bg-white border border-violet-100 p-10 text-center">
              <p className="text-violet-600 mb-2">No posts in this category yet.</p>
              <button
                onClick={() => setShowCreate(true)}
                className="text-sm font-medium text-violet-600 hover:text-violet-800 underline underline-offset-2"
              >
                Be the first to share
              </button>
            </div>
          ) : (
            filtered.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                userId={user!.id}
                onUpdate={refresh}
              />
            ))
          )}
        </div>
      </main>

      {user && (
        <CreatePostModal
          open={showCreate}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}
    </div>
  );
}
