-- Stored Procedures for Loan Eligibility System

-- Procedure to calculate EMI
CREATE OR ALTER PROCEDURE sp_CalculateEMI
    @LoanAmount DECIMAL(18,2),
    @InterestRate DECIMAL(5,2),
    @TenureInMonths INT,
    @EMI DECIMAL(18,2) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @MonthlyInterestRate DECIMAL(18,10);
    DECLARE @PowerTerm DECIMAL(18,10);
    
    SET @MonthlyInterestRate = @InterestRate / 100.0 / 12.0;
    
    IF @MonthlyInterestRate > 0
    BEGIN
        SET @PowerTerm = POWER((1 + @MonthlyInterestRate), @TenureInMonths);
        SET @EMI = @LoanAmount * @MonthlyInterestRate * @PowerTerm / (@PowerTerm - 1);
    END
    ELSE
    BEGIN
        SET @EMI = @LoanAmount / @TenureInMonths;
    END
    
    SET @EMI = ROUND(@EMI, 2);
END
GO

-- Procedure to determine risk level
CREATE OR ALTER PROCEDURE sp_DetermineRiskLevel
    @EMIToIncomeRatio DECIMAL(5,2),
    @RiskLevel NVARCHAR(20) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    IF @EMIToIncomeRatio <= 30
        SET @RiskLevel = 'Low Risk';
    ELSE IF @EMIToIncomeRatio <= 40
        SET @RiskLevel = 'Medium Risk';
    ELSE
        SET @RiskLevel = 'High Risk';
END
GO

-- Procedure to check loan eligibility
CREATE OR ALTER PROCEDURE sp_CheckLoanEligibility
    @LoanAmount DECIMAL(18,2),
    @InterestRate DECIMAL(5,2),
    @TenureInMonths INT,
    @MonthlyIncome DECIMAL(18,2),
    @EMI DECIMAL(18,2) OUTPUT,
    @IsEligible BIT OUTPUT,
    @RiskLevel NVARCHAR(20) OUTPUT,
    @EMIToIncomeRatio DECIMAL(5,2) OUTPUT,
    @Message NVARCHAR(500) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Calculate EMI
    EXEC sp_CalculateEMI @LoanAmount, @InterestRate, @TenureInMonths, @EMI OUTPUT;
    
    -- Calculate EMI to Income ratio
    SET @EMIToIncomeRatio = ROUND((@EMI / @MonthlyIncome) * 100, 2);
    
    -- Determine eligibility
    SET @IsEligible = CASE WHEN @EMIToIncomeRatio <= 40 THEN 1 ELSE 0 END;
    
    -- Determine risk level
    EXEC sp_DetermineRiskLevel @EMIToIncomeRatio, @RiskLevel OUTPUT;
    
    -- Generate message
    IF @IsEligible = 1
        SET @Message = CONCAT('Loan approved with ', @RiskLevel, '. EMI to income ratio: ', @EMIToIncomeRatio, '%');
    ELSE
        SET @Message = CONCAT('Loan not eligible. EMI to income ratio (', @EMIToIncomeRatio, '%) exceeds 40% limit.');
END
GO

-- Procedure to save loan application
CREATE OR ALTER PROCEDURE sp_SaveLoanApplication
    @LoanAmount DECIMAL(18,2),
    @InterestRate DECIMAL(5,2),
    @TenureInMonths INT,
    @MonthlyIncome DECIMAL(18,2),
    @EMI DECIMAL(18,2),
    @IsEligible BIT,
    @RiskLevel NVARCHAR(20),
    @EMIToIncomeRatio DECIMAL(5,2),
    @Message NVARCHAR(500),
    @ApplicationId INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    INSERT INTO LoanApplications (
        LoanAmount, 
        InterestRate, 
        TenureInMonths, 
        MonthlyIncome, 
        EMI, 
        IsEligible, 
        RiskLevel, 
        EMIToIncomeRatio, 
        Message, 
        CreatedAt
    )
    VALUES (
        @LoanAmount, 
        @InterestRate, 
        @TenureInMonths, 
        @MonthlyIncome, 
        @EMI, 
        @IsEligible, 
        @RiskLevel, 
        @EMIToIncomeRatio, 
        @Message, 
        GETUTCDATE()
    );
    
    SET @ApplicationId = SCOPE_IDENTITY();
END
GO

-- Procedure to get loan application by ID
CREATE OR ALTER PROCEDURE sp_GetLoanApplicationById
    @ApplicationId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        LoanAmount,
        InterestRate,
        TenureInMonths,
        MonthlyIncome,
        EMI,
        IsEligible,
        RiskLevel,
        EMIToIncomeRatio,
        Message,
        CreatedAt
    FROM LoanApplications
    WHERE Id = @ApplicationId;
END
GO

-- Procedure to get all loan applications
CREATE OR ALTER PROCEDURE sp_GetAllLoanApplications
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        Id,
        LoanAmount,
        InterestRate,
        TenureInMonths,
        MonthlyIncome,
        EMI,
        IsEligible,
        RiskLevel,
        EMIToIncomeRatio,
        Message,
        CreatedAt
    FROM LoanApplications
    ORDER BY CreatedAt DESC;
END
GO

-- Procedure to get loan statistics
CREATE OR ALTER PROCEDURE sp_GetLoanStatistics
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        COUNT(*) as TotalApplications,
        SUM(CASE WHEN IsEligible = 1 THEN 1 ELSE 0 END) as ApprovedApplications,
        SUM(CASE WHEN IsEligible = 0 THEN 1 ELSE 0 END) as RejectedApplications,
        SUM(CASE WHEN RiskLevel = 'Low Risk' THEN 1 ELSE 0 END) as LowRiskApplications,
        SUM(CASE WHEN RiskLevel = 'Medium Risk' THEN 1 ELSE 0 END) as MediumRiskApplications,
        SUM(CASE WHEN RiskLevel = 'High Risk' THEN 1 ELSE 0 END) as HighRiskApplications,
        AVG(LoanAmount) as AvgLoanAmount,
        AVG(EMI) as AvgEMI,
        AVG(EMIToIncomeRatio) as AvgEMIToIncomeRatio
    FROM LoanApplications;
END
GO 