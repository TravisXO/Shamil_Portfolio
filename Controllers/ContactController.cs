using Microsoft.AspNetCore.Mvc;

namespace Shamil_Portfolio.Controllers
{
    public class ContactController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
