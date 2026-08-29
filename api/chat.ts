import { GoogleGenerativeAI } from "@google/generative-ai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  if (!process.env.GEMINI_API_KEY) {
    return res
      .status(500)
      .json({ message: "Server configuration error: Missing API key" });
  }

  try {
    const { itinerary, userInput } = req.body;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const modelName = process.env.GEMINI_MODEL || "gemini-1.5-flash";
    const model = genAI.getGenerativeModel({ model: modelName });

    const prompt = `You are a helpful travel assistant. The user has the following itinerary:

${itinerary}

Their question is: ${userInput}

Please provide a helpful, concise response focusing on the specific information they're asking about.
If they ask about activities, destinations, or timing, reference specific details from their itinerary.
Keep responses friendly but focused on the actual itinerary details.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return res.status(200).json({ response: text });
  } catch (error: unknown) {
    console.error("Chat Error:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate chat response." });
  }
}
