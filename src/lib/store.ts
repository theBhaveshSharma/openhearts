import { generateAnonymousName } from "./anonymous";
import { getSupabase, isSupabaseConfigured } from "./supabase";
import type {
  Comment,
  DbComment,
  DbPost,
  Mood,
  Post,
  SupportType,
  UserProfile,
} from "./types";

function mapPost(row: DbPost): Post {
  return {
    id: row.id,
    author: row.author_name,
    content: row.content,
    mood: row.mood,
    support: {
      heart: row.heart_count,
      hug: row.hug_count,
      strength: row.strength_count,
    },
    createdAt: row.created_at,
  };
}

function mapComment(row: DbComment): Comment {
  return {
    id: row.id,
    postId: row.post_id,
    author: row.author_name,
    content: row.content,
    createdAt: row.created_at,
  };
}

export function isBackendReady(): boolean {
  return isSupabaseConfigured;
}

export async function ensureUser(): Promise<UserProfile> {
  const supabase = getSupabase();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  let userId = session?.user?.id;

  if (!userId) {
    const { data, error } = await supabase.auth.signInAnonymously();
    if (error || !data.user) {
      throw new Error(
        error?.message ??
          "Anonymous sign-in failed. Enable Anonymous provider in Supabase Auth settings."
      );
    }
    userId = data.user.id;
  }

  const { data: existing, error: profileError } = await supabase
    .from("profiles")
    .select("id, anonymous_name, created_at")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(profileError.message);
  }

  if (existing) {
    return {
      id: existing.id,
      anonymousName: existing.anonymous_name,
      joinedAt: existing.created_at,
    };
  }

  const anonymousName = generateAnonymousName();
  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert({ id: userId, anonymous_name: anonymousName })
    .select("id, anonymous_name, created_at")
    .single();

  if (createError || !created) {
    throw new Error(createError?.message ?? "Could not create profile");
  }

  return {
    id: created.id,
    anonymousName: created.anonymous_name,
    joinedAt: created.created_at,
  };
}

export async function getPosts(): Promise<Post[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data as DbPost[]).map(mapPost);
}

export async function getPost(id: string): Promise<Post | null> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? mapPost(data as DbPost) : null;
}

export async function createPost(
  authorId: string,
  authorName: string,
  content: string,
  mood: Mood
): Promise<Post> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: authorId,
      author_name: authorName,
      content,
      mood,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not create post");
  }

  return mapPost(data as DbPost);
}

export async function getComments(postId: string): Promise<Comment[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(error.message);
  return (data as DbComment[]).map(mapComment);
}

export async function addComment(
  postId: string,
  authorId: string,
  authorName: string,
  content: string
): Promise<Comment> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      author_id: authorId,
      author_name: authorName,
      content,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Could not add comment");
  }

  return mapComment(data as DbComment);
}

export async function getGivenSupport(
  postId: string,
  userId: string
): Promise<SupportType[]> {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("support_reactions")
    .select("type")
    .eq("post_id", postId)
    .eq("user_id", userId);

  if (error) throw new Error(error.message);
  return (data ?? []).map((row) => row.type as SupportType);
}

export async function giveSupport(
  postId: string,
  userId: string,
  type: SupportType
): Promise<boolean> {
  const supabase = getSupabase();
  const { error } = await supabase.from("support_reactions").insert({
    post_id: postId,
    user_id: userId,
    type,
  });

  if (error) {
    if (error.code === "23505") return false;
    throw new Error(error.message);
  }

  return true;
}

export function formatTimeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
