
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock, Star, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface TravelResultsProps {
  travelPlan: string;
  isLoading: boolean;
}

const TravelResults: React.FC<TravelResultsProps> = ({ travelPlan, isLoading }) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(travelPlan);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Travel plan copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive"
      });
    }
  };

  const formatTravelPlan = (plan: string) => {
    if (!plan) return null;
    
    // Split by lines and format
    const lines = plan.split('\n').filter(line => line.trim());
    
    return lines.map((line, index) => {
      const trimmedLine = line.trim();
      
      // Headers (usually contain Day, ## or **text**)
      if (trimmedLine.match(/^(Day \d+|##|\*\*.*\*\*|# )/)) {
        return (
          <h3 key={index} className="text-lg font-semibold text-gray-800 mt-6 mb-3 first:mt-0">
            {trimmedLine.replace(/[#*]/g, '').trim()}
          </h3>
        );
      }
      
      // Sub-headers or time entries
      if (trimmedLine.match(/^\d+:\d+|^Morning|^Afternoon|^Evening|^\* /)) {
        return (
          <div key={index} className="flex items-start gap-3 mb-3">
            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700 leading-relaxed">{trimmedLine.replace(/^\* /, '')}</p>
          </div>
        );
      }
      
      // Regular paragraphs
      if (trimmedLine.length > 0) {
        return (
          <p key={index} className="text-gray-600 mb-3 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }
      
      return null;
    });
  };

  if (isLoading) {
    return (
      <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl text-gray-800">Your Travel Plan</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-2 pt-4">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Generating your personalized travel plan...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!travelPlan) {
    return (
      <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-800 mb-2">Ready to Plan Your Adventure?</h3>
          <p className="text-gray-600 max-w-sm">
            Fill out the travel form and let our AI create a personalized itinerary for your perfect trip.
          </p>
          <div className="flex items-center gap-4 mt-6">
            <Badge variant="outline" className="text-xs">
              <Clock className="h-3 w-3 mr-1" />
              Instant Results
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              AI Powered
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-xl text-gray-800">Your Travel Plan</CardTitle>
          </div>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-green-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none">
          <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-gradient-to-r from-blue-500 to-orange-500 text-white">
                AI Generated
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              This personalized travel plan was created using advanced AI to match your preferences and requirements.
            </p>
          </div>
          
          <div className="space-y-2">
            {formatTravelPlan(travelPlan)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TravelResults;
