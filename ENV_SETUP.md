# Environment Variables Setup

## 🔒 Security First

This application uses a secure serverless architecture. **API keys are never exposed to the browser or stored in localStorage.** All external API calls (Gemini and SerpAPI) are handled securely on the backend via Vercel Serverless Functions.

Do **NOT** use the `VITE_` prefix for your API keys.

## Local Setup

1. Copy the example environment file to create your local `.env` file:
   ```sh
   cp .env.example .env
   ```
1. Edit ```.env``` and add your actual API keys:
- **GEMINI_API_KEY:** Get from Google AI Studio

- **SERP_API_KEY:** Get from SerpAPI Dashboard

- **KV_REST_API_URL:** Get from your Vercel/Upstash KV Database settings

- **KV_REST_API_TOKEN:** Get from your Vercel/Upstash KV Database settings

2. The ```.env``` file is gitignored and will never be committed to your repository.


## Production Setup (Vercel)

To deploy these keys to production:

1. Go to your Vercel Project Dashboard.
2. Navigate to **Settings > Environment Variables**.
3. Add ```GEMINI_API_KEY```, ```SERP_API_KEY```, ```KV_REST_API_URL```, and ```KV_REST_API_TOKEN```.
4. Trigger a new deployment so the serverless functions can access the keys.


## Testing Serverless Functions Locally

Because this project uses backend functions (```/api/generate.ts``` and ```/api/chat.ts```), standard Vite commands (```npm run dev```) will not work for full-stack testing.

Install the Vercel CLI:
```bash
npm install -g vercel
```

Link your project and pull environment variables (optional):

```bash
vercel link
vercel env pull .env
```

Run the full-stack app locally:
```bash
vercel dev
```

This command spins up both your Vite frontend and your Node.js serverless backend simultaneously.

