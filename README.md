# OpenHearts

A peer support social app where people can anonymously share their thoughts, feelings, and life struggles — and receive encouragement from a caring community.

**OpenHearts is not therapy, medical advice, or emergency mental health care.** If you or someone you know is in crisis, please use the [crisis resources](https://988lifeline.org) linked in the app.

## Features

- **Anonymous sharing** — Auto-generated usernames via Supabase Anonymous Auth
- **Shared database** — Posts, replies, and support reactions stored in Supabase (Postgres)
- **Mood-tagged posts** — Anxious, sad, lonely, hopeful, and more
- **Peer support** — Love, virtual hugs, and encouragement reactions
- **Crisis resources** — 988, Crisis Text Line, and international helplines
- **Mood filtering** — Browse the feed by feeling

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router, static export for GitHub Pages)
- [React 19](https://react.dev/) + TypeScript + Tailwind CSS 4
- [Supabase](https://supabase.com/) — Postgres database + Anonymous Auth + Row Level Security

## Supabase setup (required)

1. Create a free project at [supabase.com](https://supabase.com/dashboard)
2. Go to **Authentication → Providers → Anonymous** and **enable** it
3. Open **SQL Editor**, paste everything from [`supabase/schema.sql`](supabase/schema.sql), and run it
4. Copy keys from **Project Settings → API**
5. Create `.env.local` in the project root:

```bash
cp .env.example .env.local
```

Fill in:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

6. For GitHub Pages, add the same two values as repository secrets:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
   Then re-run the **Deploy to GitHub Pages** workflow.

## Getting started

```bash
git clone https://github.com/theBhaveshSharma/openhearts.git
cd openhearts
npm install
cp .env.example .env.local   # then add your Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is taken).

### Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Create production build  |
| `npm run start` | Run production server    |
| `npm run lint`  | Run ESLint               |

## Project structure

```
src/
├── app/                 # Pages (landing, feed, post, resources)
├── components/          # UI components
└── lib/
    ├── supabase.ts      # Supabase client
    ├── store.ts         # Database operations
    ├── types.ts         # Shared types
    ├── anonymous.ts     # Anonymous name generator
    └── crisis.ts        # Crisis resource data
supabase/
└── schema.sql           # Tables, RLS policies, seed posts
```

## Live site

**https://thebhaveshsharma.github.io/openhearts/**

Pages deploys from the `gh-pages` branch. Every push to `main` rebuilds via GitHub Actions.

## Important note

This is still an early product. A production mental-health peer support platform would also need moderation, reporting, crisis keyword detection, legal review, and professional safety workflows.

## License

MIT
