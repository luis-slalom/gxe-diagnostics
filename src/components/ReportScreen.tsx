import React, { useState } from 'react';
import { OpportunityData } from '../utils/reportGenerator';
import * as XLSX from 'xlsx';
import './ReportScreen.css';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  scoring: string;
  cluster: string;
  enablingTech: string;
  barriers: string;
  triggerEvents: string;
  earlyIndicators: string;
  segmentSize: string;
  wtpProxies: string;
  underservedSegments: string;
  goToMarket: string;
  scenarioSummary: string;
}

interface ReportScreenProps {
  projectName: string;
  clientName: string;
  context: string;
  opportunities: OpportunityData[];
  onBack: () => void;
}

/**
 * Map OpportunityData from AI generation to display format
 */
function mapOpportunityData(data: OpportunityData, index: number): Opportunity {
  // Extract first sentence or first 100 chars for description
  const description = data.explanation
    ? data.explanation.split(/[.!?]/)[0].substring(0, 150) + '...'
    : 'Strategic opportunity for growth and innovation';

  return {
    id: String(index + 1),
    title: data.title,
    description,
    scoring: `${data.scoring.tam}/${data.scoring.switchCost}/${data.scoring.moat}`,
    cluster: data.marketMapping.split('\n')[0] || 'Market Opportunity',
    enablingTech: data.triggerEvents.slice(0, 2).join(', ') || 'Emerging technologies',
    barriers: data.marketMapping.includes('barriers')
      ? data.marketMapping.split('barriers')[1]?.split('\n')[0] || 'Competitive landscape'
      : 'Market and competitive challenges',
    triggerEvents: data.triggerEvents.join(', '),
    earlyIndicators: data.earlyIndicators.join(', '),
    segmentSize: data.segmentSizing,
    wtpProxies: data.strategicRelevance.split('\n')[0] || 'Value capture potential',
    underservedSegments: data.underservedSegmentStrategy,
    goToMarket: data.strategicRelevance,
    scenarioSummary: data.scenarioModeling,
  };
}

