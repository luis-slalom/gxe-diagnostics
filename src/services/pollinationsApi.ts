/**
 * Pollinations.ai API Integration Service
 * Provides text generation capabilities using the free pollinations.ai API
 * Routes through our serverless proxy to avoid CORS issues
 */

import axios from 'axios';

// Use our serverless proxy endpoint to avoid CORS issues
const POLLINATIONS_API_URL = '/api/generate-report';

export interface PollinationsMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface PollinationsRequest {
  model?: string;
  messages: PollinationsMessage[];
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

export interface PollinationsResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Generate text content using pollinations.ai
 * @param prompt - The user prompt/task
 * @param systemPrompt - Optional system instructions
 * @param options - Optional configuration (temperature, max_tokens, etc.)
 * @returns Generated text content
 */
export async function generateText(
  prompt: string,
  systemPrompt?: string,
  options?: {
    model?: string;
    temperature?: number;
    max_tokens?: number;
  }
): Promise<string> {
  try {
    const messages: PollinationsMessage[] = [];

    if (systemPrompt) {
      messages.push({
        role: 'system',
        content: systemPrompt
      });
    }

    messages.push({
      role: 'user',
      content: prompt
    });

    const payload: PollinationsRequest = {
      model: options?.model || 'openai',
      messages,
      temperature: options?.temperature || 0.7,
      max_tokens: options?.max_tokens || 4000,
      stream: false
    };

    const response = await axios.post<PollinationsResponse>(
      POLLINATIONS_API_URL,
      payload,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 120000 // 2 minute timeout for long generations
      }
    );

    if (response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].message.content;
    }

    throw new Error('No response generated from AI');
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`Pollinations AI API Error: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Generate strategic foresight opportunities using pollinations.ai
 * Uses the specific prompt format for GXE diagnostics
 */
export async function generateStrategicForesightReport(
  clientName: string,
  context: string
): Promise<string> {
  const prompt = `Perform a strategic foresight scan for ${clientName}. Generate 10 opportunity concepts using your full protocol. Do not limit by geography, business unit, or theme. For each opportunity, include all required sections per your instructions with full detail and analysis for all 10 opportunities: detailed explanation, evidence quotes and citations, segment sizing, trigger events, early indicators, strategic relevance, market mapping, underserved segment strategy, scoring, scenario modeling, and regulatory context.

Context: ${context}

Format each opportunity with the following structure:

OPPORTUNITY [NUMBER]: [Title]

1. DETAILED EXPLANATION
[Comprehensive description of the opportunity]

2. EVIDENCE QUOTES AND CITATIONS
[Supporting evidence with sources]

3. SEGMENT SIZING
[Market size and addressable segments]

4. TRIGGER EVENTS
[Key events that enable or signal this opportunity]

5. EARLY INDICATORS
[Observable signals that this opportunity is emerging]

6. STRATEGIC RELEVANCE
[Why this matters for ${clientName}]

7. MARKET MAPPING
[Competitive landscape and positioning]

8. UNDERSERVED SEGMENT STRATEGY
[Specific underserved segments and approach]

9. SCORING
- TAM (Total Addressable Market): [score/10]
- Switch Cost: [score/10]
- Moat Potential: [score/10]

10. SCENARIO MODELING
[Future scenarios and implications]

11. REGULATORY CONTEXT
[Relevant regulations and compliance considerations]

---

Please generate all 10 opportunities with complete detail for each section.`;

  const systemPrompt = `You are a strategic foresight expert specializing in opportunity identification and analysis. Your task is to generate comprehensive, well-researched opportunity concepts with detailed analysis across all required dimensions. Be specific, data-driven, and actionable. Use real industry trends, emerging technologies, and market dynamics to inform your analysis.`;

  return await generateText(prompt, systemPrompt, {
    temperature: 0.8,
    max_tokens: 8000 // Allow for comprehensive responses
  });
}
