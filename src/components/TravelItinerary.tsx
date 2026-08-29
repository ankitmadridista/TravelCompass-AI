import ReactMarkdown from "react-markdown";
import { Chat } from "./Chat";

interface TravelItineraryProps {
  itinerary: string;
}

export function TravelItinerary({ itinerary }: TravelItineraryProps) {
  if (!itinerary) return null;

  return (
    <div className="mt-8 space-y-8 animate-fade-in">
      <div className="p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4 text-travel-primary">
          Your Travel Itinerary
        </h2>
        <div className="prose prose-sm md:prose-base lg:prose-lg max-w-none">
          <ReactMarkdown>{itinerary}</ReactMarkdown>
        </div>
      </div>
      <Chat itinerary={itinerary} />
    </div>
  );
}