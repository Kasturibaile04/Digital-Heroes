# Digital Heroes

**Play golf. Support charity. Win monthly prizes.**

Digital Heroes is a subscription-based web platform where golfers log their Stableford scores, contribute to charities they care about, and enter monthly prize draws — all in one place.

---

## Tech Stack

- **Framework:** Next.js 15+ (App Router, TypeScript, `src/` directory)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database & Auth:** Supabase (Postgres + built-in auth + Row Level Security)
- **Payments:** Mocked (see Payment Note below)
- **Hosting:** Vercel

---

## Features

### Auth
- Email/password signup and login via Supabase Auth
- Two roles: regular user and admin (`profiles.is_admin = true`)
- Middleware-protected routes: `/dashboard/*` and `/admin/*`

### Subscription System
- Monthly (₹499) and yearly (₹4,799) plans
- Subscription states: `inactive | active | cancelled`
- Access control: score entry and draw participation require `active` status

### Score Management
- Stableford scores (1–45)
- **Rolling-5 window**: only the 5 most recent scores are stored per user; adding a new score when at 5 drops the oldest
- **No duplicate dates**: one score per date per user

### Charity System
- Directory of charities — browsable and searchable
- Users pick a charity at signup; adjustable anytime in the dashboard
- Minimum 10% of subscription allocated to selected charity (slider up to 100%)
- Featured charity spotlight on the homepage

### Monthly Draw & Prize Engine
- Admin creates a draw for a given month
- **Simulate** first (preview numbers and winners without writing)
- **Publish** to run the draw: 5 random numbers (1–45) generated; each user's stored scores compared against draw numbers
- Prize tiers:
  - 5-number match → 40% of pool (rolls over to next month if unclaimed)
  - 4-number match → 35% of pool (split equally among winners)
  - 3-number match → 25% of pool (split equally among winners)
- Prize pool = active subscriber count × ₹50

### Winner Verification
- Winners upload proof (screenshot of scores)
- Admin reviews in verification queue: approve → payment status moves to `paid`
- Filter by pending / approved / rejected

### User Dashboard
- Subscription status and plan
- Last 5 scores with quick add/delete
- Charity selection and contribution percentage
- Draw history and prize payouts

### Admin Dashboard
- KPI overview (total users, active subscribers, prize pool, charities, pending verifications)
- User management table
- Draw engine (create, simulate, publish)
- Charity CRUD (add, edit, delete, set featured)
- Winner verification queue

---

## Payment Note

> Payment processing was mocked rather than integrated with a live gateway — Stripe is invite-only in India, and Razorpay requires GST business registration not available within the assignment timeframe. The full subscription lifecycle (plan selection, active/inactive/cancelled states, renewal dates, and access control) is fully implemented and would plug directly into a real gateway's webhook in production. To enable real payments, implement Razorpay Orders API on the `/pricing` page and trigger the profile update via a Razorpay webhook instead of the mock API route.

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Configure environment variables
Create a `.env.local` file (or update the existing one):
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Run the database schema in Supabase SQL Editor

Copy and run the SQL in `schema.sql` (provided separately) in your Supabase project's SQL editor. It creates:
- `profiles` (linked to auth.users via trigger)
- `charities`
- `scores`
- `draws`
- `draw_entries`
- `payments`

### 4. Create an admin user
After signing up, run in Supabase SQL editor:
```sql
UPDATE profiles SET is_admin = true WHERE email = 'your@email.com';
```

### 5. Start development server
```bash
npm run dev
```

---

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

---

## File Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage
│   ├── layout.tsx                  # Root layout
│   ├── globals.css                 # Design system
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── charities/
│   │   ├── page.tsx                # Charity directory
│   │   └── [id]/page.tsx           # Charity profile
│   ├── pricing/page.tsx            # Plan selection + mock subscribe
│   ├── dashboard/
│   │   ├── page.tsx                # User dashboard home
│   │   ├── scores/page.tsx         # Score entry/management
│   │   ├── charity/page.tsx        # Charity selection/edit
│   │   └── winnings/page.tsx       # Draw history & winnings
│   ├── admin/
│   │   ├── page.tsx                # Admin KPI overview
│   │   ├── users/page.tsx          # User management
│   │   ├── charities/page.tsx      # Charity CRUD
│   │   ├── draws/page.tsx          # Draw engine
│   │   └── winners/page.tsx        # Winner verification
│   └── api/
│       ├── mock-subscribe/route.ts
│       ├── draws/run/route.ts
│       └── winners/verify/route.ts
├── components/
│   ├── Navbar.tsx
│   ├── CharityCard.tsx
│   ├── DrawResultsTable.tsx
│   └── AdminKpiCard.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   └── server.ts               # Server client
│   ├── draw-engine.ts              # Draw logic + prize calculation
│   └── utils.ts
└── middleware.ts                   # Route protection
```
