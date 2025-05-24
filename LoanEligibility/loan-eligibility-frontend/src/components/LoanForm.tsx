import React, { useState } from 'react';
import { LoanRequest } from '../types/LoanTypes';
import './LoanForm.css';

interface LoanFormProps {
  onSubmit: (request: LoanRequest) => void;
  loading: boolean;
}

const LoanForm: React.FC<LoanFormProps> = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState<LoanRequest>({
    loanAmount: 0,
    interestRate: 0,
    tenureInMonths: 0,
    monthlyIncome: 0,
  });

  const [errors, setErrors] = useState<Partial<LoanRequest>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof LoanRequest]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<LoanRequest> = {};

    if (formData.loanAmount < 1000 || formData.loanAmount > 100000000) {
      newErrors.loanAmount = 1000;
    }

    if (formData.interestRate < 0.1 || formData.interestRate > 30) {
      newErrors.interestRate = 0.1;
    }

    if (formData.tenureInMonths < 1 || formData.tenureInMonths > 360) {
      newErrors.tenureInMonths = 1;
    }

    if (formData.monthlyIncome < 1000 || formData.monthlyIncome > 10000000) {
      newErrors.monthlyIncome = 1000;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="loan-form-container">
      <div className="loan-form-card">
        <h2 className="form-title">Loan Eligibility Calculator</h2>
        <p className="form-subtitle">Enter your loan details to check eligibility</p>
        
        <form onSubmit={handleSubmit} className="loan-form">
          <div className="form-group">
            <label htmlFor="loanAmount" className="form-label">
              Loan Amount (LKR)
            </label>
            <input
              type="number"
              id="loanAmount"
              name="loanAmount"
              value={formData.loanAmount || ''}
              onChange={handleChange}
              className={`form-input ${errors.loanAmount ? 'error' : ''}`}
              placeholder="Enter loan amount (1,000 - 100,000,000)"
              min="1000"
              max="100000000"
              step="1000"
              required
            />
            {errors.loanAmount && (
              <span className="error-message">
                Loan amount must be between LKR 1,000 and LKR 100,000,000
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="interestRate" className="form-label">
              Interest Rate (% per annum)
            </label>
            <input
              type="number"
              id="interestRate"
              name="interestRate"
              value={formData.interestRate || ''}
              onChange={handleChange}
              className={`form-input ${errors.interestRate ? 'error' : ''}`}
              placeholder="Enter interest rate (0.1% - 30%)"
              min="0.1"
              max="30"
              step="0.1"
              required
            />
            {errors.interestRate && (
              <span className="error-message">
                Interest rate must be between 0.1% and 30%
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="tenureInMonths" className="form-label">
              Tenure (Months)
            </label>
            <input
              type="number"
              id="tenureInMonths"
              name="tenureInMonths"
              value={formData.tenureInMonths || ''}
              onChange={handleChange}
              className={`form-input ${errors.tenureInMonths ? 'error' : ''}`}
              placeholder="Enter tenure in months (1 - 360)"
              min="1"
              max="360"
              required
            />
            {errors.tenureInMonths && (
              <span className="error-message">
                Tenure must be between 1 and 360 months
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="monthlyIncome" className="form-label">
              Monthly Income (LKR)
            </label>
            <input
              type="number"
              id="monthlyIncome"
              name="monthlyIncome"
              value={formData.monthlyIncome || ''}
              onChange={handleChange}
              className={`form-input ${errors.monthlyIncome ? 'error' : ''}`}
              placeholder="Enter monthly income (1,000 - 10,000,000)"
              min="1000"
              max="10000000"
              step="1000"
              required
            />
            {errors.monthlyIncome && (
              <span className="error-message">
                Monthly income must be between LKR 1,000 and LKR 10,000,000
              </span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <span className="loading-spinner">
                  <span className="spinner"></span>
                  Calculating...
                </span>
              ) : (
                'Calculate Eligibility'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoanForm; 