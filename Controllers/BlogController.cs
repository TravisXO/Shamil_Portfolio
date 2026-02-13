using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Shamil_Portfolio.Controllers
{
    public class BlogController : Controller
    {
        public IActionResult Index()
        {
            var posts = GetPosts();
            return View(posts);
        }

        [Route("Blog/Article/{id}")]
        public IActionResult Article(int id)
        {
            var post = GetPosts().FirstOrDefault(p => p.Id == id);
            if (post == null) return NotFound();
            return View(post);
        }

        private List<BlogPost> GetPosts()
        {
            return new List<BlogPost>
            {
                new BlogPost
                {
                    Id = 1,
                    Title = "From Classroom to Production: Lessons Learned Building My First ASP.NET 8 MVC Application",
                    Slug = "lessons-learned-first-aspnet-app",
                    Date = new DateTime(2025, 2, 13),
                    ReadTime = "8_MIN_READ",
                    Category = "SOFTWARE_ENGINEERING",
                    Tags = new List<string> { "#SoftwareEngineering", "#ASP.NET8", "#WebDevelopment", "#CareerLessons", "#RealWorldCoding" },
                    Excerpt = "Transitioning from academic theory to production-grade code is a quantum leap. Here are the critical lessons I learned about dependency injection, middleware, and deployment when building my first real-world ASP.NET 8 application.",
                    Content = "<p>Transitioning from academic theory to production-grade code is a quantum leap...</p>", // Placeholder for full content
                    IsFeatured = true
                },
                new BlogPost
                {
                    Id = 2,
                    Title = "Why I Still Use Wix (And Why You Might Want To As Well)",
                    Slug = "why-i-still-use-wix",
                    Date = new DateTime(2025, 2, 12),
                    ReadTime = "6_MIN_READ",
                    Category = "WEB_DEVELOPMENT",
                    Tags = new List<string> { "#WebDevelopment", "#Wix", "#ASP.NET", "#ToolSelection", "#PragmaticDevelopment", "#SEO" },
                    Excerpt = "As a full-stack developer, it might seem counterintuitive to use a site builder. However, for certain client constraints and rapid prototyping, Wix offers strategic advantages that custom coding sometimes can't match.",
                    Content = "<p>As a full-stack developer, it might seem counterintuitive...</p>"
                },
                new BlogPost
                {
                    Id = 3,
                    Title = "How I Grew Organic Traffic by 217% in 13 Months (With Zero Ad Spend)",
                    Slug = "organic-traffic-growth-case-study",
                    Date = new DateTime(2025, 2, 11),
                    ReadTime = "10_MIN_READ",
                    Category = "SEO_STRATEGIES",
                    Tags = new List<string> { "#SEO", "#TechnicalSEO", "#OrganicGrowth", "#ContentStrategy", "#DigitalMarketing", "#ZambiaBusiness" },
                    Excerpt = "A deep dive into the technical SEO strategies and content clusters I deployed for Classic Zambia Safaris. Learn how semantic HTML, site speed optimization, and keyword targeting drove massive organic growth.",
                    Content = "<p>A deep dive into the technical SEO strategies...</p>"
                },
                new BlogPost
                {
                    Id = 4,
                    Title = "Building Your First ASP.NET 8 MVC Application: A Practical Guide for Beginners",
                    Slug = "building-first-aspnet-mvc-app",
                    Date = new DateTime(2025, 2, 10),
                    ReadTime = "12_MIN_READ",
                    Category = "ASP.NET_TUTORIALS",
                    Tags = new List<string> { "#ASP.NET8", "#MVC", "#WebDevelopment", "#Tutorial", "#CSharp", "#BeginnerGuide" },
                    Excerpt = "Step-by-step walkthrough of setting up a scalable MVC project structure. We cover the Model-View-Controller pattern, Entity Framework Core basics, and Razor syntax fundamentals.",
                    Content = "<p>Step-by-step walkthrough of setting up...</p>"
                },
                new BlogPost
                {
                    Id = 5,
                    Title = "Deploying ASP.NET 8 to Render: A Cost-Effective Alternative to Azure",
                    Slug = "deploying-aspnet-to-render",
                    Date = new DateTime(2025, 2, 9),
                    ReadTime = "9_MIN_READ",
                    Category = "CLOUD_COMPUTING",
                    Tags = new List<string> { "#CloudComputing", "#Render", "#ASP.NET8", "#Deployment", "#DevOps", "#Azure", "#WebHosting" },
                    Excerpt = "Azure is powerful, but for personal portfolios and small apps, Render offers a compelling simplified workflow. This guide covers Dockerizing your .NET app and configuring CI/CD pipelines on Render.",
                    Content = "<p>Azure is powerful, but for personal portfolios...</p>"
                },
                new BlogPost
                {
                    Id = 6,
                    Title = "From Internship to Job Offer: What I Learned About Breaking Into Tech in Zambia",
                    Slug = "internship-to-job-offer-zambia",
                    Date = new DateTime(2025, 2, 8),
                    ReadTime = "11_MIN_READ",
                    Category = "CAREER_INSIGHTS",
                    Tags = new List<string> { "#CareerAdvice", "#ZambiaTech", "#SoftwareEngineering", "#JobSearch", "#TechCareers", "#Internships", "#AfricaTech" },
                    Excerpt = "Navigating the local tech landscape requires more than just coding skills. I share my journey from an intern at Integrated Carrier Express to securing a full-time role, highlighting soft skills and networking.",
                    Content = "<p>Navigating the local tech landscape requires...</p>"
                }
            };
        }
    }

    public class BlogPost
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Slug { get; set; }
        public DateTime Date { get; set; }
        public string ReadTime { get; set; }
        public string Category { get; set; }
        public List<string> Tags { get; set; }
        public string Excerpt { get; set; }
        public string Content { get; set; }
        public bool IsFeatured { get; set; }
    }
}