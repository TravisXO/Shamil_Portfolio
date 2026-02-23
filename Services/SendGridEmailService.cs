using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SendGrid;
using SendGrid.Helpers.Mail;
using Shamil_Portfolio.Models;

namespace Shamil_Portfolio.Services
{
    public class SendGridEmailService : IEmailService
    {
        private readonly IConfiguration _configuration;
        private readonly ILogger<SendGridEmailService> _logger;

        public SendGridEmailService(IConfiguration configuration, ILogger<SendGridEmailService> logger)
        {
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<bool> SendContactEmailAsync(ContactFormDto contactData)
        {
            try
            {
                var apiKey = _configuration["SendGrid:ApiKey"];
                var fromEmail = _configuration["SendGrid:FromEmail"];
                var toEmail = _configuration["SendGrid:ToEmail"];

                if (string.IsNullOrEmpty(apiKey)) throw new Exception("SENDGRID_API_KEY_MISSING");

                var client = new SendGridClient(apiKey);
                var from = new EmailAddress(fromEmail, "Portfolio System");
                var to = new EmailAddress(toEmail, "Alexander Shamil");

                var subject = $"[UPLINK] New Message from {contactData.Name}";
                var plainTextContent = $"Name: {contactData.Name}\nEmail: {contactData.Email}\n\nMessage:\n{contactData.Message}";
                var htmlContent = $"<strong>Uplink Received</strong><br><strong>From:</strong> {contactData.Name} ({contactData.Email})<br><br><strong>Message:</strong><br>{contactData.Message}";

                var msg = MailHelper.CreateSingleEmail(from, to, subject, plainTextContent, htmlContent);
                var response = await client.SendEmailAsync(msg);

                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInformation("Transmission successful for {Email}", contactData.Email);
                    return true;
                }

                _logger.LogError("SendGrid failed with status {Status}", response.StatusCode);
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Critical failure in communication service for {Email}", contactData.Email);
                return false;
            }
        }
    }
}