using LoanEligibilityAPI.Data;
using LoanEligibilityAPI.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanEligibilityAPI.Services
{
    public class LoanEligibilityService : ILoanEligibilityService
    {
        private readonly LoanEligibilityContext _context;

        public LoanEligibilityService(LoanEligibilityContext context)
        {
            _context = context;
        }

        public Task<LoanEligibilityResponse> CalculateLoanEligibilityAsync(LoanRequest request)
        {
            // Calculate EMI using the formula: EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
            // Where P = Principal (Loan Amount), R = Monthly Interest Rate, N = Number of months
            
            decimal monthlyInterestRate = request.InterestRate / 100 / 12;
            decimal emi = 0;

            if (monthlyInterestRate > 0)
            {
                double powerTerm = Math.Pow((double)(1 + monthlyInterestRate), request.TenureInMonths);
                emi = request.LoanAmount * monthlyInterestRate * (decimal)powerTerm / ((decimal)powerTerm - 1);
            }
            else
            {
                // If interest rate is 0, EMI is just the principal divided by tenure
                emi = request.LoanAmount / request.TenureInMonths;
            }

            // Round EMI to 2 decimal places
            emi = Math.Round(emi, 2);

            // Calculate EMI to Income ratio
            decimal emiToIncomeRatio = Math.Round((emi / request.MonthlyIncome) * 100, 2);

            // Determine eligibility and risk level
            bool isEligible = emiToIncomeRatio <= 40;
            string riskLevel = DetermineRiskLevel(emiToIncomeRatio);
            string message = GetEligibilityMessage(isEligible, emiToIncomeRatio, riskLevel);

            var response = new LoanEligibilityResponse
            {
                EMI = emi,
                IsEligible = isEligible,
                RiskLevel = riskLevel,
                EMIToIncomeRatio = emiToIncomeRatio,
                Message = message,
                CalculatedAt = DateTime.UtcNow
            };

            return Task.FromResult(response);
        }

        public async Task<LoanApplication> SaveLoanApplicationAsync(LoanRequest request, LoanEligibilityResponse response)
        {
            var loanApplication = new LoanApplication
            {
                LoanAmount = request.LoanAmount,
                InterestRate = request.InterestRate,
                TenureInMonths = request.TenureInMonths,
                MonthlyIncome = request.MonthlyIncome,
                EMI = response.EMI,
                IsEligible = response.IsEligible,
                RiskLevel = response.RiskLevel,
                EMIToIncomeRatio = response.EMIToIncomeRatio,
                Message = response.Message,
                CreatedAt = DateTime.UtcNow
            };

            _context.LoanApplications.Add(loanApplication);
            await _context.SaveChangesAsync();

            return loanApplication;
        }

        public async Task<List<LoanApplication>> GetAllLoanApplicationsAsync()
        {
            return await _context.LoanApplications
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<LoanApplication?> GetLoanApplicationByIdAsync(int id)
        {
            return await _context.LoanApplications
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        private string DetermineRiskLevel(decimal emiToIncomeRatio)
        {
            if (emiToIncomeRatio <= 30)
                return "Low Risk";
            else if (emiToIncomeRatio <= 40)
                return "Medium Risk";
            else
                return "High Risk";
        }

        private string GetEligibilityMessage(bool isEligible, decimal emiToIncomeRatio, string riskLevel)
        {
            if (isEligible)
            {
                return $"Loan approved with {riskLevel}. EMI to income ratio: {emiToIncomeRatio}%";
            }
            else
            {
                return $"Loan not eligible. EMI to income ratio ({emiToIncomeRatio}%) exceeds 40% limit.";
            }
        }
    }
} 