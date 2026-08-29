import { useState } from "react";
import { TravelForm } from "@/components/TravelForm";
import { TravelItinerary } from "@/components/TravelItinerary";
import FlightTable from "@/components/FlightTable"; // Make sure this path matches where you saved it
import { generateTravelPlan, TravelPreferences, FlightData } from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";

// Exporting this here because your FlightTable component expects to import it from pages/Index
export type { FlightData };

const Index = () => {
  const [itinerary, setItinerary] = useState("");
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (preferences: TravelPreferences) => {
    setIsLoading(true);
    setItinerary(""); // Clear previous results while loading
    setFlightData(null);

    try {
      const result = await generateTravelPlan(preferences);
      
      // Update states with the new separated data
      setItinerary(result.itinerary);
      setFlightData(result.flights);
      
      toast({
        title: "Success!",
        description: "Your travel plan has been generated.",
      });
    } catch (error: unknown) {
      console.log('error', error);
      let message = "Failed to generate travel plan. Please try again.";

      if (error instanceof Error) {
        message = error.message;
      }
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-travel-secondary/10 to-travel-accent/10">
      <div className="container py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="flex justify-center items-center">
            <h1 className="text-4xl font-bold text-travel-primary">
              TravelCompass AI
            </h1>
          </div>
          <p className="text-center text-gray-600">
            Let AI help you plan your perfect trip
          </p>
          
          <TravelForm onSubmit={handleSubmit} isLoading={isLoading} />
          
          {/* Render the markdown itinerary text */}
          {itinerary && <TravelItinerary itinerary={itinerary} />}
          
          {/* Render the beautiful glassmorphism table if flight JSON exists */}
          {flightData && flightData.best_flights && (
            <FlightTable flightData={flightData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;