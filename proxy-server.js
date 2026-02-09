// Simple CORS proxy for SerpAPI
// Run with: node proxy-server.js

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/api/flights', async (req, res) => {
  const { departure_id, arrival_id, outbound_date, api_key } = req.query;
  
  const url = `https://serpapi.com/search.json?engine=google_flights&type=2&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&currency=USD&hl=en&api_key=${api_key}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Proxy running on http://localhost:${PORT}`));
