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
        max_tokens: max_tokens || 4000,
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Pollinations API error:', response.status, errorText);
      return res.status(response.status).json({
        error: `Pollinations API error: ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
