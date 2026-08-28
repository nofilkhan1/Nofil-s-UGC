# CreatorDock

CreatorDock is a Next.js + Supabase MVP for matching brands with UGC creators. Brands publish Instagram or TikTok campaigns, creators apply with a per-post quote, brands approve or reject applicants, and creators receive in-app decision notifications.

## Included workflows

- Brand and creator email/password signup
- Server-enforced `brand`, `creator`, and trusted `admin` roles
- Creator profile with general information and portfolio/social links
- Instagram and TikTok campaign publishing
- Campaign discovery and per-post quote applications
- Brand applicant review with transactional approve/reject decisions
- In-app notifications for applications and decisions
- Admin overview for users, creators, brands, campaigns, and applications
- Supabase Row Level Security policies for every table

## Local setup

1. Create a Supabase project.
2. Run [`supabase/migrations/0001_initial.sql`](./supabase/migrations/0001_initial.sql) in the Supabase SQL editor.
3. Copy `.env.example` to `.env.local` and add the project URL and anon key.
4. In Supabase Auth URL configuration, set the site URL to `http://localhost:3000` and add your eventual Vercel URL as a redirect URL.
5. Install and run:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Create an admin

Admins cannot be selected during signup. Sign up normally, find the user's UUID under Supabase Authentication → Users, then run this from a trusted SQL session:

```sql
update public.profiles
set role = 'admin'
where id = '<auth-user-uuid>';
```

Never expose a service-role key in `.env.local` values prefixed with `NEXT_PUBLIC_`.

## Verification

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

See `DESIGN.md` for the visual system and `UX-CONTRACT.md` for workflow behavior.
