# Loan Eligibility System - Sri Lanka

A comprehensive loan eligibility system built with React frontend, ASP.NET Core backend, and MS SQL Server database. The system calculates EMI (Equated Monthly Installment) and determines loan eligibility based on income-to-EMI ratio with risk assessment, specifically designed for the Sri Lankan market.

## 🚀 Features

### Functional Requirements ✅
- **Landing Page**: Professional introduction with system overview and features
- **Customer Input**: Loan amount, interest rate, tenure, and monthly income
- **Loan Eligibility Check**: EMI ≤ 40% of income rule
- **EMI Calculation**: Accurate EMI calculation using standard formula
- **Risk Categorization**:
  - Low Risk: EMI ≤ 30% of income
  - Medium Risk: 30% < EMI ≤ 40% of income
  - High Risk: EMI > 40% of income (Not Eligible)
- **Output Summary**: EMI, eligibility status, and risk level
- **Currency**: All calculations in Sri Lankan Rupees (LKR)
- **Success Popup**: Professional modal popup for successful loan applications

### Technical Features
- **Modern React Frontend** with TypeScript and Landing Page
- **RESTful API** with ASP.NET Core
- **MS SQL Server** database with stored procedures
- **JSON Output Format**
- **Responsive Design** with modern UI/UX
- **Real-time Validation**
- **Error Handling** and loading states
- **CORS Configuration** for cross-origin requests
- **Navigation Flow**: Landing → Form → Results
- **Animated Success Modal** with application details and next steps



## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **.NET 8 SDK**
- **SQL Server** (LocalDB or SQL Server Express)
- **Visual Studio Code** or **Visual Studio**

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd loan-eligibility-system
```

### 2. Backend Setup (ASP.NET Core API)

#### Navigate to API Directory
```bash
cd LoanEligibilityAPI
```

#### Restore NuGet Packages
```bash
dotnet restore
```

#### Update Database Connection String
Edit `appsettings.json` and `appsettings.Development.json` with your SQL Server connection string:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Data Source=(localdb)\\MSSQLLocalDB;Initial Catalog=LoanEligibilityDB;Integrated Security=true;TrustServerCertificate=true;"
  }
}
```

#### Create Database and Tables
The application will automatically create the database and tables on first run using Entity Framework Code First approach.

#### Run the API
```bash
dotnet run
```

The API will be available at:
- **HTTPS**: `https://localhost:5180`
- **HTTP**: `http://localhost:5000`
- **Swagger UI**: `https://localhost:5180` (root URL)

### 3. Frontend Setup (React)

#### Navigate to Frontend Directory
```bash
cd loan-eligibility-frontend
```

#### Install Dependencies
```bash
npm install
```

#### Configure API URL
The `.env` file is already configured to point to `https://localhost:5180/api`. Update if needed:

```env
REACT_APP_API_URL=https://localhost:5180/api
```

#### Start the Development Server
```bash
npm start
```

The frontend will be available at `http://localhost:3000`

### 4. Database Setup (Optional - Manual)

If you prefer to set up the database manually, execute the stored procedures from:
```
LoanEligibilityAPI/Database/StoredProcedures.sql
```

## 📚 API Documentation

### Base URL
```
https://localhost:5180/api/LoanEligibility
```

### Endpoints

#### 1. Calculate Loan Eligibility
**POST** `/calculate`

Calculate loan eligibility without saving to database.

**Request Body:**
```json
{
  "loanAmount": 500000,
  "interestRate": 8.5,
  "tenureInMonths": 240,
  "monthlyIncome": 50000
}
```

**Response:**
```json
{
  "emi": 4307.47,
  "isEligible": true,
  "riskLevel": "Low Risk",
  "emiToIncomeRatio": 8.61,
  "message": "Loan approved with Low Risk. EMI to income ratio: 8.61%",
  "calculatedAt": "2024-01-15T10:30:00Z"
}
```

#### 2. Apply for Loan
**POST** `/apply`

Calculate eligibility and save application to database.

**Request Body:** Same as calculate endpoint

