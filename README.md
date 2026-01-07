# GIG Health — AI Readiness Questionnaire (Phase 1)

This is a **mobile-first, Apple-like** one-question-per-screen questionnaire that logs responses to **Supabase**.

## What’s inside
- `index.html` – the locked questionnaire layout
- `styles.css` – locked art direction + consistent typography
- `spec.js` – question spec generated from the Word doc source of truth
- `app.js` – Supabase logging (responses + answers) using your anon key
- `assets/gig-logo-white.png`

## Supabase requirements (tables)
Your database should have these tables (you already do):
- `waves` (wave_id, is_active)
- `responses` (response_id, wave_id, started_at, submitted_at, completion_time_sec, client_metadata)
- `answers` (response_id, question_id, value_number, value_text, value_array)

**Important:** `answers` needs a unique constraint on `(response_id, question_id)` for upsert.

## RLS policies (must be enabled)
To keep the survey open by link **without exposing results**, you typically want:
- `responses`: allow INSERT, allow UPDATE (only their own row if you enforce; for simplicity you may allow update where response_id matches)
- `answers`: allow INSERT, allow UPDATE (for upsert)
- `waves`: allow SELECT only for active wave_id (safe)

Do NOT add SELECT policies for `responses` or `answers` in Phase 1.

## Deploy to Vercel (no code experience)
1. Create a GitHub repo (e.g. `gig-ai-questionnaire-phase1`)
2. Upload these files to the repo (unzip first)
3. Go to Vercel → Add New → Project → import the repo
4. Framework: **Other**
5. Click **Deploy**

Vercel will give you a default URL — share that link with the team.

## Changing the questionnaire later
Edit only `spec.js` (keep layout unchanged).
