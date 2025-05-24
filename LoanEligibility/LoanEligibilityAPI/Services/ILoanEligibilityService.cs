using LoanEligibilityAPI.Models;

namespace LoanEligibilityAPI.Services
{
    public interface ILoanEligibilityService
    {
        Task<LoanEligibilityResponse> CalculateLoanEligibilityAsync(LoanRequest request);
        Task<LoanApplication> SaveLoanApplicationAsync(LoanRequest request, LoanEligibilityResponse response);
        Task<List<LoanApplication>> GetAllLoanApplicationsAsync();
        Task<LoanApplication?> GetLoanApplicationByIdAsync(int id);
    }
} 