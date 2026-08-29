import ReactMarkdown from "react-markdown";
import { Chat } from "./Chat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Map } from "lucide-react";

interface TravelItineraryProps {
  itinerary: string;
}

export function TravelItinerary({ itinerary }: TravelItineraryProps) {
  if (!itinerary) return null;

  return (
    <div className="mt-8 space-y-8 animate-fade-in">
      <Card className="border border-border shadow-lg bg-card/50 backdrop-blur-sm overflow-hidden">
        <CardHeader className="border-b border-border/50 bg-muted/30 pb-6">
          <div className="flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Map className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Your Master Itinerary</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:text-foreground prose-headings:font-semibold
            prose-p:text-muted-foreground prose-p:leading-relaxed
            prose-strong:text-foreground prose-strong:font-semibold
            prose-a:text-primary hover:prose-a:text-primary/80 
            prose-hr:border-border 
            prose-td:border-border prose-td:text-muted-foreground
            prose-th:border-border prose-th:bg-muted/50 prose-th:text-foreground 
            prose-li:text-muted-foreground prose-ul:my-2 prose-li:my-0">
            <ReactMarkdown>{itinerary}</ReactMarkdown>
          </div>
        </CardContent>
      </Card>
      
      <Chat itinerary={itinerary} />
    </div>
  );
}