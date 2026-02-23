using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Shamil_Portfolio.Models;
using Shamil_Portfolio.Services;

namespace Shamil_Portfolio.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IEmailService _emailService;

        public HomeController(ILogger<HomeController> logger, IEmailService emailService)
        {
            _logger = logger;
            _emailService = emailService;
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Contact([FromBody] ContactFormDto model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { status = "VALIDATION_ERROR", message = "VALIDATION_FAILED", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            var success = await _emailService.SendContactEmailAsync(model);

            if (success)
            {
                return Ok(new { status = "SUCCESS", message = "TRANSMISSION_COMPLETE" });
            }

            return StatusCode(500, new { status = "ERROR", message = "SYSTEM_FAILURE_DURING_TRANSMISSION" });
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}