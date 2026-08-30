# Adventure AI compass

An intelligent, full-stack travel planning application. Adventure AI compass uses Google's Gemini AI to craft highly personalized travel itineraries and integrates with SerpAPI to fetch real-time flight data, all wrapped in a modern, dark-mode compatible SaaS interface.

## 🚀 Tech Stack

**Frontend:**
* Vite + React
* TypeScript
* Tailwind CSS + Typography
* shadcn/ui (Radix UI)
* next-themes (Dark/Light mode)

**Backend & Infrastructure:**
* Vercel Serverless Functions (`/api` routes)
* Google Gemini AI API (`@google/generative-ai`)
* SerpAPI (Google Flights data)
* Vercel KV / Upstash Redis (Rate Limiting)

## 🔐 Environment Variables

To run this project, you will need to add the following environment variables to your `.env` file at the root of your project. **Do not use the `VITE_` prefix** for these keys, as they are securely handled by the backend serverless functions.

```env
# Google Gemini API Key (for itinerary generation and chat)
GEMINI_API_KEY=your_gemini_api_key

# SerpAPI Key (for live Google Flights data)
SERP_API_KEY=your_serpapi_key

# Upstash / Vercel KV Database (for IP-based rate limiting)
KV_REST_API_URL=[https://your-upstash-url.upstash.io](https://your-upstash-url.upstash.io)
KV_REST_API_TOKEN=your_upstash_token
```

## 💻 Local Development
Because this project utilizes Vercel Serverless Functions for secure API calls, you should use the Vercel CLI to run the development environment, rather than standard Vite commands.

1. Install Vercel CLI globally (if you haven't already):
```bash
npm i -g vercel
```

2. Clone the repository and install dependencies:

```bash
git clone <YOUR_GIT_URL>
cd travelcompass
npm install
```

3. Link the project to Vercel and pull environment variables (Optional):

```bash
vercel link
vercel env pull .env
```

4. Start the local development server:

```bash
vercel dev
```

Note: Do not use npm run dev, as it will not execute the backend /api/generate.ts and /api/chat.ts routes.

## 🌐 Deployment

This project is optimized for deployment on Vercel.

1. Push your code to a GitHub repository.

2. Import the repository into your Vercel Dashboard.

3. Navigate to Project Settings > Environment Variables and add all the keys listed in the setup section.

4. If using rate limiting, go to the Storage tab in Vercel and provision a new KV (Upstash Redis) database.

5. Click Deploy.

## ✨ Key Features

* AI Itinerary Generation: Custom daily schedules, budgets, and recommendations powered by Gemini.

* Live Flight Fetching: Real-time integration with Google Flights for accurate routing and pricing.

* Contextual AI Chat: A secure, embedded chat assistant that answers questions based specifically on the generated itinerary.

* Intelligent Rate Limiting: Built-in sliding window rate limiting (via Upstash Redis) to prevent API abuse.

* SaaS UI/UX: Fully responsive design with glassmorphism effects and automatic Dark/Light mode syncing.