"use client";

import { CrisisBanner } from "@/components/CrisisBanner";
import { CreatePostModal } from "@/components/CreatePostModal";
import { Header } from "@/components/Header";
import { MoodFilter } from "@/components/MoodFilter";
import { PostCard } from "@/components/PostCard";
import { generateAnonymousName } from "@/lib/anonymous";
import {
  createPost,
  getPosts,
  getUser,
  setUser,
} from "@/lib/store";
import type { Mood } from "@/lib/types";
import { useEffect, useState } from "react";

export default function FeedPage() {
  const [posts, setPosts] = useState<ReturnType<typeof getPosts>>([]);
  const [userName, setUserName] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [moodFilter, setMoodFilter] = useState<Mood | "all">("all");
  const [ready, setReady] = useState(false);

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
    setPosts(getPosts());
    setReady(true);
  }, []);

  function refresh() {
    setPosts(getPosts());
  }

  function handleCreate(content: string, mood: Mood) {
    createPost(userName, content, mood);
    refresh();
  }

  const filtered =
    moodFilter === "all"
      ? posts
      : posts.filter((p) => p.mood === moodFilter);

  if (!ready) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-gradient-to-b from-violet-50/50 to-white min-h-screen">
      <Header userName={userName} onNewPost={() => setShowCreate(true)} />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-6 space-y-5">
        <CrisisBanner compact />

        <div className="rounded-2xl bg-white/60 border border-violet-100 p-4">
          <p className="text-sm text-violet-700 mb-3">
            Welcome, <span className="font-semibold">{userName}</span>. You&apos;re in a safe space.
          </p>
          <MoodFilter selected={moodFilter} onChange={setMoodFilter} />
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
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
              <PostCard key={post.id} post={post} onUpdate={refresh} />
            ))
          )}
        </div>
      </main>

      <CreatePostModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
