import type { Comment, Mood, Post, SupportType, UserProfile } from "./types";

const POSTS_KEY = "openhearts_posts";
const COMMENTS_KEY = "openhearts_comments";
const USER_KEY = "openhearts_user";
const SUPPORT_GIVEN_KEY = "openhearts_support_given";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

const SEED_POSTS: Post[] = [
  {
    id: "seed-1",
    author: "QuietRiver742",
    content:
      "Had a really rough day at work. Felt invisible in every meeting. Just needed to say that out loud to someone who might understand.",
    mood: "lonely",
    support: { heart: 12, hug: 8, strength: 5 },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
  },
  {
    id: "seed-2",
    author: "BraveHeart391",
    content:
      "Small win today: I actually got out of bed, made coffee, and went for a 10-minute walk. It doesn't sound like much but it felt huge.",
    mood: "hopeful",
    support: { heart: 24, hug: 6, strength: 18 },
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: "seed-3",
    author: "GentleSpirit558",
    content:
      "Does anyone else feel like they're pretending to be okay all the time? I'm exhausted from holding it together.",
    mood: "overwhelmed",
    support: { heart: 31, hug: 22, strength: 14 },
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: "seed-4",
    author: "WarmBreeze204",
    content:
      "Grateful for this space. Reading other people's stories makes me feel less alone. Thank you all for being here.",
    mood: "grateful",
    support: { heart: 19, hug: 11, strength: 7 },
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
  },
];

const SEED_COMMENTS: Comment[] = [
  {
    id: "c-1",
    postId: "seed-1",
    author: "KindSoul883",
    content: "I hear you. Being overlooked hurts. Your feelings are completely valid.",
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: "c-2",
    postId: "seed-2",
    author: "CalmWave117",
    content: "That IS huge! Proud of you for taking that step. 🌱",
    createdAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

export function getUser(): UserProfile | null {
  return read<UserProfile | null>(USER_KEY, null);
}

export function setUser(user: UserProfile): void {
  write(USER_KEY, user);
}

export function getPosts(): Post[] {
  const posts = read<Post[]>(POSTS_KEY, []);
  if (posts.length === 0) {
    write(POSTS_KEY, SEED_POSTS);
    write(COMMENTS_KEY, SEED_COMMENTS);
    return SEED_POSTS;
  }
  return posts.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getPost(id: string): Post | undefined {
  return getPosts().find((p) => p.id === id);
}

export function createPost(
  author: string,
  content: string,
  mood: Mood
): Post {
  const post: Post = {
    id: crypto.randomUUID(),
    author,
    content,
    mood,
    support: { heart: 0, hug: 0, strength: 0 },
    createdAt: new Date().toISOString(),
  };
  const posts = [post, ...read<Post[]>(POSTS_KEY, SEED_POSTS)];
  write(POSTS_KEY, posts);
  return post;
}

export function getComments(postId: string): Comment[] {
  const comments = read<Comment[]>(COMMENTS_KEY, SEED_COMMENTS);
  return comments
    .filter((c) => c.postId === postId)
    .sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
}

export function addComment(
  postId: string,
  author: string,
  content: string
): Comment {
  const comment: Comment = {
    id: crypto.randomUUID(),
    postId,
    author,
    content,
    createdAt: new Date().toISOString(),
  };
  const comments = [...read<Comment[]>(COMMENTS_KEY, SEED_COMMENTS), comment];
  write(COMMENTS_KEY, comments);
  return comment;
}

export function hasGivenSupport(postId: string, type: SupportType): boolean {
  const given = read<Record<string, SupportType[]>>(SUPPORT_GIVEN_KEY, {});
  return given[postId]?.includes(type) ?? false;
}

export function giveSupport(postId: string, type: SupportType): boolean {
  const given = read<Record<string, SupportType[]>>(SUPPORT_GIVEN_KEY, {});
  if (given[postId]?.includes(type)) return false;

  given[postId] = [...(given[postId] ?? []), type];
  write(SUPPORT_GIVEN_KEY, given);

  const posts = read<Post[]>(POSTS_KEY, SEED_POSTS);
  const updated = posts.map((p) =>
    p.id === postId
      ? { ...p, support: { ...p.support, [type]: p.support[type] + 1 } }
      : p
  );
  write(POSTS_KEY, updated);
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
