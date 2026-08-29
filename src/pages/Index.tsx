import { useState } from "react";
import { TravelForm } from "@/components/TravelForm";
import { TravelItinerary } from "@/components/TravelItinerary";
import FlightTable from "@/components/FlightTable";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import {
  generateTravelPlan,
  TravelPreferences,
  FlightData,
} from "@/lib/gemini";
import { useToast } from "@/components/ui/use-toast";
import { Compass } from "lucide-react";

export type { FlightData };

const Index = () => {
  const [itinerary, setItinerary] = useState("");
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (preferences: TravelPreferences) => {
    setIsLoading(true);
    setItinerary("");
    setFlightData(null);

    try {
      const result = await generateTravelPlan(preferences);
      setItinerary(result.itinerary);
      setFlightData(result.flights);

      toast({
        title: "Success!",
        description: "Your travel plan has been generated.",
      });
    } catch (error: unknown) {
      let message = "Failed to generate travel plan. Please try again.";
      if (error instanceof Error) message = error.message;
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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative">
      <div className="absolute inset-0 dark:bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[radial-gradient(#374151_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>

      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-xl">
              <Compass className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Adventure AI compass
            </span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-12 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Design your perfect trip with{" "}
              <span className="text-primary">AI</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Enter your preferences below and let our intelligent engine craft
              a personalized itinerary, complete with real-time flight data.
            </p>
          </div>

          <div className="bg-card border border-border shadow-sm rounded-2xl p-6 md:p-8">
            <TravelForm isLoading={isLoading} onSubmit={handleSubmit} />
          </div>

          {itinerary && <TravelItinerary itinerary={itinerary} />}
          {flightData && flightData.best_flights && (
            <FlightTable flightData={flightData} />
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
