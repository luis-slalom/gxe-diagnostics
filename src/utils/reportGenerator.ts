/**
 * Report generation utility for GXE Diagnostics
 * Generates Word documents from strategic foresight opportunities
 */

import { Document, Packer, Paragraph, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';
import { generateStrategicForesightReport } from '../services/pollinationsApi';

export interface OpportunityData {
  title: string;
  explanation: string;
  evidenceQuotes: string[];
  segmentSizing: string;
  triggerEvents: string[];
  earlyIndicators: string[];
  strategicRelevance: string;
  marketMapping: string;
  underservedSegmentStrategy: string;
  scoring: {
    tam: number;
    switchCost: number;
    moat: number;
  };
  scenarioModeling: string;
  regulatoryContext: string;
}

/**
 * Remove markdown formatting (asterisks) from text
 */
function cleanMarkdown(text: string): string {
  if (!text) return text;
  return text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
}

/**
 * Parse AI-generated text into structured opportunity data
 * Extracts information from the formatted text response
 */
export function parseOpportunitiesFromText(text: string): OpportunityData[] {
  const opportunities: OpportunityData[] = [];
  const opportunityBlocks = text.split(/OPPORTUNITY \d+:/i).filter(block => block.trim().length > 0);

  for (let i = 0; i < opportunityBlocks.length; i++) {
    const block = opportunityBlocks[i];
    const lines = block.split('\n').map(line => line.trim()).filter(line => line.length > 0);

    if (lines.length === 0) continue;

    // Skip the first block if it's just introductory text (no opportunity sections)
    if (i === 0 && !block.match(/\d+\.\s*(DETAILED EXPLANATION|EVIDENCE|SEGMENT|TRIGGER|EARLY|STRATEGIC|MARKET|UNDERSERVED|SCORING|SCENARIO|REGULATORY)/i)) {
      continue;
    }

    const title = cleanMarkdown(lines[0].replace(/^\[.*?\]\s*/, '').trim());

    const extractSection = (sectionName: string): string => {
      const sectionRegex = new RegExp(`\\d+\\.\\s*${sectionName}`, 'i');
      const sectionIndex = lines.findIndex(line => sectionRegex.test(line));

      if (sectionIndex === -1) return '';

      const nextSectionIndex = lines.findIndex((line, idx) =>
        idx > sectionIndex && /^\d+\./.test(line)
      );

      const sectionLines = nextSectionIndex === -1
        ? lines.slice(sectionIndex + 1)
        : lines.slice(sectionIndex + 1, nextSectionIndex);

      return cleanMarkdown(sectionLines.join('\n').trim());
    };

    const extractListItems = (sectionName: string): string[] => {
      const content = extractSection(sectionName);
      return content
        .split(/[-•]\s*/)
        .map(item => cleanMarkdown(item.trim()))
        .filter(item => item.length > 0);
    };

    const scoringText = extractSection('SCORING');
    const tamMatch = scoringText.match(/TAM[:\s]*(\d+)/i);
    const switchMatch = scoringText.match(/Switch[^:]*[:\s]*(\d+)/i);
    const moatMatch = scoringText.match(/Moat[^:]*[:\s]*(\d+)/i);

    const opportunity: OpportunityData = {
      title,
      explanation: extractSection('DETAILED EXPLANATION'),
      evidenceQuotes: extractListItems('EVIDENCE QUOTES'),
      segmentSizing: extractSection('SEGMENT SIZING'),
      triggerEvents: extractListItems('TRIGGER EVENTS'),
      earlyIndicators: extractListItems('EARLY INDICATORS'),
      strategicRelevance: extractSection('STRATEGIC RELEVANCE'),
      marketMapping: extractSection('MARKET MAPPING'),
      underservedSegmentStrategy: extractSection('UNDERSERVED SEGMENT STRATEGY'),
      scoring: {
        tam: tamMatch ? parseInt(tamMatch[1]) : 5,
        switchCost: switchMatch ? parseInt(switchMatch[1]) : 5,
        moat: moatMatch ? parseInt(moatMatch[1]) : 5
      },
      scenarioModeling: extractSection('SCENARIO MODELING'),
      regulatoryContext: extractSection('REGULATORY CONTEXT')
    };

    opportunities.push(opportunity);
  }

  return opportunities;
}

/**
 * Generate and download a Word document from opportunity data
 */
export async function generateReportDocument(
  clientName: string,
  projectName: string,
  context: string,
  opportunities: OpportunityData[]
): Promise<void> {
  const children: Paragraph[] = [];

  // Title page
  children.push(
    new Paragraph({
      text: 'Strategic Foresight Scan',
      heading: HeadingLevel.TITLE,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: clientName,
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({
      text: `Project: ${projectName}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 }
    }),
    new Paragraph({
      text: `Context: ${context}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 200 }
    }),
    new Paragraph({
      text: `Generated: ${new Date().toLocaleDateString()}`,
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 }
    }),
    new Paragraph({ text: '', pageBreakBefore: true })
  );

  // Opportunities
  opportunities.forEach((opp, index) => {
    children.push(
      new Paragraph({
        text: `Opportunity ${index + 1}: ${opp.title}`,
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 400, after: 200 }
      })
    );

    // Detailed Explanation
    if (opp.explanation) {
      children.push(
        new Paragraph({
          text: '1. DETAILED EXPLANATION',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: opp.explanation,
          spacing: { after: 200 }
        })
      );
    }

    // Evidence Quotes
    if (opp.evidenceQuotes.length > 0) {
      children.push(
        new Paragraph({
          text: '2. EVIDENCE QUOTES AND CITATIONS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );
      opp.evidenceQuotes.forEach(quote => {
        children.push(
          new Paragraph({
            text: `• ${quote}`,
            spacing: { after: 50 },
            indent: { left: 360 }
          })
        );
      });
      children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    }

    // Segment Sizing
    if (opp.segmentSizing) {
      children.push(
        new Paragraph({
          text: '3. SEGMENT SIZING',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: opp.segmentSizing,
          spacing: { after: 200 }
        })
      );
    }

    // Trigger Events
    if (opp.triggerEvents.length > 0) {
      children.push(
        new Paragraph({
          text: '4. TRIGGER EVENTS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );
      opp.triggerEvents.forEach(event => {
        children.push(
          new Paragraph({
            text: `• ${event}`,
            spacing: { after: 50 },
            indent: { left: 360 }
          })
        );
      });
      children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    }

    // Early Indicators
    if (opp.earlyIndicators.length > 0) {
      children.push(
        new Paragraph({
          text: '5. EARLY INDICATORS',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        })
      );
      opp.earlyIndicators.forEach(indicator => {
        children.push(
          new Paragraph({
            text: `• ${indicator}`,
            spacing: { after: 50 },
            indent: { left: 360 }
          })
        );
      });
      children.push(new Paragraph({ text: '', spacing: { after: 200 } }));
    }

    // Strategic Relevance
    if (opp.strategicRelevance) {
      children.push(
        new Paragraph({
          text: '6. STRATEGIC RELEVANCE',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: opp.strategicRelevance,
          spacing: { after: 200 }
        })
      );
    }

    // Market Mapping
    if (opp.marketMapping) {
      children.push(
        new Paragraph({
          text: '7. MARKET MAPPING',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: opp.marketMapping,
          spacing: { after: 200 }
        })
      );
    }

    // Underserved Segment Strategy
    if (opp.underservedSegmentStrategy) {
      children.push(
        new Paragraph({
          text: '8. UNDERSERVED SEGMENT STRATEGY',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: opp.underservedSegmentStrategy,
          spacing: { after: 200 }
        })
      );
    }

    // Scoring
    children.push(
      new Paragraph({
        text: '9. SCORING',
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 200, after: 100 }
      }),
      new Paragraph({
        text: `• TAM (Total Addressable Market): ${opp.scoring.tam}/10`,
        spacing: { after: 50 },
        indent: { left: 360 }
      }),
      new Paragraph({
        text: `• Switch Cost: ${opp.scoring.switchCost}/10`,
        spacing: { after: 50 },
        indent: { left: 360 }
      }),
      new Paragraph({
        text: `• Moat Potential: ${opp.scoring.moat}/10`,
        spacing: { after: 200 },
        indent: { left: 360 }
      })
    );

    // Scenario Modeling
    if (opp.scenarioModeling) {
      children.push(
        new Paragraph({
          text: '10. SCENARIO MODELING',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: opp.scenarioModeling,
          spacing: { after: 200 }
        })
      );
    }

    // Regulatory Context
    if (opp.regulatoryContext) {
      children.push(
        new Paragraph({
          text: '11. REGULATORY CONTEXT',
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          text: opp.regulatoryContext,
          spacing: { after: 400 }
        })
      );
    }

    // Page break after each opportunity except the last
    if (index < opportunities.length - 1) {
      children.push(
        new Paragraph({ text: '', pageBreakBefore: true })
      );
    }
  });

  // Create document
  const doc = new Document({
    sections: [{
      properties: {},
      children
    }]
  });

  // Generate and download
  const blob = await Packer.toBlob(doc);
  const fileName = `${clientName}_Strategic_Foresight_Scan_${new Date().toISOString().split('T')[0]}.docx`;
  saveAs(blob, fileName);
}

/**
 * Generate a complete strategic foresight report
 * This is the main entry point that combines AI generation and parsing
 * Returns parsed opportunities to be displayed in the UI
 */
export async function generateCompleteReport(
  clientName: string,
  projectName: string,
  context: string
): Promise<OpportunityData[]> {
  try {
    // Generate opportunities using AI
    const aiResponse = await generateStrategicForesightReport(clientName, context);

    // Parse the response into structured data
    const opportunities = parseOpportunitiesFromText(aiResponse);

    if (opportunities.length === 0) {
      throw new Error('No opportunities were generated. Please try again.');
    }

    return opportunities;
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
}
