import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Clock, ArrowRight, ExternalLink, Leaf } from 'lucide-react';
import type { FlightData, FlightOption } from '../lib/gemini'; 

interface FlightTableProps {
  flightData: FlightData;
}

const FlightTable: React.FC<FlightTableProps> = ({ flightData }) => {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const generateBookingUrl = (flight: FlightOption) => {
    const departure = flight.flights[0]?.departure_airport?.id;
    const arrival = flight.flights[flight.flights.length - 1]?.arrival_airport?.id;
    const timeString = flight.flights[0]?.departure_airport?.time;
    const date = timeString ? timeString.split(' ')[0] : '';
    
    if (departure && arrival && date) {
      return `https://www.google.com/flights?hl=en#flt=${departure}.${arrival}.${date}`;
    }
    return "https://www.google.com/flights";
  };

  if (!flightData?.best_flights?.length) return null;

  return (
    <Card className="w-full shadow-lg border border-border bg-card/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="border-b border-border/50 bg-muted/30 pb-6">
        <div className="flex items-center gap-3">
          <div className="bg-orange-500/10 p-2 rounded-lg">
            <Plane className="h-6 w-6 text-orange-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">Available Flights</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Airline</TableHead>
                <TableHead className="text-muted-foreground">Route</TableHead>
                <TableHead className="text-muted-foreground">Duration</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">Emissions</TableHead>
                <TableHead className="text-muted-foreground">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flightData.best_flights.slice(0, 10).map((flightOption, index) => (
                <TableRow key={index} className="hover:bg-muted/50 border-border">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {flightOption.airline_logo && (
                        <img 
                          src={flightOption.airline_logo} 
                          alt="Airline" 
                          className="w-8 h-8 rounded bg-white p-0.5"
                        />
                      )}
                      <div>
                        <p className="font-medium text-foreground">
                          {flightOption.flights[0]?.airline || 'Unknown Airline'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {flightOption.type}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {flightOption.flights?.map((flight, flightIndex) => (
                        <div key={flightIndex} className="flex items-center gap-2 text-sm">
                          <span className="font-medium text-foreground">{flight.departure_airport?.id}</span>
                          <span className="text-muted-foreground">{formatTime(flight.departure_airport?.time)}</span>
                          <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                          <span className="font-medium text-foreground">{flight.arrival_airport?.id}</span>
                          <span className="text-muted-foreground">{formatTime(flight.arrival_airport?.time)}</span>
                        </div>
                      ))}
                      {(flightOption.layovers?.length ?? 0) > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600 dark:text-yellow-500">
                          <Clock className="h-3 w-3" />
                          <span>
                            {flightOption.layovers.length} layover{flightOption.layovers.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium text-foreground">{formatDuration(flightOption.total_duration)}</p>
                      {(flightOption.layovers?.length ?? 0) > 0 && (
                        <p className="text-muted-foreground text-xs">
                          {formatDuration(flightOption.layovers[0]?.duration ?? 0)} layover
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600 dark:text-green-500">
                        ${flightOption.price}
                      </p>
                      <p className="text-xs text-muted-foreground">per person</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {flightOption.carbon_emissions ? (
                      <div className="flex items-center gap-1">
                        <Leaf className="h-3 w-3 text-green-500" />
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            (flightOption.carbon_emissions.difference_percent ?? 0) > 0 
                              ? 'text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50' 
                              : 'text-green-600 dark:text-green-400 border-green-200 dark:border-green-900/50'
                          }`}
                        >
                          {(flightOption.carbon_emissions.difference_percent ?? 0) > 0 ? '+' : ''}
                          {flightOption.carbon_emissions.difference_percent ?? 0}%
                        </Badge>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">N/A</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => window.open(generateBookingUrl(flightOption), '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                      Book
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlightTable;