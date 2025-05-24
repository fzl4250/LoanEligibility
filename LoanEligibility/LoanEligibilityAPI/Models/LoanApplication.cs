using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LoanEligibilityAPI.Models
{
    public class LoanApplication
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal LoanAmount { get; set; }

        [Required]
        [Column(TypeName = "decimal(5,2)")]
        public decimal InterestRate { get; set; }

        [Required]
        public int TenureInMonths { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal MonthlyIncome { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal EMI { get; set; }

        public bool IsEligible { get; set; }

        [StringLength(20)]
        public string RiskLevel { get; set; } = string.Empty;

        [Column(TypeName = "decimal(5,2)")]
        public decimal EMIToIncomeRatio { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [StringLength(500)]
        public string? Message { get; set; }
    }
} 