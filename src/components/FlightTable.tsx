
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plane, Clock, ArrowRight, ExternalLink, Leaf } from 'lucide-react';
import type { FlightData } from '../pages/Index';

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
    const date = new Date(timeString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const generateBookingUrl = (flight: any) => {
    // Generate a generic Google Flights URL for booking
    const departure = flight.flights[0]?.departure_airport?.id;
    const arrival = flight.flights[flight.flights.length - 1]?.arrival_airport?.id;
    const date = flight.flights[0]?.departure_airport?.time?.split(' ')[0];
    
    return `https://www.google.com/flights?hl=en#flt=${departure}.${arrival}.${date}`;
  };

  if (!flightData?.best_flights?.length) {
    return null;
  }

  return (
    <Card className="w-full shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-orange-500" />
          <CardTitle className="text-xl text-gray-800">Available Flights</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Airline</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Emissions</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {flightData.best_flights.slice(0, 10).map((flightOption, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img 
                        src={flightOption.airline_logo} 
                        alt="Airline" 
                        className="w-8 h-8 rounded"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {flightOption.flights[0]?.airline}
                        </p>
                        <p className="text-sm text-gray-600">
                          {flightOption.type}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      {flightOption.flights.map((flight, flightIndex) => (
                        <div key={flightIndex} className="flex items-center gap-2 text-sm">
                          <span className="font-medium">{flight.departure_airport.id}</span>
                          <span className="text-gray-500">{formatTime(flight.departure_airport.time)}</span>
                          <ArrowRight className="h-3 w-3 text-gray-400" />
                          <span className="font-medium">{flight.arrival_airport.id}</span>
                          <span className="text-gray-500">{formatTime(flight.arrival_airport.time)}</span>
                        </div>
                      ))}
                      {flightOption.layovers.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-yellow-600">
                          <Clock className="h-3 w-3" />
                          <span>
                            {flightOption.layovers.length} layover
                            {flightOption.layovers.length > 1 ? 's' : ''}
                          </span>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      <p className="font-medium">{formatDuration(flightOption.total_duration)}</p>
                      {flightOption.layovers.length > 0 && (
                        <p className="text-gray-500 text-xs">
                          {formatDuration(flightOption.layovers[0].duration)} layover
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">
                        ${flightOption.price}
                      </p>
                      <p className="text-xs text-gray-500">per person</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Leaf className="h-3 w-3 text-green-500" />
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          flightOption.carbon_emissions.difference_percent > 0 
                            ? 'text-red-600 border-red-200' 
                            : 'text-green-600 border-green-200'
                        }`}
                      >
                        {flightOption.carbon_emissions.difference_percent > 0 ? '+' : ''}
                        {flightOption.carbon_emissions.difference_percent}%
                      </Badge>
                    </div>
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
        
        {flightData.best_flights.length > 10 && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Showing top 10 flights out of {flightData.best_flights.length} available options
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FlightTable;
