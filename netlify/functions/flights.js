exports.handler = async (event) => {
  const { departure_id, arrival_id, outbound_date, api_key } = event.queryStringParameters;
  
  // Use provided API key or fallback to environment variable
  const serpApiKey = api_key || process.env.VITE_SERPAPI_API_KEY;
  
  if (!serpApiKey) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'API key is required' }),
    };
  }

  const url = `https://serpapi.com/search.json?engine=google_flights&type=2&departure_id=${departure_id}&arrival_id=${arrival_id}&outbound_date=${outbound_date}&currency=USD&hl=en&api_key=${serpApiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
