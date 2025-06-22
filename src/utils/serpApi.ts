
import type { FlightData } from '../pages/Index';

export const fetchFlightData = async (
  sourceCode: string,
  destinationCode: string,
  outboundDate: string,
  returnDate: string,
  apiKey: string
): Promise<FlightData> => {
  const url = `https://serpapi.com/search.json?engine=google_flights&departure_id=${sourceCode}&arrival_id=${destinationCode}&outbound_date=${outboundDate}&return_date=${returnDate}&currency=USD&hl=en&api_key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`SerpAPI Error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }
    
    // Transform SerpAPI response to match our FlightData interface
    const transformedData: FlightData = {
      best_flights: data.best_flights?.map((flight: any) => ({
        flights: flight.flights?.map((f: any) => ({
          departure_airport: {
            name: f.departure_airport?.name || '',
            id: f.departure_airport?.id || '',
            time: f.departure_airport?.time || ''
          },
          arrival_airport: {
            name: f.arrival_airport?.name || '',
            id: f.arrival_airport?.id || '',
            time: f.arrival_airport?.time || ''
          },
          duration: f.duration || 0,
          airplane: f.airplane || '',
          airline: f.airline || '',
          airline_logo: f.airline_logo || '',
          travel_class: f.travel_class || 'Economy',
          flight_number: f.flight_number || '',
          legroom: f.legroom || '',
          extensions: f.extensions || [],
          overnight: f.overnight
        })) || [],
        layovers: flight.layovers || [],
        total_duration: flight.total_duration || 0,
        carbon_emissions: flight.carbon_emissions || {
          this_flight: 0,
          typical_for_this_route: 0,
          difference_percent: 0
        },
        price: flight.price || 0,
        type: flight.type || 'Round trip',
        airline_logo: flight.airline_logo || '',
        booking_token: flight.booking_token
      })) || []
    };
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching flight data:', error);
    throw new Error('Failed to fetch flight data from SerpAPI');
  }
};

// Helper function to convert city names to airport codes (simplified mapping)
export const getCityAirportCode = (cityName: string): string => {
  const cityToAirportMap: { [key: string]: string } = {
    'mumbai': 'BOM',
    'delhi': 'DEL',
    'bangalore': 'BLR',
    'chennai': 'MAA',
    'kolkata': 'CCU',
    'hyderabad': 'HYD',
    'pune': 'PNQ',
    'ahmedabad': 'AMD',
    'goa': 'GOI',
    'kochi': 'COK',
    'new york': 'JFK',
    'los angeles': 'LAX',
    'chicago': 'ORD',
    'miami': 'MIA',
    'san francisco': 'SFO',
    'seattle': 'SEA',
    'boston': 'BOS',
    'washington': 'DCA',
    'atlanta': 'ATL',
    'denver': 'DEN',
    'london': 'LHR',
    'paris': 'CDG',
    'amsterdam': 'AMS',
    'frankfurt': 'FRA',
    'zurich': 'ZUR',
    'dubai': 'DXB',
    'singapore': 'SIN',
    'bangkok': 'BKK',
    'tokyo': 'NRT',
    'seoul': 'ICN',
    'hong kong': 'HKG',
    'beijing': 'PEK',
    'shanghai': 'PVG',
    'bali': 'DPS',
    'kuala lumpur': 'KUL',
    'jakarta': 'CGK',
    'manila': 'MNL',
    'sydney': 'SYD',
    'melbourne': 'MEL',
    'perth': 'PER',
    'auckland': 'AKL',
    'toronto': 'YYZ',
    'vancouver': 'YVR',
    'montreal': 'YUL',
    'sao paulo': 'GRU',
    'rio de janeiro': 'GIG',
    'buenos aires': 'EZE',
    'mexico city': 'MEX',
    'cairo': 'CAI',
    'johannesburg': 'JNB',
    'cape town': 'CPT',
    'nairobi': 'NBO',
    'lagos': 'LOS',
    'casablanca': 'CMN',
    'istanbul': 'IST',
    'moscow': 'SVO',
    'rome': 'FCO',
    'madrid': 'MAD',
    'barcelona': 'BCN',
    'vienna': 'VIE',
    'prague': 'PRG',
    'budapest': 'BUD',
    'warsaw': 'WAW'
  };
  
  const normalizedCity = cityName.toLowerCase().trim();
  return cityToAirportMap[normalizedCity] || normalizedCity.toUpperCase().slice(0, 3);
};
