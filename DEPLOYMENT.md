Variable Name,Description
GEMINI_API_KEY,Your Google Gemini API key (powers the itinerary and chat).
SERP_API_KEY,Your SerpAPI key (fetches real-time Google Flights).Variable Name,Description
GEMINI_API_KEY,Your Google Gemini API key (powers the itinerary and chat).
SERP_API_KEY,Your SerpAPI key (fetches real-time Google Flights).Variable Name,Description
GEMINI_API_KEY,Your Google Gemini API key (powers the itinerary and chat).
SERP_API_KEY,Your SerpAPI key (fetches real-time Google Flights).# Vercel Deployment Guide

## Prerequisites
- Vercel account (Hobby/Free tier works perfectly)
- Git repository pushed to GitHub/GitLab/Bitbucket
- API Keys ready: Google Gemini and SerpAPI
- (Optional but recommended) Vercel KV / Upstash Redis database for rate limiting

## Deployment Steps

### 1. Push Code to Git
Ensure your local environment is clean and all proxy or Netlify files have been deleted.
```sh
git add .
git commit -m "Migrate to secure Vercel Serverless architecture"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Click Add New > Project and import your Git repository
3. Vercel will automatically detect the Vite framework
4. Do not click Deploy just yet, you must add your environment variables first.

**Option B: Via Vercel CLI**
```sh
npm install -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables (Mandatory)

Since the Bring-Your-Own-Key (BYOK) frontend logic was removed for security, your app will fail to build or run if these are missing.

In the deployment configuration screen, open the Environment Variables tab and add the following exactly as written (do NOT use a VITE_ prefix):

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings > Environment Variables**
3. Add:
   - `GEMINI_API_KEY` (optional)
   - `SERP_API_KEY` (optional)
4. Redeploy

| Variable Name | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API key (powers the itinerary and chat). |
| `SERP_API_KEY` | Your SerpAPI key (fetches real-time Google Flights). |


### 4. Enable Rate Limiting (Upstash Redis)
To protect your free-tier API keys from abuse, activate the built-in rate limiter:

1. Once deployed, go to your project on the Vercel Dashboard.
2. Click the Storage tab.
3. Select Create Database > KV (powered by Upstash).
4. Follow the prompts to create the database.
5. Vercel will automatically inject KV_REST_API_URL and KV_REST_API_TOKEN into your Environment Variables.
6. Go to Deployments and trigger a Redeploy to apply the new database limits.


#### How It Works Now (Security Upgrade)
The New Architecture

```
Frontend (React/Vite) 
  │
  ├─> POST /api/generate ──> (Serverless) ──> Gemini AI + SerpAPI
  │
  └─> POST /api/chat     ──> (Serverless) ──> Gemini AI
```

### Security & CORS Handling:
- ✅ **No More Leaked Keys:** The frontend never sees your API keys. They stay locked securely on the Vercel Node.js backend.
- ✅ **Zero CORS Issues:** Because ```/api/generate``` and ```/api/chat``` are Vercel Serverless Functions hosted on the exact same domain as your frontend, CORS is natively satisfied. You no longer need manual headers or external proxy servers.
- ✅ **Graceful Fallbacks:** If SerpAPI fails or runs out of credits, the server catches the error and injects mock flight data so the UI never crashes.

### Troubleshooting
- **Local**: Frontend calls `http://localhost:3001/.netlify/functions/flights`
- **Production**: Frontend calls `/.netlify/functions/flights` (rewritten to `/api/flights`)

## Troubleshooting

### "Internal Server Error" when clicking Plan My Trip
- Check your Vercel Function Logs in the dashboard.
- Verify your API keys are correct and don't have trailing spaces.
- Confirm you ran a fresh deployment after adding new environment variables.

### Rate Limiter Not Working?
- Verify that ```KV_REST_API_URL``` exists in your Vercel Environment Variables settings.
- If you manually created an Upstash database outside of Vercel, ensure the keys are named correctly.

### Changes aren't showing up?
- If you edit ```api/generate.ts``` or ```api/chat.ts```, you must push the code to Git and wait for Vercel to rebuild the project.