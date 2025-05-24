import React from 'react';
import './SuccessPopup.css';

interface SuccessPopupProps {
  isVisible: boolean;
  applicationId: number | null;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ isVisible, applicationId, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="popup-header">
          <div className="success-icon">
            <div className="checkmark">
              <div className="checkmark-circle">
                <div className="checkmark-stem"></div>
                <div className="checkmark-kick"></div>
              </div>
            </div>
          </div>
          <h2 className="popup-title">Application Submitted Successfully!</h2>
        </div>
        
        <div className="popup-content">
          <div className="application-details">
            <div className="detail-item">
              <span className="detail-label">Application ID</span>
              <span className="detail-value">#{applicationId}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value status-approved">Under Review</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Submitted On</span>
              <span className="detail-value">{new Date().toLocaleDateString('en-LK')}</span>
            </div>
          </div>
          
          <div className="info-box">
            <div className="info-icon">ℹ️</div>
            <div className="info-text">
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>Our team will review your application within 2-3 business days</li>
                <li>You will receive an email confirmation shortly</li>
                <li>We may contact you for additional documentation if needed</li>
                <li>Final approval decision will be communicated via email and SMS</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="popup-actions">
          <button className="primary-button" onClick={onClose}>
            Continue
          </button>
          <button className="secondary-button" onClick={() => window.print()}>
            <span className="button-icon">🖨️</span>
            Print Details
          </button>
        </div>
        
        <button className="close-button" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default SuccessPopup; 