# Vow — Phase 1
1. Create a Supabase project. In the SQL editor, run `supabase/migrations/001_foundation.sql`.
2. Auth → URL config: add `http://localhost:3000/auth/callback` as a redirect URL.
3. `cp .env.example .env.local` and fill in the project URL and anon key (Settings → API).
4. `npm install && npm run dev` → http://localhost:3000
Test: sign up, create a wedding, copy the invite code, sign up a second account in a private window and join with it.
