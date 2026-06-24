# Voucher WebApp

Next.js + Supabase web app for issuing hotel/travel vouchers.

## Features
- Password-protected login
- Create hotel vouchers
- Auto voucher number from Supabase trigger
- Voucher list/search
- Printable voucher page
- Private database with RLS enabled; app uses service role key server-side only

## Setup
1. Copy `.env.example` to `.env.local`
2. Add your Supabase service role key from Supabase Project Settings > API
3. Change `ADMIN_PASSWORD` and `SESSION_SECRET`
4. Install and run:

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Deployment
Deploy to Vercel and add the same environment variables.
Never expose the service role key in frontend code.
