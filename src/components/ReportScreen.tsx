import React, { useState } from 'react';
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
  onBack: () => void;
}

const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'Agentic AI Commerce Integration',
    description: 'Autonomous agents surface, compare & book inventory',
    scoring: '7/5/6',
    cluster: 'AI + Personalization + Distribution',
    enablingTech: 'Agentic AI, structured content, LLM APIs',
    barriers: 'Interoperability, data norms, OTA dependence',
    triggerEvents: 'Agentic booking adoption, AI‑first search',
    earlyIndicators: 'AI search traffic, VC in agent infra',
    segmentSize: 'Global travelers',
    wtpProxies: 'CPC, conversion uplift',
    underservedSegments: 'Independent & OTA‑dependent guests',
    goToMarket: 'API + direct channel enablement',
    scenarioSummary: 'Base/Up/Down adoption depending on AI visibility',
  },
  {
    id: '2',
    title: 'Sustainable Energy Transition Hotels',
    description: 'Net‑zero energy properties as a premium segment',
    scoring: '8/6/07',
    cluster: 'ESG + Energy + Infra',
    enablingTech: 'Solar, hydrogen, micro‑grids, HVAC IoT',
    barriers: 'Capex, permitting',
    triggerEvents: 'Tax incentives, grid modernization',
    earlyIndicators: 'Renewable cost curves, ESG fund flows',
    segmentSize: 'Global hospitality',
    wtpProxies: 'Willingness to pay for green stays',
    underservedSegments: 'Eco‑conscious travelers',
    goToMarket: 'Premium positioning & certification',
    scenarioSummary: 'Growth driven by regulatory and consumer demand',
  },
];

export const ReportScreen: React.FC<ReportScreenProps> = ({
  projectName,
  clientName,
  context,
  onBack,
}) => {
  const [opportunities] = useState<Opportunity[]>(mockOpportunities);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleToggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
