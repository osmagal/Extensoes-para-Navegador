//AIzaSyDCbmRbEAmq-P2unn1jb8WybMbRnIdV8u8

// Replace with your actual API key
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

/**
 * Custom function to call Gemini API from Google Sheets
 * @param {string} prompt The text prompt to send to Gemini
 * @param {string} maxTokens Optional: Maximum number of tokens in the response (default: 1000)
 * @param {string} temperature Optional: Temperature parameter (default: 0.7)
 * @param {boolean} vertical Optional: Direction for list items (default: true for vertical)
 * @return {string|Array<Array<string>>} The generated text or a 2D array for lists
 * @customfunction
 */
function GM(prompt, maxTokens = 2500, temperature = 0.7, vertical = true) {
  // Input validation
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('Por favor providencie a um texto para o prompt válido');
  }

  // Check if prompt is asking for a list
  const isListRequest = prompt.toLowerCase().includes('list');
  
  // If it's a list request, modify the prompt to ensure structured output
  let modifiedPrompt = prompt;
  if (isListRequest) {
    modifiedPrompt = `${prompt}\n\nPlease provide the response as a numbered list, with each item on a new line, formatted like this:\n1. First item\n2. Second item\netc.`;
  }

  // Prepare the API request
  const requestBody = {
    contents: [{
      parts: [{
        text: modifiedPrompt
      }]
    }],
    generationConfig: {
      maxOutputTokens: maxTokens,
      temperature: temperature
    }
  };

  // Prepare the request options
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(requestBody),
    muteHttpExceptions: true
  };

  try {
    // Make the API request
    const response = UrlFetchApp.fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    const responseData = JSON.parse(responseText);

    // Handle API errors
    if (responseCode !== 200) {
      throw new Error(`API Error (${responseCode}): ${responseData.error?.message || 'Unknown error'}`);
    }

    // Extract the generated text
    const generatedText = responseData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!generatedText) {
      throw new Error('Unexpected API response format');
    }

    Logger.log(generatedText);
    
    // For non-list requests, return the text as is
    return generatedText;

  } catch (error) {
    // Log the error for debugging in Apps Script dashboard
    console.error('Gemini API Error:', error);
    return `Error: ${error.message}`;
  }
}