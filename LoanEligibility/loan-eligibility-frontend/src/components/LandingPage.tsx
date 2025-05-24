import React from 'react';
import './LandingPage.css';

interface LandingPageProps {
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  return (
    <div className="landing-page">
      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Loan Eligibility Calculator
              <span className="hero-subtitle">for Sri Lanka</span>
            </h1>
            <p className="hero-description">
              Check your loan eligibility instantly with our advanced EMI calculator. 
              Get real-time risk assessment and make informed financial decisions.
            </p>
            
            <div className="features-grid">
              <div className="feature-item">
                <div className="feature-icon">🏦</div>
                <div className="feature-text">
                  <h3>Instant Calculation</h3>
                  <p>Get your EMI and eligibility results in seconds</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">📊</div>
                <div className="feature-text">
                  <h3>Risk Assessment</h3>
                  <p>Understand your loan risk level with detailed analysis</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">
                  <h3>Secure & Private</h3>
                  <p>Your financial information is kept secure and confidential</p>
                </div>
              </div>
              
              <div className="feature-item">
                <div className="feature-icon">💱</div>
                <div className="feature-text">
                  <h3>LKR Currency</h3>
                  <p>Calculations in Sri Lankan Rupees with local rates</p>
                </div>
              </div>
            </div>

            <button className="cta-button" onClick={onGetStarted}>
              <span className="cta-text">Calculate My Eligibility</span>
              <span className="cta-arrow">&rarr;</span>
            </button>
          </div>
          
          <div className="hero-visual">
            <div className="calculator-preview">
              <div className="preview-header">
                <div className="preview-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
                <h4>Loan Calculator</h4>
              </div>
              <div className="preview-content">
                <div className="preview-field">
                  <label>Loan Amount</label>
                  <div className="preview-input">LKR 1,000,000</div>
                </div>
                <div className="preview-field">
                  <label>Interest Rate</label>
                  <div className="preview-input">12.5% p.a.</div>
                </div>
                <div className="preview-field">
                  <label>Tenure</label>
                  <div className="preview-input">120 months</div>
                </div>
                <div className="preview-result">
                  <div className="result-label">Monthly EMI</div>
                  <div className="result-value">LKR 14,347</div>
                  <div className="result-status eligible">✅ Eligible</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="info-content">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step-item">
              <div className="step-number">1</div>
              <h3>Enter Details</h3>
              <p>Provide your loan amount, interest rate, tenure, and monthly income</p>
            </div>
            <div className="step-item">
              <div className="step-number">2</div>
              <h3>Get Results</h3>
              <p>Receive instant EMI calculation and eligibility assessment</p>
            </div>
            <div className="step-item">
              <div className="step-number">3</div>
              <h3>Apply</h3>
              <p>If eligible, proceed with your loan application</p>
            </div>
          </div>
        </div>
      </div>

      <div className="eligibility-info">
        <div className="eligibility-content">
          <h2>Eligibility Criteria</h2>
          <div className="criteria-grid">
            <div className="criteria-item">
              <h4>EMI Ratio</h4>
              <p>Your EMI should not exceed 40% of your monthly income</p>
            </div>
            <div className="criteria-item">
              <h4>Risk Levels</h4>
              <div className="risk-levels">
                <div className="risk-item low">
                  <span className="risk-indicator"></span>
                  <span>Low Risk: &le;30% of income</span>
                </div>
                <div className="risk-item medium">
                  <span className="risk-indicator"></span>
                  <span>Medium Risk: 30-40% of income</span>
                </div>
                <div className="risk-item high">
                  <span className="risk-indicator"></span>
                  <span>High Risk: &gt;40% of income</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 