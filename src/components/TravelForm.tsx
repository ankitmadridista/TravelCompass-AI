
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, DollarSign, Users, Heart, Sparkles, Plane } from 'lucide-react';
import { generateTravelPlan } from '../utils/geminiApi';
import { useToast } from '@/hooks/use-toast';
import type { TravelFormData, FlightData } from '../pages/Index';

interface TravelFormProps {
  onPlanGenerated: (plan: string, flights?: FlightData) => void;
  onLoadingChange: (loading: boolean) => void;
}

const popularInterests = [
  'Adventure', 'Culture', 'Food', 'History', 'Nature', 'Beach', 
  'Museums', 'Nightlife', 'Shopping', 'Photography', 'Architecture', 'Wildlife'
];

const TravelForm: React.FC<TravelFormProps> = ({ onPlanGenerated, onLoadingChange }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<TravelFormData>({
    source: '',
    destination: '',
    startDate: '',
    endDate: '',
    budget: '',
    travelers: '1',
    interests: [],
    includeTransportation: false
  });
  const [apiKey, setApiKey] = useState('');

  const handleInputChange = (field: keyof TravelFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  // Mock flight data function
  const getMockFlightData = (): FlightData => {
    return {
      "best_flights": [
        {
          "flights": [
            {
              "departure_airport": {
                "name": "Chhatrapati Shivaji Maharaj International Airport Mumbai",
                "id": "BOM",
                "time": "2025-07-01 00:40"
              },
              "arrival_airport": {
                "name": "Noi Bai International Airport",
                "id": "HAN",
                "time": "2025-07-01 07:10"
              },
              "duration": 300,
              "airplane": "Airbus A321",
              "airline": "Vietjet",
              "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/VJ.png",
              "travel_class": "Economy",
              "flight_number": "VJ 910",
              "legroom": "28 in",
              "extensions": [
                "Below average legroom (28 in)",
                "Carbon emissions estimate: 268 kg"
              ],
              "overnight": true
            },
            {
              "departure_airport": {
                "name": "Noi Bai International Airport",
                "id": "HAN",
                "time": "2025-07-01 10:05"
              },
              "arrival_airport": {
                "name": "I Gusti Ngurah Rai International Airport",
                "id": "DPS",
                "time": "2025-07-01 16:25"
              },
              "duration": 320,
              "airplane": "Airbus A321",
              "airline": "Vietjet",
              "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/VJ.png",
              "travel_class": "Economy",
              "flight_number": "VJ 997",
              "legroom": "28 in",
              "extensions": [
                "Below average legroom (28 in)",
                "Carbon emissions estimate: 293 kg"
              ]
            }
          ],
          "layovers": [
            {
              "duration": 175,
              "name": "Noi Bai International Airport",
              "id": "HAN"
            }
          ],
          "total_duration": 795,
          "carbon_emissions": {
            "this_flight": 562000,
            "typical_for_this_route": 468000,
            "difference_percent": 20
          },
          "price": 455,
          "type": "Round trip",
          "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/VJ.png",
          "departure_token": "WyJDalJJWjNsclFuSklRMmhCTm05QlNXSTNXSGRDUnkwdExTMHRMUzB0YjNsamFHWXlOa0ZCUVVGQlIyaFlYelV3VFRCcWVuVkJFZ3RXU2preE1IeFdTams1TnhvTENPbmlBaEFDR2dOVlUwUTRISERwNGdJPSIsW1siQk9NIiwiMjAyNS0wNy0wMSIsIkhBTiIsbnVsbCwiVkoiLCI5MTAiXSxbIkhBTiIsIjIwMjUtMDctMDEiLCJEUFMiLG51bGwsIlZKIiwiOTk3Il1dXQ=="
        },
        {
          "flights": [
            {
              "departure_airport": {
                "name": "Chhatrapati Shivaji Maharaj International Airport Mumbai",
                "id": "BOM",
                "time": "2025-07-01 01:45"
              },
              "arrival_airport": {
                "name": "Don Mueang International Airport",
                "id": "DMK",
                "time": "2025-07-01 07:35"
              },
              "duration": 260,
              "airplane": "Boeing 737",
              "airline": "Thai Lion Air",
              "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/SL.png",
              "travel_class": "Economy",
              "flight_number": "SL 219",
              "legroom": "29 in",
              "extensions": [
                "Below average legroom (29 in)",
                "Carbon emissions estimate: 218 kg"
              ],
              "overnight": true
            },
            {
              "departure_airport": {
                "name": "Don Mueang International Airport",
                "id": "DMK",
                "time": "2025-07-01 11:55"
              },
              "arrival_airport": {
                "name": "I Gusti Ngurah Rai International Airport",
                "id": "DPS",
                "time": "2025-07-01 17:20"
              },
              "duration": 265,
              "airplane": "Boeing 737",
              "airline": "Thai Lion Air",
              "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/SL.png",
              "travel_class": "Economy",
              "flight_number": "SL 258",
              "legroom": "31 in",
              "extensions": [
                "Average legroom (31 in)",
                "Carbon emissions estimate: 233 kg"
              ]
            }
          ],
          "layovers": [
            {
              "duration": 260,
              "name": "Don Mueang International Airport",
              "id": "DMK"
            }
          ],
          "total_duration": 785,
          "carbon_emissions": {
            "this_flight": 451000,
            "typical_for_this_route": 468000,
            "difference_percent": -4
          },
          "price": 504,
          "type": "Round trip",
          "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/SL.png",
          "departure_token": "WyJDalJJWjNsclFuSklRMmhCTm05QlNXSTNXSGRDUnkwdExTMHRMUzB0YjNsamFHWXlOa0ZCUVVGQlIyaFlYelV3VFRCcWVuVkJFZ3RUVERJeE9YeFRUREkxT0JvTENKcUpBeEFDR2dOVlUwUTRISENhaVFNPSIsW1siQk9NIiwiMjAyNS0wNy0wMSIsIkRNSyIsbnVsbCwiU0wiLCIyMTkiXSxbIkRNSyIsIjIwMjUtMDctMDEiLCJEUFMiLG51bGwsIlNMIiwiMjU4Il1dXQ=="
        },
        {
          "flights": [
            {
              "departure_airport": {
                "name": "Chhatrapati Shivaji Maharaj International Airport Mumbai",
                "id": "BOM",
                "time": "2025-07-01 02:40"
              },
              "arrival_airport": {
                "name": "Suvarnabhumi Airport",
                "id": "BKK",
                "time": "2025-07-01 08:40"
              },
              "duration": 270,
              "airplane": "Airbus A320",
              "airline": "THAI",
              "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
              "travel_class": "Economy",
              "flight_number": "TG 352",
              "legroom": "30 in",
              "extensions": [
                "Average legroom (30 in)",
                "Stream media to your device",
                "Carbon emissions estimate: 295 kg"
              ],
              "overnight": true
            },
            {
              "departure_airport": {
                "name": "Suvarnabhumi Airport",
                "id": "BKK",
                "time": "2025-07-01 12:40"
              },
              "arrival_airport": {
                "name": "I Gusti Ngurah Rai International Airport",
                "id": "DPS",
                "time": "2025-07-01 18:00"
              },
              "duration": 260,
              "airplane": "Airbus A320",
              "airline": "THAI",
              "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
              "travel_class": "Economy",
              "flight_number": "TG 439",
              "legroom": "30 in",
              "extensions": [
                "Average legroom (30 in)",
                "Stream media to your device",
                "Carbon emissions estimate: 288 kg"
              ]
            }
          ],
          "layovers": [
            {
              "duration": 240,
              "name": "Suvarnabhumi Airport",
              "id": "BKK"
            }
          ],
          "total_duration": 770,
          "carbon_emissions": {
            "this_flight": 584000,
            "typical_for_this_route": 468000,
            "difference_percent": 25
          },
          "price": 689,
          "type": "Round trip",
          "airline_logo": "https://www.gstatic.com/flights/airline_logos/70px/TG.png",
          "departure_token": "WyJDalJJWjNsclFuSklRMmhCTm05QlNXSTNXSGRDUnkwdExTMHRMUzB0YjNsamFHWXlOa0ZCUVVGQlIyaFlYelV3VFRCcWVuVkJFZ3RVUnpNMU1ueFVSelF6T1JvTENJdWFCQkFDR2dOVlUwUTRISENMbWdRPSIsW1siQk9NIiwiMjAyNS0wNy0wMSIsIkJLSyIsbnVsbCwiVEciLCIzNTIiXSxbIkJLSyIsIjIwMjUtMDctMDEiLCJEUFMiLG51bGwsIlRHIiwiNDM5Il1dXQ=="
        }
      ]
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key to generate travel plans.",
        variant: "destructive"
      });
      return;
    }

    if (!formData.source || !formData.destination || !formData.startDate || !formData.endDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      onLoadingChange(true);
      const plan = await generateTravelPlan(formData, apiKey);
      const flights = formData.includeTransportation ? getMockFlightData() : undefined;
      onPlanGenerated(plan, flights);
      toast({
        title: "Success!",
        description: "Your travel plan has been generated.",
      });
    } catch (error) {
      console.error('Error generating travel plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate travel plan. Please check your API key and try again.",
        variant: "destructive"
      });
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-xl text-gray-800">Travel Details</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* API Key Input */}
          <div className="space-y-2">
            <Label htmlFor="apiKey" className="text-sm font-medium text-gray-700">
              Gemini API Key *
            </Label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Enter your Gemini API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
            />
            <p className="text-xs text-gray-500">
              Get your API key from Google AI Studio
            </p>
          </div>

          {/* Source and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium text-gray-700">
                From *
              </Label>
              <Input
                id="source"
                placeholder="e.g., New York, NY"
                value={formData.source}
                onChange={(e) => handleInputChange('source', e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="destination" className="text-sm font-medium text-gray-700">
                To *
              </Label>
              <Input
                id="destination"
                placeholder="e.g., Paris, France"
                value={formData.destination}
                onChange={(e) => handleInputChange('destination', e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Start Date *
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange('startDate', e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                End Date *
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange('endDate', e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Budget and Travelers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Budget (USD)
              </Label>
              <Input
                id="budget"
                placeholder="e.g., 2000"
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="travelers" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Users className="h-4 w-4" />
                Travelers
              </Label>
              <Input
                id="travelers"
                type="number"
                min="1"
                value={formData.travelers}
                onChange={(e) => handleInputChange('travelers', e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
            </div>
          </div>

          {/* Transportation Checkbox */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="includeTransportation"
                checked={formData.includeTransportation}
                onCheckedChange={(checked) => handleInputChange('includeTransportation', !!checked)}
              />
              <Label htmlFor="includeTransportation" className="text-sm font-medium text-gray-700 flex items-center gap-2 cursor-pointer">
                <Plane className="h-4 w-4" />
                Include Transportation Details
              </Label>
            </div>
            <p className="text-xs text-gray-500 ml-6">
              Get flight options and pricing information for your trip
            </p>
          </div>

          {/* Interests */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-1">
              <Heart className="h-4 w-4" />
              Interests
            </Label>
            <div className="flex flex-wrap gap-2">
              {popularInterests.map((interest) => (
                <Badge
                  key={interest}
                  variant={formData.interests.includes(interest) ? 'default' : 'outline'}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    formData.interests.includes(interest)
                      ? 'bg-gradient-to-r from-blue-500 to-orange-500 text-white border-0'
                      : 'border-gray-300 hover:border-blue-400 text-gray-600'
                  }`}
                  onClick={() => toggleInterest(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Additional Requirements
            </Label>
            <Textarea
              id="notes"
              placeholder="Any special requirements, dietary restrictions, accessibility needs, etc."
              className="border-gray-200 focus:border-blue-400 focus:ring-blue-400 min-h-[80px]"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-orange-500 hover:from-blue-600 hover:to-orange-600 text-white font-medium py-3 transition-all duration-200 transform hover:scale-[1.02]"
          >
            Generate Travel Plan
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TravelForm;
