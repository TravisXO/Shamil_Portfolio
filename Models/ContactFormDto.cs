using System.ComponentModel.DataAnnotations;

namespace Shamil_Portfolio.Models
{
    /// <summary>
    /// Data Transfer Object for the contact form with strict validation.
    /// </summary>
    public class ContactFormDto
    {
        [Required(ErrorMessage = "CODENAME_REQUIRED")]
        [StringLength(100, ErrorMessage = "ID_TOO_LONG")]
        [RegularExpression(@"^[a-zA-Z0-9\s]*$", ErrorMessage = "INVALID_CHARACTERS_IN_ID")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "FREQUENCY_REQUIRED")]
        [EmailAddress(ErrorMessage = "INVALID_FREQUENCY_FORMAT")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "PAYLOAD_REQUIRED")]
        [StringLength(2000, ErrorMessage = "PAYLOAD_TOO_LARGE")]
        public string Message { get; set; } = string.Empty;
    }
}