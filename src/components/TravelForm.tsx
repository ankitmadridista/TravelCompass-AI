
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, DollarSign, Users, Heart, Sparkles } from 'lucide-react';
import { generateTravelPlan } from '../utils/geminiApi';
import { useToast } from '@/hooks/use-toast';
import type { TravelFormData } from '../pages/Index';

interface TravelFormProps {
  onPlanGenerated: (plan: string) => void;
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
    interests: []
  });
  const [apiKey, setApiKey] = useState('');

  const handleInputChange = (field: keyof TravelFormData, value: string | string[]) => {
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
      onPlanGenerated(plan);
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
