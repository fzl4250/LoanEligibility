using Microsoft.AspNetCore.Mvc;
using LoanEligibilityAPI.Models;
using LoanEligibilityAPI.Services;
using System.ComponentModel.DataAnnotations;

namespace LoanEligibilityAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class LoanEligibilityController : ControllerBase
    {
        private readonly ILoanEligibilityService _loanEligibilityService;
        private readonly ILogger<LoanEligibilityController> _logger;

        public LoanEligibilityController(ILoanEligibilityService loanEligibilityService, ILogger<LoanEligibilityController> logger)
        {
            _loanEligibilityService = loanEligibilityService;
            _logger = logger;
        }

        /// <summary>
        /// Calculate loan eligibility based on loan details
        /// </summary>
        /// <param name="request">Loan request details</param>
        /// <returns>Loan eligibility response with EMI and risk assessment</returns>
        [HttpPost("calculate")]
        [ProducesResponseType(typeof(LoanEligibilityResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LoanEligibilityResponse>> CalculateLoanEligibility([FromBody] LoanRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("Calculating loan eligibility for amount: {LoanAmount}, Interest: {InterestRate}%, Tenure: {Tenure} months", 
                    request.LoanAmount, request.InterestRate, request.TenureInMonths);

                var response = await _loanEligibilityService.CalculateLoanEligibilityAsync(request);
                
                _logger.LogInformation("Loan eligibility calculated. EMI: {EMI}, Eligible: {IsEligible}, Risk: {RiskLevel}", 
                    response.EMI, response.IsEligible, response.RiskLevel);

                return Ok(response);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error calculating loan eligibility");
                return StatusCode(500, "An error occurred while calculating loan eligibility.");
            }
        }

        /// <summary>
        /// Calculate and save loan application
        /// </summary>
        /// <param name="request">Loan request details</param>
        /// <returns>Saved loan application with ID</returns>
        [HttpPost("apply")]
        [ProducesResponseType(typeof(LoanApplication), StatusCodes.Status201Created)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LoanApplication>> ApplyForLoan([FromBody] LoanRequest request)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }

                _logger.LogInformation("Processing loan application for amount: {LoanAmount}", request.LoanAmount);

                var eligibilityResponse = await _loanEligibilityService.CalculateLoanEligibilityAsync(request);
                var loanApplication = await _loanEligibilityService.SaveLoanApplicationAsync(request, eligibilityResponse);

                _logger.LogInformation("Loan application saved with ID: {ApplicationId}", loanApplication.Id);

                return CreatedAtAction(nameof(GetLoanApplication), new { id = loanApplication.Id }, loanApplication);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error processing loan application");
                return StatusCode(500, "An error occurred while processing the loan application.");
            }
        }

        /// <summary>
        /// Get all loan applications
        /// </summary>
        /// <returns>List of all loan applications</returns>
        [HttpGet("applications")]
        [ProducesResponseType(typeof(List<LoanApplication>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<List<LoanApplication>>> GetAllLoanApplications()
        {
            try
            {
                var applications = await _loanEligibilityService.GetAllLoanApplicationsAsync();
                _logger.LogInformation("Retrieved {Count} loan applications", applications.Count);
                return Ok(applications);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving loan applications");
                return StatusCode(500, "An error occurred while retrieving loan applications.");
            }
        }

        /// <summary>
        /// Get specific loan application by ID
        /// </summary>
        /// <param name="id">Application ID</param>
        /// <returns>Loan application details</returns>
        [HttpGet("applications/{id}")]
        [ProducesResponseType(typeof(LoanApplication), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<LoanApplication>> GetLoanApplication([Range(1, int.MaxValue)] int id)
        {
            try
            {
                var application = await _loanEligibilityService.GetLoanApplicationByIdAsync(id);
                
                if (application == null)
                {
                    _logger.LogWarning("Loan application not found with ID: {ApplicationId}", id);
                    return NotFound($"Loan application with ID {id} not found.");
                }

                return Ok(application);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving loan application with ID: {ApplicationId}", id);
                return StatusCode(500, "An error occurred while retrieving the loan application.");
            }
        }

        /// <summary>
        /// Health check endpoint
        /// </summary>
        /// <returns>API health status</returns>
        [HttpGet("health")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        public ActionResult GetHealthStatus()
        {
            return Ok(new { Status = "Healthy", Timestamp = DateTime.UtcNow, Version = "1.0.0" });
        }
    }
} 