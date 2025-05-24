namespace LoanEligibilityAPI.Models
{
    public class LoanEligibilityResponse
    {
        public decimal EMI { get; set; }
        public bool IsEligible { get; set; }
        public string RiskLevel { get; set; } = string.Empty;
        public decimal EMIToIncomeRatio { get; set; }
        public string Message { get; set; } = string.Empty;
        public DateTime CalculatedAt { get; set; }
    }
} 