import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { TravelPreferences } from "@/lib/gemini";
import { Loader2, Sparkles } from "lucide-react";

interface TravelFormProps {
  onSubmit: (preferences: TravelPreferences) => void;
  isLoading: boolean;
}

export function TravelForm({ onSubmit, isLoading }: TravelFormProps) {
  const [preferences, setPreferences] = useState<TravelPreferences>({
    source: "",
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    travelers: 1,
    interests: "",
    includeTransportation: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(preferences);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="source">Source Location</Label>
          <Input
            id="source"
            required
            autoComplete="off"
            value={preferences.source}
            onChange={(e) =>
              setPreferences({ ...preferences, source: e.target.value })
            }
            placeholder="e.g., New York"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            required
            autoComplete="off"
            value={preferences.destination}
            onChange={(e) =>
              setPreferences({ ...preferences, destination: e.target.value })
            }
            placeholder="e.g., Paris"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            required
            className="dark:[color-scheme:dark]"
            value={preferences.startDate}
            onChange={(e) =>
              setPreferences({ ...preferences, startDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            required
            className="dark:[color-scheme:dark]"
            value={preferences.endDate}
            onChange={(e) =>
              setPreferences({ ...preferences, endDate: e.target.value })
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="budget">Budget</Label>
          <Input
            id="budget"
            autoComplete="off"
            required
            value={preferences.budget}
            onChange={(e) =>
              setPreferences({ ...preferences, budget: e.target.value })
            }
            placeholder="e.g., $5000"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="travelers">Number of Travelers</Label>
          <Input
            id="travelers"
            type="number"
            min="1"
            required
            value={preferences.travelers}
            onChange={(e) =>
              setPreferences({
                ...preferences,
                travelers: parseInt(e.target.value) || 1,
              })
            }
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="interests">Interests & Preferences</Label>
        <Textarea
          id="interests"
          required
          value={preferences.interests}
          onChange={(e) =>
            setPreferences({ ...preferences, interests: e.target.value })
          }
          placeholder="e.g., historical sites, local cuisine, outdoor activities"
          className="h-24"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox
          id="includeTransportation"
          checked={preferences.includeTransportation}
          onCheckedChange={(checked) =>
            setPreferences({
              ...preferences,
              includeTransportation: checked as boolean,
            })
          }
        />
        <Label
          htmlFor="includeTransportation"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Include transportation details
        </Label>
      </div>
      <Button
        type="submit"
        className="w-full h-12 text-base font-semibold group relative overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg hover:bg-blue-600 hover:text-white hover:shadow-blue-500/25 active:scale-[0.98]"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-inherit opacity-80" />
            Generating Itinerary...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5 text-inherit opacity-80 group-hover:animate-pulse group-hover:text-blue-100" />
            Plan My Trip
          </>
        )}
      </Button>
    </form>
  );
}
