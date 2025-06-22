
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, DollarSign, Users, Heart, Sparkles, Plane, Key } from 'lucide-react';
import { generateTravelPlan } from '../utils/geminiApi';
import { fetchFlightData, getCityAirportCode } from '../utils/serpApi';
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
  const [geminiApiKey, setGeminiApiKey] = useState('');
  const [serpApiKey, setSerpApiKey] = useState('');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!geminiApiKey.trim()) {
      toast({
        title: "Gemini API Key Required",
        description: "Please enter your Gemini API key to generate travel plans.",
        variant: "destructive"
      });
      return;
    }

    if (formData.includeTransportation && !serpApiKey.trim()) {
      toast({
        title: "SerpAPI Key Required",
        description: "Please enter your SerpAPI key to get flight information.",
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
      
      // Generate travel plan
      const plan = await generateTravelPlan(formData, geminiApiKey);
      
      let flights: FlightData | undefined;
      
      // Fetch flight data if transportation is included
      if (formData.includeTransportation) {
        try {
          const sourceCode = getCityAirportCode(formData.source);
          const destinationCode = getCityAirportCode(formData.destination);
          
          flights = await fetchFlightData(
            sourceCode,
            destinationCode,
            formData.startDate,
            formData.endDate,
            serpApiKey
          );
        } catch (flightError) {
          console.error('Flight data error:', flightError);
          toast({
            title: "Flight Data Warning",
            description: "Travel plan generated, but flight data could not be retrieved. Please check your SerpAPI key.",
            variant: "destructive"
          });
        }
      }
      
      onPlanGenerated(plan, flights);
      toast({
        title: "Success!",
        description: "Your travel plan has been generated.",
      });
    } catch (error) {
      console.error('Error generating travel plan:', error);
      toast({
        title: "Error",
        description: "Failed to generate travel plan. Please check your API keys and try again.",
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
          {/* API Keys Section */}
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <Key className="h-4 w-4 text-gray-600" />
              <h3 className="text-sm font-semibold text-gray-700">API Keys</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="geminiApiKey" className="text-sm font-medium text-gray-700">
                Gemini API Key *
              </Label>
              <Input
                id="geminiApiKey"
                type="password"
                placeholder="Enter your Gemini API key"
                value={geminiApiKey}
                onChange={(e) => setGeminiApiKey(e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
              />
              <p className="text-xs text-gray-500">
                Get your API key from Google AI Studio
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="serpApiKey" className="text-sm font-medium text-gray-700">
                SerpAPI Key {formData.includeTransportation && '*'}
              </Label>
              <Input
                id="serpApiKey"
                type="password"
                placeholder="Enter your SerpAPI key"
                value={serpApiKey}
                onChange={(e) => setSerpApiKey(e.target.value)}
                className="border-gray-200 focus:border-blue-400 focus:ring-blue-400"
                disabled={!formData.includeTransportation}
              />
              <p className="text-xs text-gray-500">
                Required only for flight information from SerpAPI
              </p>
            </div>
          </div>

          {/* Source and Destination */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="source" className="text-sm font-medium text-gray-700">
                From *
              </Label>
              <Input
                id="source"
                placeholder="e.g., Mumbai, New York"
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
                placeholder="e.g., Bali, Paris"
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
                Include Real Flight Data
              </Label>
            </div>
            <p className="text-xs text-gray-500 ml-6">
              Get live flight options and pricing from SerpAPI
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