export const ReportScreen: React.FC<ReportScreenProps> = ({
  projectName,
  clientName,
  context,
  opportunities: opportunityData,
  onBack,
}) => {
  // Map AI-generated data to display format
  const opportunities = opportunityData.map((data, index) => mapOpportunityData(data, index));
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  /**
   * Export report data to Excel (XLS) format
   */
  const handleDownloadExcel = () => {
    // Create workbook
    const wb = XLSX.utils.book_new();

    // Create summary sheet
    const summaryData = [
      ['Strategic Foresight Report'],
      ['Client:', clientName],
      ['Project:', projectName],
      ['Context:', context],
      ['Generated:', new Date().toLocaleDateString()],
      ['Total Opportunities:', opportunityData.length],
      [],
      ['Opportunity', 'TAM Score', 'Switch Cost', 'Moat Score', 'Description'],
    ];

    // Add opportunity summaries
    opportunityData.forEach((opp, index) => {
      summaryData.push([
        `${index + 1}. ${opp.title}`,
        opp.scoring.tam,
        opp.scoring.switchCost,
        opp.scoring.moat,
        opp.explanation.substring(0, 200) + '...',
      ]);
    });

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(wb, summarySheet, 'Summary');

    // Create detailed sheet for each opportunity
    opportunityData.forEach((opp, index) => {
      const oppData = [
        [`OPPORTUNITY ${index + 1}: ${opp.title}`],
        [],
        ['DETAILED EXPLANATION'],
        [opp.explanation],
        [],
        ['EVIDENCE QUOTES AND CITATIONS'],
        ...opp.evidenceQuotes.map(q => [`• ${q}`]),
        [],
        ['SEGMENT SIZING'],
        [opp.segmentSizing],
        [],
        ['TRIGGER EVENTS'],
        ...opp.triggerEvents.map(t => [`• ${t}`]),
        [],
        ['EARLY INDICATORS'],
        ...opp.earlyIndicators.map(i => [`• ${i}`]),
        [],
        ['STRATEGIC RELEVANCE'],
        [opp.strategicRelevance],
        [],
        ['MARKET MAPPING'],
        [opp.marketMapping],
        [],
        ['UNDERSERVED SEGMENT STRATEGY'],
        [opp.underservedSegmentStrategy],
        [],
        ['SCORING'],
        [`TAM: ${opp.scoring.tam}/10`],
        [`Switch Cost: ${opp.scoring.switchCost}/10`],
        [`Moat Potential: ${opp.scoring.moat}/10`],
        [],
        ['SCENARIO MODELING'],
        [opp.scenarioModeling],
        [],
        ['REGULATORY CONTEXT'],
        [opp.regulatoryContext],
      ];

      const oppSheet = XLSX.utils.aoa_to_sheet(oppData);

      // Set column widths
      oppSheet['!cols'] = [{ wch: 100 }];

      // Truncate sheet name to 31 characters (Excel limit)
      const sheetName = `Opp ${index + 1} - ${opp.title}`.substring(0, 31);
      XLSX.utils.book_append_sheet(wb, oppSheet, sheetName);
    });

    // Generate file name
    const fileName = `${clientName}_Strategic_Foresight_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Download file
    XLSX.writeFile(wb, fileName);
  };

  return (
    <div className="report-screen">
      {/* Header */}
      <header className="report-screen__header">
        <button className="report-screen__back-button" onClick={onBack}>
          ← Back
        </button>
        <div className="report-screen__title-section">
          <h1 className="report-screen__client-name">{clientName}</h1>
          <div className="report-screen__meta">
            <span className="report-screen__project-name">{projectName}</span>
            <span className="report-screen__badge">AI-generated</span>
          </div>
        </div>
        <button className="report-screen__download-button" onClick={handleDownloadExcel}>
          ↓ Download Excel
        </button>
      </header>

      {/* Main Content */}
      <main className="report-screen__content">
        <div className="report-screen__intro">
          <h2 className="report-screen__section-title">Foresight Opportunities</h2>
          <p className="report-screen__section-description">
            Based on {context} analysis, here are the AI-generated opportunities for {clientName}
          </p>
        </div>

        {/* Opportunities List */}
        <div className="report-screen__opportunities">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id}
              className={`report-screen__opportunity-card ${
                expandedId === opportunity.id ? 'expanded' : ''
              }`}
            >
              <div
                className="report-screen__opportunity-header"
                onClick={() => handleToggleExpand(opportunity.id)}
              >
                <div className="report-screen__opportunity-title-group">
                  <h3 className="report-screen__opportunity-title">
                    {opportunity.title}
                  </h3>
                  <p className="report-screen__opportunity-description">
                    {opportunity.description}
                  </p>
                </div>
                <div className="report-screen__opportunity-scoring">
                  <span className="report-screen__scoring-label">Scoring (TAM / Switch / Moat)</span>
                  <span className="report-screen__scoring-value">{opportunity.scoring}</span>
                </div>
                <button className="report-screen__expand-button">
                  {expandedId === opportunity.id ? '−' : '+'}
                </button>
              </div>

              {expandedId === opportunity.id && (
                <div className="report-screen__opportunity-details">
                  <div className="report-screen__detail-row">
                    <div className="report-screen__detail-item">
                      <span className="report-screen__detail-label">Cluster</span>
                      <p className="report-screen__detail-value">{opportunity.cluster}</p>
                    </div>
                    <div className="report-screen__detail-item">
                      <span className="report-screen__detail-label">Enabling Tech</span>
                      <p className="report-screen__detail-value">
                        {opportunity.enablingTech}
                      </p>
                    </div>
                  </div>

                  <div className="report-screen__detail-row">
                    <div className="report-screen__detail-item">
                      <span className="report-screen__detail-label">Barriers</span>
                      <p className="report-screen__detail-value">{opportunity.barriers}</p>
                    </div>
                    <div className="report-screen__detail-item">
                      <span className="report-screen__detail-label">Trigger Events</span>
                      <p className="report-screen__detail-value">
                        {opportunity.triggerEvents}
                      </p>
                    </div>
                  </div>

                  <div className="report-screen__detail-row">
                    <div className="report-screen__detail-item">
                      <span className="report-screen__detail-label">Early Indicators</span>
                      <p className="report-screen__detail-value">
                        {opportunity.earlyIndicators}
                      </p>
                    </div>
                    <div className="report-screen__detail-item">
                      <span className="report-screen__detail-label">Segment Size</span>
                      <p className="report-screen__detail-value">{opportunity.segmentSize}</p>
                    </div>
                  </div>

                  <div className="report-screen__detail-row">
                    <div className="report-screen__detail-item">
                      <span className="report-screen__detail-label">WTP Proxies</span>
                      <p className="report-screen__detail-value">{opportunity.wtpProxies}</p>
                    </div>
                    <div className="report-screen__detail-item">
                      <span className="report-screen__detail-label">Underserved Segments</span>
                      <p className="report-screen__detail-value">
                        {opportunity.underservedSegments}
                      </p>
                    </div>
                  </div>

                  <div className="report-screen__detail-row">
                    <div className="report-screen__detail-item full-width">
                      <span className="report-screen__detail-label">Go-to-Market</span>
                      <p className="report-screen__detail-value">{opportunity.goToMarket}</p>
                    </div>
                    <div className="report-screen__detail-item full-width">
                      <span className="report-screen__detail-label">Scenario Summary</span>
                      <p className="report-screen__detail-value">
                        {opportunity.scenarioSummary}
                      </p>
                    </div>
                  </div>

                  <div className="report-screen__opportunity-actions">
                    <button className="report-screen__action-button secondary">
                      More options
                    </button>
                    <button className="report-screen__action-button primary">
                      Drill down
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ReportScreen;
