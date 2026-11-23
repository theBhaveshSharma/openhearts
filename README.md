# OpenHearts

A peer support social app where people can anonymously share their thoughts, feelings, and life struggles — and receive encouragement from a caring community.

**OpenHearts is not therapy, medical advice, or emergency mental health care.** If you or someone you know is in crisis, please use the [crisis resources](https://988lifeline.org) linked in the app.

## Features

- **Anonymous sharing** — Auto-generated usernames, no account required
- **Mood-tagged posts** — Share how you're feeling (anxious, sad, lonely, hopeful, and more)
- **Peer support** — React with love, virtual hugs, and encouragement
- **Replies** — Leave kind words on posts that resonate with you
- **Crisis resources** — Prominent disclaimers and links to 988, Crisis Text Line, and international helplines
- **Mood filtering** — Browse the feed by how people are feeling

## Tech stack

- [Next.js 16](https://nextjs.org/) (App Router)
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) icons
- Browser `localStorage` for MVP data persistence

## Getting started

### Prerequisites

- Node.js 20+
- npm

### Install and run

```bash
git clone https://github.com/theBhaveshSharma/openhearts.git
cd openhearts
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Scripts

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run dev`  | Start development server |
| `npm run build`| Create production build  |
| `npm run start`| Run production server    |
| `npm run lint` | Run ESLint               |

## Project structure

```
src/
├── app/
│   ├── page.tsx          # Landing page
│   ├── feed/page.tsx     # Community feed
│   ├── post/[id]/page.tsx# Post detail & replies
│   └── resources/page.tsx# Crisis resources
├── components/           # UI components
└── lib/
    ├── types.ts          # Shared types
    ├── store.ts          # Local storage layer
    ├── anonymous.ts      # Anonymous name generator
    └── crisis.ts         # Crisis resource data
```

## Live site

Hosted on GitHub Pages:

**https://thebhaveshsharma.github.io/openhearts/**

## Deployment

Every push to `main` builds a static export and deploys via GitHub Actions (`.github/workflows/deploy.yml`).

### Enable GitHub Pages (one-time)

1. Open [repo Settings → Pages](https://github.com/theBhaveshSharma/openhearts/settings/pages)
2. Under **Build and deployment → Source**, choose **GitHub Actions**
3. Push to `main` (or re-run the **Deploy to GitHub Pages** workflow)

### Local production build (same as Pages)

```bash
GITHUB_PAGES=true npm run build
npx serve out
```

You can also deploy the same Next.js app on [Vercel](https://vercel.com) if you prefer a server runtime.

## Important note

This is an MVP built for learning and prototyping. A production mental health peer support platform would need:

- A real backend and database
- User authentication and moderation
- Content reporting and safety tooling
- Crisis keyword detection
- Legal review and community guidelines
- Professional oversight for safety workflows

## License

MIT
