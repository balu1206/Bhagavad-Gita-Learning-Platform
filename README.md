# 🪷 GitaPath — Bhagavad Gita Learning Platform

A premium, full-stack web application for studying the Bhagavad Gita through immersive reading, Sanskrit audio, guided learning paths, and intelligent progress tracking.

---

## ✨ Features

| Feature | Description |
|---|---|
| **700 verses** | Complete Gita with Sanskrit, transliteration, Edwin Arnold translation, word-by-word, commentary |
| **Audio player** | Howler.js-powered Sanskrit audio with queue, sleep timer, Media Session API (lock screen controls) |
| **Beginner Journey** | 8-step guided path with Markdown lessons, quizzes (≥70% to pass), XP/levelling, step locking |
| **Bookmarks & Notes** | Save verses with notes (2000 chars), tags, search, filter, CSV export |
| **Achievements** | 12 badges across Common/Rare/Epic/Legendary rarities with unlock toasts |
| **Streak & XP** | Daily streak with 7-day heatmap, XP system, levels |
| **Profile & Settings** | GitHub-style 365-day activity heatmap, settings (reading, audio, notifications, privacy), JSON export |
| **Dark mode** | System-aware theme toggle (light / dark / system) |
| **PWA-ready** | manifest.json, Apple web app meta tags, installable on mobile |

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS 3.4 with custom design tokens |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js v4 (Google OAuth + Credentials/bcryptjs) |
| State | Zustand (audio store, subscribeWithSelector) |
| Audio | Howler.js (lazy dynamic import, SSR-safe) |
| Animations | Tailwind keyframes + Framer Motion |
| Forms | React Hook Form + Zod validation |
| Icons | Lucide React |

---

## 🚀 Local Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (local or [Neon](https://neon.tech) free tier)
- Google OAuth credentials (optional — email/password auth works without it)

### 1. Clone and install

```bash
cd gita-app
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

```env
# Database
DATABASE_URL="postgresql://user:password@host:5432/gitapath"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"   # openssl rand -base64 32

# Google OAuth (optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Set up the database

```bash
npx prisma db push           # Push schema
npx prisma generate          # Generate Prisma client

# Seed content
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seedJourney.ts
```

### 4. Run dev server

```bash
npm run dev
# http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/            # Login, register, forgot-password
│   ├── (app)/             # Protected: dashboard, chapters, read,
│   │                      #   listen, bookmarks, journey, achievements, profile
│   ├── api/               # REST API routes (auth, bookmarks, chapters,
│   │                      #   journey, achievements, profile)
│   ├── error.tsx          # Global error boundary
│   ├── not-found.tsx      # 404 page
│   └── layout.tsx         # Root layout (SEO, PWA, providers)
├── components/
│   ├── ui/                # Design system primitives
│   ├── shared/            # ThemeProvider, SessionProvider, AppShell
│   ├── audio/             # MiniPlayer, FullPlayerSheet, QueuePanel
│   ├── bookmarks/         # BookmarkCard, BookmarkButton, Modal
│   ├── journey/           # QuizSection, AchievementBadge, StreakCard
│   └── profile/           # ActivityHeatmap, SettingsPanel
├── hooks/                 # useAudio, useMediaSession, useSleepTimer
├── stores/                # audioStore (Zustand)
├── lib/                   # prisma, auth, utils, constants
└── types/                 # howler.d.ts
```

---

## ☁️ Deployment (Vercel)

1. Push to GitHub, import in [Vercel](https://vercel.com)
2. Add environment variables
3. Connect a PostgreSQL database (Neon recommended)
4. Deploy — `prisma generate` runs automatically via `postinstall`
5. Seed the production DB from your local machine

### Before deploying — restore two settings

| Setting | File | Action |
|---|---|---|
| Google Fonts | `src/app/globals.css` + `layout.tsx` | Uncomment `next/font/google` imports, remove CSS `--font-*` variables |
| Prisma types | `src/app/api/**/*.ts` | Replace `as any` casts with proper generated types |

See `../07_DECISIONS.md` (DEC-001, DEC-005) for exact instructions.

---

## 🧪 Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run lint         # ESLint
npx tsc --noEmit     # Type check
npx prisma studio    # DB browser
```

---

## 🗄 Database Models

```
User ── Account, Session, UserProgress, Bookmark,
        UserJourneyProgress, UserAchievement

Chapter ── Verse ── UserProgress, Bookmark

JourneyStep ── Lesson, QuizQuestion, UserJourneyProgress

Achievement ── UserAchievement
```

---

## 📖 Seed Data

- 18 chapters with full Sanskrit titles and summaries
- 700 verses — 3 with real Edwin Arnold translations (2.47, 4.7, 11.32), rest labelled placeholders
- 8 journey steps with full Markdown lessons and quiz questions
- 12 achievements across 4 rarity tiers

---

*🕉️ "Perform your duty equipoised, abandoning all attachment to success or failure." — Bhagavad Gita 2.48*
