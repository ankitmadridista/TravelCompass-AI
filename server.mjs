import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());

app.get('/.netlify/functions/flights', async (req, res) => {
  const { departure_id, arrival_id, outbound_date, api_key } = req.query;
  
  const serpApiKey = api_key || process.env.VITE_SERPAPI_API_KEY;
  
  if (!serpApiKey) {
    return res.status(400).json({ error: 'API key is required' });
  }

  const url = `https://serpapi.com/search.json?engine=google_flights&type=2&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&currency=USD&hl=en&api_key=${serpApiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy server running on http://localhost:${PORT}`));
