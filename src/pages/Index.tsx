
import React, { useState } from 'react';
import TravelForm from '../components/TravelForm';
import TravelResults from '../components/TravelResults';
import { Plane, MapPin } from 'lucide-react';

export interface TravelFormData {
  source: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelers: string;
  interests: string[];
  includeTransportation: boolean;
}

export interface FlightData {
  best_flights: Array<{
    flights: Array<{
      departure_airport: {
        name: string;
        id: string;
        time: string;
      };
      arrival_airport: {
        name: string;
        id: string;
        time: string;
      };
      duration: number;
      airplane: string;
      airline: string;
      airline_logo: string;
      travel_class: string;
      flight_number: string;
      legroom: string;
      extensions: string[];
      overnight?: boolean;
    }>;
    layovers: Array<{
      duration: number;
      name: string;
      id: string;
    }>;
    total_duration: number;
    carbon_emissions: {
      this_flight: number;
      typical_for_this_route: number;
      difference_percent: number;
    };
    price: number;
    type: string;
    airline_logo: string;
  }>;
}

const Index = () => {
  const [travelPlan, setTravelPlan] = useState<string>('');
  const [flightData, setFlightData] = useState<FlightData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handlePlanGenerated = (plan: string, flights?: FlightData) => {
    setTravelPlan(plan);
    if (flights) {
      setFlightData(flights);
    }
  };

  const handleLoadingChange = (loading: boolean) => {
    setIsLoading(loading);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-pink-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                AI Travel Planner
              </h1>
              <p className="text-gray-600 text-sm">Powered by Gemini AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl text-gray-700">Plan Your Perfect Trip</h2>
            </div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Tell us about your travel preferences and let our AI create a personalized itinerary just for you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Travel Form */}
            <div className="space-y-6">
              <TravelForm 
                onPlanGenerated={handlePlanGenerated}
                onLoadingChange={handleLoadingChange}
              />
            </div>

            {/* Results */}
            <div className="space-y-6">
              <TravelResults 
                travelPlan={travelPlan}
                flightData={flightData}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
