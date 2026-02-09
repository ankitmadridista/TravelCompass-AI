# Environment Variables Setup

## Recommended: Use Settings UI

The easiest way to configure API keys is through the Settings icon in the app:

1. Click the Settings icon (⚙️) in the UI
2. Enter your API keys:
   - **Gemini API Key**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **SerpAPI Key**: Get from [SerpAPI Dashboard](https://serpapi.com/manage-api-key)
3. Click "Save Settings"

Keys are stored in browser localStorage and can be changed anytime.

## Alternative: Use Environment Variables (Optional)

If you prefer, you can set default API keys via environment variables:

1. Copy `.env.example` to `.env.local`:
   ```sh
   copy .env.example .env.local
   ```

2. Edit `.env.local` and add your actual API keys:
   - **VITE_GEMINI_API_KEY**: Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **VITE_SERPAPI_API_KEY**: Get from [SerpAPI Dashboard](https://serpapi.com/manage-api-key)

3. The `.env.local` file is gitignored and won't be committed

## For Production/Deployment (Lovable)

1. Go to your [Lovable Project Settings](https://lovable.dev/projects/6c0b8a67-cb31-424b-8bde-870c64349368)
2. Navigate to **Project > Settings > Environment Variables**
3. Add the following variables:
   - `VITE_GEMINI_API_KEY`
   - `VITE_SERPAPI_API_KEY`

## Important Notes

- Never commit `.env` or `.env.local` files
- Always use `.env.example` as a template for new developers
- Vite requires the `VITE_` prefix for environment variables to be exposed to the client


## Testing Serverless Functions Locally

Install Netlify CLI:
```sh
npm install -g netlify-cli
```

Run locally:
```sh
netlify dev
```

This will run both your Vite app and serverless functions together.
