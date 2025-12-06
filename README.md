# HealthNet Verify — Vercel demo

This repo is a hackathon-ready demo implementing provider verification using Next.js and Vercel serverless functions.

## Features
- Dynamic multi-provider form (Add Provider) — validate many providers without CSV
- Serverless API routes: `/api/npi` (proxy to NPI registry) and `/api/proxy` (fetch website snippet)
- Scoring engine (NPI, website, phone) with configurable weights
- Export results to CSV
- Purple themed interactive UI (Tailwind)

## Run locally
1. Install dependencies
```
npm install
```
2. Run dev server
```
npm run dev
```
Open http://localhost:3000

## Deploy to Vercel
1. Push this repo to GitHub
2. Import project on https://vercel.com and deploy (Next.js detected automatically)

## Notes
- For demo purposes use synthetic data. Be mindful of external API rate limits if you run many NPI queries.
