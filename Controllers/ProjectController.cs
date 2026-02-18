using Microsoft.AspNetCore.Mvc;

namespace Shamil_Portfolio.Controllers
{
    public class ProjectController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
