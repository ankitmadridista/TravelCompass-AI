# Vercel Deployment Guide

## Prerequisites
- Vercel account (free tier works)
- Git repository pushed to GitHub/GitLab/Bitbucket

## Deployment Steps

### 1. Push Code to Git
```sh
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

**Option A: Via Vercel Dashboard (Recommended)**
1. Go to https://vercel.com/new
2. Import your Git repository
3. Vercel will auto-detect Vite configuration
4. Click "Deploy"

**Option B: Via Vercel CLI**
```sh
npm install -g vercel
vercel login
vercel
```

### 3. Configure Environment Variables (Optional)

If you want to set default API keys (not recommended for security):

1. Go to your project on Vercel Dashboard
2. Navigate to **Settings > Environment Variables**
3. Add:
   - `VITE_GEMINI_API_KEY` (optional)
   - `VITE_SERPAPI_API_KEY` (optional)
4. Redeploy

**Note:** Users can still override these by entering their own keys in the Settings UI.

## How It Works

### Architecture:
```
Frontend (Vite/React)
    ↓
/.netlify/functions/flights (rewritten to /api/flights)
    ↓
Vercel Serverless Function (/api/flights.js)
    ↓
SerpAPI
```

### CORS Handling:
- ✅ Serverless function has CORS headers enabled
- ✅ No CORS issues in production
- ✅ Works with user-provided API keys from localStorage

### Local vs Production:
- **Local**: Frontend calls `http://localhost:3001/.netlify/functions/flights`
- **Production**: Frontend calls `/.netlify/functions/flights` (rewritten to `/api/flights`)

## Troubleshooting

### Build fails?
- Check that all dependencies are in `package.json`
- Ensure `npm run build` works locally

### API not working?
- Check Vercel Function Logs in Dashboard
- Verify API keys are entered in Settings UI
- Check browser console for errors

### CORS errors?
- Should not happen - serverless function has CORS enabled
- If it does, check `/api/flights.js` has correct headers

## Cost
- **Free tier includes:**
  - 100GB bandwidth/month
  - 100 serverless function invocations/day
  - Unlimited static requests

This is more than enough for personal use!
