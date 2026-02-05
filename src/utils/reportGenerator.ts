// Report generation utility - to be implemented

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
  scoring: number;
  scenarioModeling: string;
  regulatoryContext: string;
}

export const generateReportDocument = async (
  clientName: string,
  opportunities: OpportunityData[]
) => {
  console.log('Report generation not yet implemented');
};
