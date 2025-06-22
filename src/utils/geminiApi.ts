
import type { TravelFormData } from '../pages/Index';

export const generateTravelPlan = async (formData: TravelFormData, apiKey: string): Promise<string> => {
  const startDate = new Date(formData.startDate);
  const endDate = new Date(formData.endDate);
  const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  const prompt = `
Create a detailed travel itinerary with the following information:

**Trip Details:**
- From: ${formData.source}
- To: ${formData.destination}
- Duration: ${duration} days (${formData.startDate} to ${formData.endDate})
- Number of travelers: ${formData.travelers}
- Budget: ${formData.budget ? `$${formData.budget} USD` : 'Flexible budget'}
- Interests: ${formData.interests.length > 0 ? formData.interests.join(', ') : 'General sightseeing'}

**Please provide:**
1. **Day-by-day itinerary** with specific activities, timings, and locations
2. **Recommended accommodations** within budget
3. **Transportation options** between cities/attractions
4. **Local cuisine** recommendations
5. **Budget breakdown** (accommodation, food, activities, transport)
6. **Travel tips** specific to the destination
7. **Must-see attractions** based on interests
8. **Local customs and etiquette** to be aware of

**Format the response with clear headings and bullet points for easy reading.**

Make the plan practical, exciting, and tailored to the traveler's interests and budget. Include specific restaurant names, hotel suggestions, and activity timings where possible.
`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API Error:', errorData);
      throw new Error(`API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      throw new Error('Invalid response format from Gemini API');
    }

    const generatedText = data.candidates[0].content.parts[0].text;
    
    if (!generatedText || generatedText.trim().length === 0) {
      throw new Error('Empty response from Gemini API');
    }

    console.log('Travel plan generated successfully');
    return generatedText;

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('API_KEY_INVALID') || error.message.includes('403')) {
        throw new Error('Invalid API key. Please check your Gemini API key and try again.');
      } else if (error.message.includes('QUOTA_EXCEEDED')) {
        throw new Error('API quota exceeded. Please check your Gemini API usage limits.');
      } else if (error.message.includes('400')) {
        throw new Error('Invalid request. Please check your travel details and try again.');
      }
    }
    
    throw new Error('Failed to generate travel plan. Please check your API key and try again.');
  }
};