**Response:**
```json
{
  "id": 1,
  "loanAmount": 500000,
  "interestRate": 8.5,
  "tenureInMonths": 240,
  "monthlyIncome": 50000,
  "emi": 4307.47,
  "isEligible": true,
  "riskLevel": "Low Risk",
  "emiToIncomeRatio": 8.61,
  "message": "Loan approved with Low Risk. EMI to income ratio: 8.61%",
  "createdAt": "2024-01-15T10:30:00Z"
}
```

#### 3. Get All Applications
**GET** `/applications`

Retrieve all loan applications.

#### 4. Get Application by ID
**GET** `/applications/{id}`

Retrieve specific loan application.

#### 5. Health Check
**GET** `/health`

Check API health status.

## 🧮 EMI Calculation Formula

The system uses the standard EMI calculation formula:

```
EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
```

Where:
- **P** = Principal (Loan Amount)
- **R** = Monthly Interest Rate (Annual Rate / 12 / 100)
- **N** = Number of months (Tenure)

## 🎯 Business Rules

### Eligibility Criteria
- **Eligible**: EMI ≤ 40% of monthly income
- **Not Eligible**: EMI > 40% of monthly income

### Risk Assessment
- **Low Risk**: EMI ≤ 30% of monthly income
- **Medium Risk**: 30% < EMI ≤ 40% of monthly income
- **High Risk**: EMI > 40% of monthly income

### Validation Rules
- **Loan Amount**: LKR 1,000 - LKR 100,000,000
- **Interest Rate**: 0.1% - 30% per annum
- **Tenure**: 1 - 360 months
- **Monthly Income**: LKR 1,000 - LKR 10,000,000

## 🗄️ Database Schema

### LoanApplications Table
```sql
CREATE TABLE LoanApplications (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    LoanAmount DECIMAL(18,2) NOT NULL,
    InterestRate DECIMAL(5,2) NOT NULL,
    TenureInMonths INT NOT NULL,
    MonthlyIncome DECIMAL(18,2) NOT NULL,
    EMI DECIMAL(18,2) NOT NULL,
    IsEligible BIT NOT NULL,
    RiskLevel NVARCHAR(20) NOT NULL,
    EMIToIncomeRatio DECIMAL(5,2) NOT NULL,
    Message NVARCHAR(500),
    CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE()
);
```

### Stored Procedures
- `sp_CalculateEMI` - Calculate EMI amount
- `sp_DetermineRiskLevel` - Determine risk level
- `sp_CheckLoanEligibility` - Complete eligibility check
- `sp_SaveLoanApplication` - Save application
- `sp_GetLoanApplicationById` - Get application by ID
- `sp_GetAllLoanApplications` - Get all applications
- `sp_GetLoanStatistics` - Get application statistics

## 🎨 Frontend Features

### Modern UI/UX
- **Responsive Design** - Works on all devices
- **Modern Styling** - Gradient backgrounds and smooth animations
- **Loading States** - Visual feedback during API calls
- **Error Handling** - User-friendly error messages
- **Form Validation** - Real-time input validation

### Components
- **LoanForm** - Input form with validation
- **LoanResults** - Results display with actions
- **Error Banner** - Global error display

## 🔧 Development

### Backend Development
```bash
cd LoanEligibilityAPI
dotnet watch run
```

### Frontend Development
```bash
cd loan-eligibility-frontend
npm start
```

### Building for Production

#### Backend
```bash
dotnet publish -c Release
```

#### Frontend
```bash
npm run build
```

## 🧪 Testing

### API Testing
Use the built-in Swagger UI at `https://localhost:5180` to test all endpoints.

### Sample Test Data
```json
{
  "loanAmount": 1000000,
  "interestRate": 12.5,
  "tenureInMonths": 120,
  "monthlyIncome": 75000
}
```

Expected Result:
- EMI: ≈ LKR 14,347
- EMI to Income Ratio: ≈ 19.13%
- Risk Level: Low Risk
- Eligibility: Approved


**Built with ❤️ using React, ASP.NET Core, and SQL Server** 