import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import LoanForm from './components/LoanForm';
import LoanResults from './components/LoanResults';
import SuccessPopup from './components/SuccessPopup';
import { LoanService } from './services/LoanService';
import { LoanRequest, LoanEligibilityResponse } from './types/LoanTypes';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'form' | 'results'>('landing');
  const [loanResult, setLoanResult] = useState<LoanEligibilityResponse | null>(null);
  const [currentRequest, setCurrentRequest] = useState<LoanRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [applicationId, setApplicationId] = useState<number | null>(null);

  const handleGetStarted = () => {
    setCurrentView('form');
    setError(null);
  };

  const handleLoanSubmit = async (request: LoanRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await LoanService.calculateLoanEligibility(request);
      setLoanResult(result);
      setCurrentRequest(request);
      setCurrentView('results');
    } catch (error: any) {
      console.error('Error calculating loan eligibility:', error);
      setError(
        error.response?.data?.message || 
        'Failed to calculate loan eligibility. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleApplyLoan = async () => {
    if (!currentRequest) return;
    
    setApplying(true);
    setError(null);
    
    try {
      const application = await LoanService.applyForLoan(currentRequest);
      setApplicationId(application.id);
      setShowSuccessPopup(true);
    } catch (error: any) {
      console.error('Error applying for loan:', error);
      setError(
        error.response?.data?.message || 
        'Failed to submit loan application. Please try again.'
      );
    } finally {
      setApplying(false);
    }
  };

  const handleCloseSuccessPopup = () => {
    setShowSuccessPopup(false);
    setApplicationId(null);
  };

  const handleNewCalculation = () => {
    setCurrentView('form');
    setLoanResult(null);
    setCurrentRequest(null);
    setError(null);
    setShowSuccessPopup(false);
    setApplicationId(null);
  };

  const handleBackToLanding = () => {
    setCurrentView('landing');
    setLoanResult(null);
    setCurrentRequest(null);
    setError(null);
    setShowSuccessPopup(false);
    setApplicationId(null);
  };

  return (
    <div className="App">
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button 
              className="error-close"
              onClick={() => setError(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {currentView === 'landing' && (
        <LandingPage onGetStarted={handleGetStarted} />
      )}

      {currentView === 'form' && (
        <div className="form-container">
          <button className="back-button" onClick={handleBackToLanding}>
            ← Back to Home
          </button>
          <LoanForm 
            onSubmit={handleLoanSubmit} 
            loading={loading}
          />
        </div>
      )}

      {currentView === 'results' && loanResult && (
        <div className="results-container">
          <button className="back-button" onClick={handleBackToLanding}>
            ← Back to Home
          </button>
          <LoanResults 
            result={loanResult}
            onNewCalculation={handleNewCalculation}
            onApplyLoan={handleApplyLoan}
            applying={applying}
          />
        </div>
      )}

      <SuccessPopup
        isVisible={showSuccessPopup}
        applicationId={applicationId}
        onClose={handleCloseSuccessPopup}
      />
    </div>
  );
}

export default App;
