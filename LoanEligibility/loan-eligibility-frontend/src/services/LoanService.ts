import axios from 'axios';
import { LoanRequest, LoanEligibilityResponse, LoanApplication } from '../types/LoanTypes';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5180/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class LoanService {
  static async calculateLoanEligibility(request: LoanRequest): Promise<LoanEligibilityResponse> {
    try {
      const response = await api.post<LoanEligibilityResponse>('/LoanEligibility/calculate', request);
      return response.data;
    } catch (error) {
      console.error('Error calculating loan eligibility:', error);
      throw error;
    }
  }

  static async applyForLoan(request: LoanRequest): Promise<LoanApplication> {
    try {
      const response = await api.post<LoanApplication>('/LoanEligibility/apply', request);
      return response.data;
    } catch (error) {
      console.error('Error applying for loan:', error);
      throw error;
    }
  }

  static async getAllLoanApplications(): Promise<LoanApplication[]> {
    try {
      const response = await api.get<LoanApplication[]>('/LoanEligibility/applications');
      return response.data;
    } catch (error) {
      console.error('Error fetching loan applications:', error);
      throw error;
    }
  }

  static async getLoanApplicationById(id: number): Promise<LoanApplication> {
    try {
      const response = await api.get<LoanApplication>(`/LoanEligibility/applications/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching loan application:', error);
      throw error;
    }
  }

  static async checkApiHealth(): Promise<any> {
    try {
      const response = await api.get('/LoanEligibility/health');
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
} 