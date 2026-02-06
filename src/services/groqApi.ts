/**
 * Groq API Integration (Free Tier)
 * Fast, reliable AI generation for strategic foresight reports
 * Get free API key at: https://console.groq.com
 */

import Groq from 'groq-sdk';

// Initialize Groq client
// API key should be in environment variable for security
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY || '',
  dangerouslyAllowBrowser: true // Allow browser usage for demo
});

/**
 * Generate strategic foresight report using Groq's free tier
 * Uses llama-3.3-70b-versatile model (fast and capable)
 */
export async function generateStrategicForesightWithGroq(
  clientName: string,
  context: string
): Promise<string> {
  const systemPrompt = `You are a world-class strategic foresight expert specializing in opportunity identification and market analysis. Your expertise spans technology trends, business models, competitive dynamics, regulatory environments, and market sizing. You generate data-driven, actionable insights with specific examples, numbers, and real-world evidence.`;

  const userPrompt = `Perform a comprehensive strategic foresight scan for ${clientName}. Generate exactly 10 distinct opportunity concepts with COMPLETE, DETAILED analysis for every single field. Each opportunity must be unique and substantive.

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

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: 'llama-3.3-70b-versatile', // Fast, capable model
      temperature: 0.8,
      max_tokens: 8000, // Increased for comprehensive 10-opportunity reports
      top_p: 1,
      stream: false
    });

    const response = chatCompletion.choices[0]?.message?.content;

    if (!response) {
      throw new Error('No response generated from Groq AI');
    }

    return response;
  } catch (error) {
    console.error('Groq API error:', error);
    if (error instanceof Error) {
      throw new Error(`Groq AI Error: ${error.message}`);
    }
    throw new Error('Failed to generate report with Groq AI');
  }
}

/**
 * Check if Groq API is configured
 */
export function isGroqConfigured(): boolean {
  const hasKey = !!process.env.REACT_APP_GROQ_API_KEY;
  console.log('Groq API key configured:', hasKey);
  if (hasKey) {
    console.log('Groq API key starts with:', process.env.REACT_APP_GROQ_API_KEY?.substring(0, 7) + '...');
  }
  return hasKey;
}
