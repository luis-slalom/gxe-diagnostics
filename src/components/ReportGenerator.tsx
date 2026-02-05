import React, { useState } from 'react';
import { OpportunityData, generateReportDocument } from '../utils/reportGenerator';
import './ReportGenerator.css';

export const ReportGenerator: React.FC = () => {
  const [clientName, setClientName] = useState('');
  const [opportunities, setOpportunities] = useState<OpportunityData[]>([]);
  const [currentOpportunity, setCurrentOpportunity] = useState<Partial<OpportunityData>>({
    evidenceQuotes: [],
    triggerEvents: [],
    earlyIndicators: []
  });
  const [loading, setLoading] = useState(false);

  const handleAddOpportunity = () => {
    if (currentOpportunity.title && currentOpportunity.explanation) {
      setOpportunities([
        ...opportunities,
        currentOpportunity as OpportunityData
      ]);
      setCurrentOpportunity({
        evidenceQuotes: [],
        triggerEvents: [],
        earlyIndicators: []
      });
    }
  };

  const handleGenerateReport = async () => {
    if (!clientName || opportunities.length === 0) {
      alert('Please enter a client name and add at least one opportunity');
      return;
    }
    
    setLoading(true);
    try {
      await generateReportDocument(clientName, opportunities);
      alert('Report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const handleAddArrayField = (field: 'evidenceQuotes' | 'triggerEvents' | 'earlyIndicators', value: string) => {
    setCurrentOpportunity(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), value]
    }));
  };

  return (
    <div className="report-generator">
      <h1>Strategic Foresight Report Generator</h1>
      
      <div className="client-info">
        <label htmlFor="clientName">Client Name:</label>
        <input
          id="clientName"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name"
        />
      </div>

      <div className="opportunity-form">
        <h2>Add Opportunities (Required: 10)</h2>
        <p>Current: {opportunities.length}/10</p>

        <div className="form-field">
          <label htmlFor="title">Opportunity Title:</label>
          <input
            id="title"
            type="text"
            value={currentOpportunity.title || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, title: e.target.value})}
            placeholder="Enter opportunity title"
          />
        </div>

        <div className="form-field">
          <label htmlFor="explanation">Detailed Explanation:</label>
          <textarea
            id="explanation"
            value={currentOpportunity.explanation || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, explanation: e.target.value})}
            placeholder="Provide detailed explanation"
            rows={4}
          />
        </div>

        <div className="form-field">
          <label htmlFor="segmentSizing">Segment Sizing:</label>
          <textarea
            id="segmentSizing"
            value={currentOpportunity.segmentSizing || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, segmentSizing: e.target.value})}
            placeholder="Describe segment sizing"
            rows={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="strategicRelevance">Strategic Relevance:</label>
          <textarea
            id="strategicRelevance"
            value={currentOpportunity.strategicRelevance || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, strategicRelevance: e.target.value})}
            placeholder="Explain strategic relevance"
            rows={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="marketMapping">Market Mapping:</label>
          <textarea
            id="marketMapping"
            value={currentOpportunity.marketMapping || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, marketMapping: e.target.value})}
            placeholder="Provide market mapping analysis"
            rows={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="underservedSegmentStrategy">Underserved Segment Strategy:</label>
          <textarea
            id="underservedSegmentStrategy"
            value={currentOpportunity.underservedSegmentStrategy || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, underservedSegmentStrategy: e.target.value})}
            placeholder="Describe strategy for underserved segments"
            rows={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="scenarioModeling">Scenario Modeling:</label>
          <textarea
            id="scenarioModeling"
            value={currentOpportunity.scenarioModeling || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, scenarioModeling: e.target.value})}
            placeholder="Detail scenario modeling"
            rows={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="regulatoryContext">Regulatory Context:</label>
          <textarea
            id="regulatoryContext"
            value={currentOpportunity.regulatoryContext || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, regulatoryContext: e.target.value})}
            placeholder="Describe regulatory context"
            rows={3}
          />
        </div>

        <div className="form-field">
          <label htmlFor="scoring">Scoring (0-100):</label>
          <input
            id="scoring"
            type="number"
            min="0"
            max="100"
            value={currentOpportunity.scoring || ''}
            onChange={(e) => setCurrentOpportunity({...currentOpportunity, scoring: parseInt(e.target.value) || 0})}
            placeholder="Enter score"
          />
        </div>

        <button onClick={handleAddOpportunity} className="btn-add">
          Add Opportunity
        </button>
      </div>

      {opportunities.length > 0 && (
        <div className="opportunities-list">
          <h3>Added Opportunities:</h3>
          <ul>
            {opportunities.map((opp, idx) => (
              <li key={idx}>{idx + 1}. {opp.title}</li>
            ))}
          </ul>
        </div>
      )}

      <button 
        onClick={handleGenerateReport} 
        disabled={loading || opportunities.length === 0 || !clientName}
        className="btn-generate"
      >
        {loading ? 'Generating...' : 'Generate Report'}
      </button>
    </div>
  );
};
