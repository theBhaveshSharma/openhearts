export type Mood =
  | "anxious"
  | "sad"
  | "lonely"
  | "overwhelmed"
  | "grateful"
  | "hopeful"
  | "angry"
  | "confused";

export type SupportType = "heart" | "hug" | "strength";

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  author: string;
  content: string;
  mood: Mood;
  support: Record<SupportType, number>;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  anonymousName: string;
  joinedAt: string;
}

export const MOOD_CONFIG: Record<
  Mood,
  { label: string; emoji: string; color: string }
> = {
  anxious: { label: "Anxious", emoji: "😰", color: "bg-amber-100 text-amber-800" },
  sad: { label: "Sad", emoji: "😢", color: "bg-blue-100 text-blue-800" },
  lonely: { label: "Lonely", emoji: "🫂", color: "bg-purple-100 text-purple-800" },
  overwhelmed: { label: "Overwhelmed", emoji: "😵", color: "bg-orange-100 text-orange-800" },
  grateful: { label: "Grateful", emoji: "🙏", color: "bg-green-100 text-green-800" },
  hopeful: { label: "Hopeful", emoji: "✨", color: "bg-teal-100 text-teal-800" },
  angry: { label: "Angry", emoji: "😤", color: "bg-red-100 text-red-800" },
  confused: { label: "Confused", emoji: "😕", color: "bg-slate-100 text-slate-800" },
};

export const SUPPORT_CONFIG: Record<
  SupportType,
  { label: string; emoji: string }
> = {
  heart: { label: "Sending love", emoji: "💜" },
  hug: { label: "Virtual hug", emoji: "🤗" },
  strength: { label: "You've got this", emoji: "💪" },
};

export interface DbPost {
  id: string;
  author_id: string | null;
  author_name: string;
  content: string;
  mood: Mood;
  heart_count: number;
  hug_count: number;
  strength_count: number;
  created_at: string;
}

export interface DbComment {
  id: string;
  post_id: string;
  author_id: string | null;
  author_name: string;
  content: string;
  created_at: string;
}
