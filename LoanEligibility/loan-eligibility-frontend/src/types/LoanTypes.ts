export interface LoanRequest {
  loanAmount: number;
  interestRate: number;
  tenureInMonths: number;
  monthlyIncome: number;
}

export interface LoanEligibilityResponse {
  emi: number;
  isEligible: boolean;
  riskLevel: string;
  emiToIncomeRatio: number;
  message: string;
  calculatedAt: string;
}

export interface LoanApplication {
  id: number;
  loanAmount: number;
  interestRate: number;
  tenureInMonths: number;
  monthlyIncome: number;
  emi: number;
  isEligible: boolean;
  riskLevel: string;
  emiToIncomeRatio: number;
  message: string;
  createdAt: string;
} 