/**
 * Vercel Serverless Function - Pollinations.ai Proxy
 * This function acts as a proxy to bypass CORS restrictions
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

const POLLINATIONS_API_URL = 'https://text.pollinations.ai/openai';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { messages, temperature, max_tokens, model } = req.body;

    // Validate required fields
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Limit max_tokens to prevent API overload
    const safeMaxTokens = Math.min(max_tokens || 3000, 4000);

    console.log('Making request to Pollinations.ai with:', {
      model: model || 'openai',
      messageCount: messages.length,
      temperature: temperature || 0.7,
      max_tokens: safeMaxTokens
    });

    // Make request to Pollinations.ai
    const response = await fetch(POLLINATIONS_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model || 'openai',
        messages,
        temperature: temperature || 0.7,
        max_tokens: safeMaxTokens,
        stream: false
      })
    });

    const responseText = await response.text();
    console.log('Pollinations API response status:', response.status);

    if (!response.ok) {
      console.error('Pollinations API error:', response.status, responseText);
      return res.status(response.status).json({
        error: `Pollinations API error: ${response.statusText}`,
        details: responseText,
        status: response.status
      });
    }

    try {
      const data = JSON.parse(responseText);
      return res.status(200).json(data);
    } catch (parseError) {
      console.error('Error parsing response:', parseError);
      return res.status(500).json({
        error: 'Failed to parse API response',
        details: responseText
      });
    }
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
