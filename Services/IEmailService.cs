using System.Threading.Tasks;
using Shamil_Portfolio.Models;

namespace Shamil_Portfolio.Services
{
    public interface IEmailService
    {
        /// <summary>
        /// Sends a contact request email via the configured provider.
        /// </summary>
        Task<bool> SendContactEmailAsync(ContactFormDto contactData);
    }
}