using Microsoft.EntityFrameworkCore;
using LoanEligibilityAPI.Models;

namespace LoanEligibilityAPI.Data
{
    public class LoanEligibilityContext : DbContext
    {
        public LoanEligibilityContext(DbContextOptions<LoanEligibilityContext> options) : base(options)
        {
        }

        public DbSet<LoanApplication> LoanApplications { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<LoanApplication>(entity =>
            {
                entity.ToTable("LoanApplications");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).ValueGeneratedOnAdd();
                
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => new { e.IsEligible, e.RiskLevel });
            });

            base.OnModelCreating(modelBuilder);
        }
    }
} 