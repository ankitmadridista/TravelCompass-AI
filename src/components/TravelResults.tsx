
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { MapPin, Clock, Star, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import FlightTable from './FlightTable';
import type { FlightData } from '../pages/Index';

interface TravelResultsProps {
  travelPlan: string;
  flightData?: FlightData | null;
  isLoading: boolean;
}

const TravelResults: React.FC<TravelResultsProps> = ({ travelPlan, flightData, isLoading }) => {
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

  const formatMarkdownContent = (content: string) => {
    if (!content) return null;
    
    const lines = content.split('\n');
    const formattedElements: React.ReactNode[] = [];
    
    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (!trimmedLine) return;
      
      // Main headers (# Header or **Header**)
      if (trimmedLine.match(/^#+\s/) || trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
        const headerText = trimmedLine.replace(/^#+\s|^\*\*|\*\*$/g, '');
        const headerLevel = trimmedLine.startsWith('#') ? trimmedLine.match(/^#+/)?.[0].length || 1 : 2;
        
        formattedElements.push(
          <div key={index} className={`${headerLevel === 1 ? 'text-xl font-bold text-gray-900 mt-8 mb-4 first:mt-0' : 'text-lg font-semibold text-gray-800 mt-6 mb-3 first:mt-0'} border-b border-gray-200 pb-2`}>
            {headerText}
          </div>
        );
      }
      // Day headers (Day 1, Day 2, etc.)
      else if (trimmedLine.match(/^Day\s+\d+/i)) {
        formattedElements.push(
          <div key={index} className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-lg p-4 mt-6 mb-4 first:mt-0">
            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {trimmedLine.match(/\d+/)?.[0]}
              </div>
              {trimmedLine}
            </h3>
          </div>
        );
      }
      // Bullet points or list items
      else if (trimmedLine.match(/^[-*]\s/) || trimmedLine.match(/^\d+\.\s/)) {
        const listText = trimmedLine.replace(/^[-*]\s|\d+\.\s/, '');
        formattedElements.push(
          <div key={index} className="flex items-start gap-3 mb-3 ml-4">
            <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
            <p className="text-gray-700 leading-relaxed">{listText}</p>
          </div>
        );
      }
      // Time-based entries (9:00 AM, Morning, etc.)
      else if (trimmedLine.match(/^\d{1,2}:\d{2}\s*(AM|PM)|^(Morning|Afternoon|Evening)/i)) {
        formattedElements.push(
          <div key={index} className="bg-white border-l-4 border-blue-400 pl-4 py-2 mb-3 ml-2">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <p className="text-gray-800 font-medium">{trimmedLine}</p>
            </div>
          </div>
        );
      }
      // Bold text (**text**)
      else if (trimmedLine.includes('**')) {
        const parts = trimmedLine.split(/(\*\*[^*]+\*\*)/);
        formattedElements.push(
          <p key={index} className="text-gray-700 mb-3 leading-relaxed">
            {parts.map((part, partIndex) => {
              if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={partIndex} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>;
              }
              return part;
            })}
          </p>
        );
      }
      // Regular paragraphs
      else {
        formattedElements.push(
          <p key={index} className="text-gray-600 mb-3 leading-relaxed">
            {trimmedLine}
          </p>
        );
      }
    });
    
    return formattedElements;
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
    <div className="space-y-6">
      {/* Flight Information Table */}
      {flightData && <FlightTable flightData={flightData} />}

      {/* Travel Plan */}
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
              {formatMarkdownContent(travelPlan)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelResults;
