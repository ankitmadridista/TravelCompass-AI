export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { departure_id, arrival_id, outbound_date, api_key } = req.query;
  
  const serpApiKey = api_key || process.env.VITE_SERPAPI_API_KEY;
  
  if (!serpApiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  const url = `https://serpapi.com/search.json?engine=google_flights&type=2&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&currency=USD&hl=en&api_key=${serpApiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
