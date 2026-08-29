export type TravelPreferences = {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: number;
  interests: string;
  includeTransportation?: boolean;
};

// Strict typing for SerpAPI Flight Data
export interface AirportInfo {
  id: string;
  time: string;
  name?: string;
}

export interface FlightSegment {
  airline: string;
  flight_number: string;
  departure_airport: AirportInfo;
  arrival_airport: AirportInfo;
  duration?: number;
}

export interface FlightOption {
  type: string;
  price: number;
  total_duration: number;
  airline_logo: string;
  booking_token: string;
  flights: FlightSegment[];
  layovers: Array<{ duration: number; id?: string; name?: string }>;
  carbon_emissions: {
    difference_percent: number;
    this_flight?: number;
    typical_for_this_route?: number;
  };
}

export interface FlightData {
  best_flights: FlightOption[];
}

export interface TravelPlanResult {
  itinerary: string;
  flights: FlightData | null;
}

// API Response interface to type the JSON payload safely
interface ApiResponse {
  itinerary: string;
  flights?: FlightData;
  message?: string;
}

export async function generateTravelPlan(preferences: TravelPreferences): Promise<TravelPlanResult> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(preferences),
    });

    const data = (await response.json()) as ApiResponse;

    if (!response.ok) {
      // This will catch our 429 Rate Limit error or 500 Server errors
      throw new Error(data.message || 'Failed to generate travel plan');
    }

    return {
      itinerary: data.itinerary,
      flights: data.flights || null,
    };
  } catch (error: unknown) {
    console.error("Error generating travel plan:", error);
    
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    
    throw new Error("An unexpected error occurred while connecting to the server.");
  }
}