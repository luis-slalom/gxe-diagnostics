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
      const errorMsg = error.response?.data?.error || error.response?.data?.details || error.message;
      const statusCode = error.response?.status;

      if (statusCode === 500) {
        throw new Error(`The AI service is currently overloaded or experiencing issues. Please try again in a few moments. (Error: ${errorMsg})`);
      } else if (statusCode === 429) {
        throw new Error(`Rate limit exceeded. Please wait a moment and try again.`);
      } else {
        throw new Error(`AI API Error: ${errorMsg}`);
      }
    }
    throw error;
  }
}

/**
 * Generate strategic foresight opportunities using Groq (primary) with pollinations.ai fallback
 * Uses the specific prompt format for GXE diagnostics
 */
export async function generateStrategicForesightReport(
  clientName: string,
  context: string
): Promise<string> {
  // Try Groq first (more reliable and faster)
  try {
    const { generateStrategicForesightWithGroq, isGroqConfigured } = await import('./groqApi');

    if (isGroqConfigured()) {
      console.log('Using Groq AI for report generation...');
      const result = await generateStrategicForesightWithGroq(clientName, context);
      console.log('Groq AI generation successful');
      return result;
    } else {
      console.log('Groq API key not configured, falling back to pollinations.ai');
    }
  } catch (error) {
    console.warn('Groq unavailable or failed, falling back to pollinations.ai:', error);
  }

  // Fallback to pollinations.ai
  console.log('Using pollinations.ai for report generation...');
  const prompt = `Perform a comprehensive strategic foresight scan for ${clientName}. Generate exactly 10 distinct opportunity concepts with COMPLETE, DETAILED analysis for every single field. Each opportunity must be unique and substantive.

Context: ${context}

CRITICAL: Every section below MUST be filled with substantial, specific content. Do not use placeholders or generic statements. Provide real industry data, specific examples, named competitors, actual regulations, and concrete market sizes.

Format each opportunity exactly as shown:

OPPORTUNITY [NUMBER]: [Specific, Compelling Title - No Generic Phrases]

1. DETAILED EXPLANATION
Write 3-4 paragraphs explaining:
- What this opportunity is and why it exists now
- The underlying technology, market shift, or customer need driving it
- How ${clientName} could capitalize on this opportunity
- Specific business model or approach to capture value

2. EVIDENCE QUOTES AND CITATIONS
Provide 3-5 bullet points with:
- Specific market research findings with sources (e.g., "Gartner predicts...")
- Industry expert quotes or analyst reports
- Real company examples demonstrating this trend
- Statistical data supporting the opportunity size

3. SEGMENT SIZING
Provide detailed market sizing:
- Total Addressable Market (TAM) with specific dollar figures
- Serviceable Addressable Market (SAM) breakdown
- Target customer segments with estimated numbers
- Growth rate projections for next 3-5 years
- Geographic markets and their relative sizes

4. TRIGGER EVENTS
List 4-6 specific events that could accelerate this opportunity:
- Technology milestones (e.g., "5G deployment reaches 50% coverage")
- Regulatory changes (e.g., "New privacy laws enacted in EU")
- Market shifts (e.g., "Major competitor exits market")
- Economic factors (e.g., "Interest rates drop below 2%")

5. EARLY INDICATORS
List 4-6 observable signals to monitor:
- Specific metrics to track (e.g., "Google search volume for X increases 50%")
- Pilot programs or early adopters to watch
- Patent filings or research publications
- Investment trends or funding announcements
- Customer behavior changes

6. STRATEGIC RELEVANCE
Explain in 2-3 paragraphs:
- How this aligns with ${clientName}'s core capabilities and assets
- Competitive advantages ${clientName} brings to this opportunity
- Strategic positioning and differentiation potential
- Long-term value creation for ${clientName}'s business

7. MARKET MAPPING
Provide competitive landscape analysis:
- List 3-5 current competitors or adjacent players
- Identify white space gaps in the market
- Map solution types and positioning (e.g., premium vs. budget)
- Describe barriers to entry and competitive moats
- Partnership opportunities

8. UNDERSERVED SEGMENT STRATEGY
Detail specific underserved segments:
- Identify 2-3 specific customer groups being overlooked
- Explain why they are underserved and their pain points
- Describe tailored solutions for each segment
- Estimate revenue potential for these segments
- Go-to-market approach for reaching them

9. SCORING
Provide numerical scores with brief justification:
- TAM (Total Addressable Market): [1-10] - (1=<$100M, 10=$10B+)
- Switch Cost: [1-10] - (1=easy to switch, 10=very sticky)
- Moat Potential: [1-10] - (1=highly competitive, 10=defensible monopoly)

10. SCENARIO MODELING
Describe 3 scenarios (2-3 sentences each):
- BASE CASE: Most likely outcome and timeline
- UPSIDE CASE: Accelerated adoption scenario
- DOWNSIDE CASE: Slower adoption or competitive risks

11. REGULATORY CONTEXT
Provide regulatory analysis:
- List specific regulations that apply (name them)
- Compliance requirements and costs
- Regulatory risks or uncertainties
- Favorable regulations or incentives
- International regulatory differences if relevant

---

Generate all 10 opportunities now with COMPLETE information in every field. Do not leave any section empty or with placeholder text. Be specific, use real examples, and provide substantial detail throughout.`;

  const systemPrompt = `You are a world-class strategic foresight expert specializing in opportunity identification and market analysis. Your expertise spans technology trends, business models, competitive dynamics, regulatory environments, and market sizing. You generate data-driven, actionable insights with specific examples, numbers, and real-world evidence.`;

  return await generateText(prompt, systemPrompt, {
    temperature: 0.8,
    max_tokens: 4000 // Increased for comprehensive reports
  });
}
