import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "@vercel/kv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

interface TravelPreferences {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string;
  includeTransportation?: boolean;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!process.env.GEMINI_API_KEY || !process.env.SERP_API_KEY) {
    return res.status(500).json({ message: "Server configuration error: Missing API keys" });
  }

  try {
    // 1. Safe Rate Limiting
    const hasValidKV = process.env.KV_REST_API_URL && !process.env.KV_REST_API_URL.includes("your_vercel");
    
    if (hasValidKV) {
      const ratelimit = new Ratelimit({
        redis: kv,
        limiter: Ratelimit.slidingWindow(5, "24 h"),
      });
      const ip = (req.headers["x-forwarded-for"] as string) || "127.0.0.1";
      const { success } = await ratelimit.limit(`ratelimit_${ip}`);

      if (!success) {
        return res.status(429).json({
          message: "You have reached your daily limit for generating itineraries. Please try again tomorrow.",
        });
      }
    } else {
      console.log("⚠️ Skipping Rate Limit: KV Database not configured.");
    }

    // 2. Generate Itinerary
    const preferences = req.body as TravelPreferences;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || "gemini-3.6-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `Act as a travel planning expert. Create a detailed travel itinerary based on the following preferences:
    - Traveling from: ${preferences.source}
    - Destination: ${preferences.destination}
    - Dates: ${preferences.startDate} to ${preferences.endDate}
    - Budget: ${preferences.budget}
    - Number of Travelers: ${preferences.travelers}
    - Interests: ${preferences.interests}

    Please provide:
    1. Daily itinerary with timings
    2. Estimated costs for activities
    3. Recommended accommodations
    4. Travel tips and recommendations
    5. Must-visit places based on interests

    Format the response in a clear, organized way.`;

    const result = await model.generateContent(prompt);
    const plan = result.response.text();

    // 3. Fetch Flights (returning as raw JSON now instead of Markdown)
    let flightData = null;

    if (preferences.includeTransportation) {
      const airportCodes: Record<string, string> = {
        mumbai: "BOM", delhi: "DEL", bangalore: "BLR", chennai: "MAA",
        kolkata: "CCU", hyderabad: "HYD", pune: "PNQ", ahmedabad: "AMD",
        "new york": "JFK", "los angeles": "LAX", london: "LHR", paris: "CDG",
      };

      const sourceCode = airportCodes[preferences.source.toLowerCase()] || preferences.source.toUpperCase();
      const destCode = airportCodes[preferences.destination.toLowerCase()] || preferences.destination.toUpperCase();

      const serpUrl = `https://serpapi.com/search.json?engine=google_flights&type=2&departure_id=${sourceCode}&arrival_id=${destCode}&outbound_date=${preferences.startDate}&currency=USD&hl=en&api_key=${process.env.SERP_API_KEY}`;

      try {
        const serpRes = await fetch(serpUrl);
        flightData = await serpRes.json();
      } catch (error) {
        console.error("SerpAPI Error:", error);
      }
    }

    // 4. Return BOTH the text itinerary and the structured flight JSON
    return res.status(200).json({ 
      itinerary: plan,
      flights: flightData 
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Server Error:", error.message);
      if (error.message.includes("not found") || error.message.includes("no longer available")) {
        return res.status(500).json({
          message: `Model error: Please check your GEMINI_MODEL in the environment variables. Details: ${error.message}`
        });
      }
    } else {
      console.error("Server Error:", error);
    }

    return res.status(500).json({
      message: "Failed to generate itinerary. Please try again.",
    });
  }
}