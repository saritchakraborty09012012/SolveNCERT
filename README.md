# SolveNCERT — Complete Setup Guide

## Tech Stack
- **Frontend**: Next.js 14 + Tailwind CSS
- **Backend/Auth**: Supabase
- **AI**: Groq (llama-3.1-8b-instant)
- **Search**: Algolia (free tier, quota-protected)
- **Analytics**: PostHog
- **Hosting**: Cloudflare Pages

---

## 1. Install Dependencies

```bash
cd solvencert
npm install
```

---

## 2. Environment Variables

Copy `.env.local` and verify all values are filled:

```env
NEXT_PUBLIC_SUPABASE_URL=https://elbvuwnlfagngpbgcmkm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
GROQ_API_KEY=gsk_...
NEXT_PUBLIC_ALGOLIA_APP_ID=DDCL64KEQR
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=...
ALGOLIA_ADMIN_API_KEY=...
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_APP_URL=https://solvencert.in
```

---

## 3. Supabase Setup

1. Go to your Supabase project → SQL Editor
2. Run the entire `supabase/schema.sql` file
3. This creates:
   - `profiles` table
   - `invitee_profiles` table
   - `study_sessions` table
   - `payments` table
   - `ai_chats` table
   - Storage buckets (`avatars`, `payment-screenshots`)
   - RLS policies
   - Auto profile creation trigger

---

## 4. Algolia Setup

1. Go to Algolia dashboard → Create index: `solvencert_content`
2. The app auto-limits to 300 searches/day / 9500/month (free tier safe)
3. Fallback to local search when quota is reached — users see no difference

---

## 5. Local Development

```bash
npm run dev
# Opens at http://localhost:3000
```

---

## 6. Deploy to Cloudflare Pages

```bash
# Install Wrangler
npm install -g wrangler

# Login
wrangler login

# Build
npm run build

# Deploy
wrangler pages deploy .next --project-name solvencert
```

Or connect GitHub → Cloudflare Pages dashboard for auto-deploy.

**Build settings in Cloudflare:**
- Build command: `npm run build`
- Output directory: `.next`
- Node version: 20

---

## 7. Adding Content

Edit `lib/content.ts` to:
- Add more subjects/chapters
- Add exercise questions and answers
- Mark hard questions with `isHard: true`
- Add trickMethod / conceptualMethod for hard questions

---

## 8. Payment Activation

When a payment is verified manually:
1. Go to Supabase → Table Editor → payments → set `status = 'verified'`
2. Go to profiles → set `plan = 'premium'`, set `premium_ends_at`

Later you can automate this with a Supabase Edge Function.

---

## 9. Future Additions

- [ ] Add UPI QR code in `/pages/premium.tsx`
- [ ] Add book PDFs to Supabase storage and update `/pages/books.tsx`
- [ ] Add more chapter solutions in `lib/content.ts`
- [ ] Enable OAuth providers in Supabase Auth settings
- [ ] Add Algolia index population script
- [ ] Add Supabase Realtime for study room sync

---

## Project Structure

```
solvencert/
├── components/
│   ├── auth/         AuthModal
│   ├── features/     SubjectDropdowns, AIFloatBubble, ChatFloatBubble
│   └── layout/       Header, Footer, Dashboard, Layout
├── lib/              supabase, groq, algolia, analytics, content, guestLimits
├── pages/
│   ├── api/          ai/ask, sitemap
│   ├── auth/         callback
│   ├── [classSlug]/  dynamic chapter routes
│   ├── index.tsx     Homepage
│   ├── answers.tsx   Browse solutions
│   ├── books.tsx     Book downloads
│   ├── premium.tsx   Premium/payment
│   ├── settings.tsx  User settings
│   ├── history.tsx   AI + chapter history
│   ├── invite.tsx    Invite system
│   ├── study-room.tsx Whiteboard + chat
│   ├── referral.tsx  Referral rewards
│   ├── search.tsx    Search
│   └── profile.tsx   User profile
├── store/            authStore, themeStore
├── styles/           globals.css
├── types/            database.ts
├── utils/            helpers.ts
└── supabase/         schema.sql
```
