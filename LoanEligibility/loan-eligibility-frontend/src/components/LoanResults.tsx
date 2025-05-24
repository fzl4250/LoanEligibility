import React from 'react';
import { LoanEligibilityResponse } from '../types/LoanTypes';
import './LoanResults.css';

interface LoanResultsProps {
  result: LoanEligibilityResponse;
  onNewCalculation: () => void;
  onApplyLoan: () => void;
  applying: boolean;
}

const LoanResults: React.FC<LoanResultsProps> = ({ 
  result, 
  onNewCalculation, 
  onApplyLoan, 
  applying 
}) => {
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getRiskLevelColor = (riskLevel: string): string => {
    switch (riskLevel.toLowerCase()) {
      case 'low risk':
        return '#48bb78';
      case 'medium risk':
        return '#ed8936';
      case 'high risk':
        return '#e53e3e';
      default:
        return '#718096';
    }
  };

  const getRiskLevelIcon = (riskLevel: string): string => {
    switch (riskLevel.toLowerCase()) {
      case 'low risk':
        return '✅';
      case 'medium risk':
        return '⚠️';
      case 'high risk':
        return '❌';
      default:
        return '❓';
    }
  };

  return (
    <div className="loan-results-container">
      <div className="loan-results-card">
        <div className="results-header">
          <div className={`eligibility-status ${result.isEligible ? 'eligible' : 'not-eligible'}`}>
            <span className="status-icon">
              {result.isEligible ? '✅' : '❌'}
            </span>
            <h2 className="status-title">
              {result.isEligible ? 'Loan Approved!' : 'Loan Not Eligible'}
            </h2>
          </div>
        </div>

        <div className="results-content">
          <div className="result-item main-result">
            <div className="result-label">Monthly EMI</div>
            <div className="result-value emi-value">
              {formatCurrency(result.emi)}
            </div>
          </div>

          <div className="results-grid">
            <div className="result-item">
              <div className="result-label">EMI to Income Ratio</div>
              <div className="result-value">
                {result.emiToIncomeRatio.toFixed(2)}%
              </div>
            </div>

            <div className="result-item">
              <div className="result-label">Risk Level</div>
              <div 
                className="result-value risk-level"
                style={{ color: getRiskLevelColor(result.riskLevel) }}
              >
                <span className="risk-icon">
                  {getRiskLevelIcon(result.riskLevel)}
                </span>
                {result.riskLevel}
              </div>
            </div>
          </div>

          <div className="message-section">
            <div className="message-content">
              <p className="result-message">{result.message}</p>
            </div>
          </div>

          <div className="calculation-info">
            <p className="calculation-time">
              Calculated on: {new Date(result.calculatedAt).toLocaleString('en-LK')}
            </p>
          </div>
        </div>

        <div className="results-actions">
          {result.isEligible && (
            <button
              onClick={onApplyLoan}
              className="apply-button"
              disabled={applying}
            >
              {applying ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Applying...
                </span>
              ) : (
                'Apply for Loan'
              )}
            </button>
          )}
          
          <button
            onClick={onNewCalculation}
            className="new-calculation-button"
          >
            New Calculation
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoanResults; 