using System.ComponentModel.DataAnnotations;

namespace LoanEligibilityAPI.Models
{
    public class LoanRequest
    {
        [Required]
        [Range(1000, 100000000, ErrorMessage = "Loan amount must be between LKR 1,000 and LKR 100,000,000")]
        public decimal LoanAmount { get; set; }

        [Required]
        [Range(0.1, 30, ErrorMessage = "Interest rate must be between 0.1% and 30%")]
        public decimal InterestRate { get; set; }

        [Required]
        [Range(1, 360, ErrorMessage = "Tenure must be between 1 and 360 months")]
        public int TenureInMonths { get; set; }

        [Required]
        [Range(1000, 10000000, ErrorMessage = "Monthly income must be between LKR 1,000 and LKR 10,000,000")]
        public decimal MonthlyIncome { get; set; }
    }
} 