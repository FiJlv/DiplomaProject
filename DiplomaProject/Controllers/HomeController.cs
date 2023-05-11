using Microsoft.AspNetCore.Mvc;
using DiplomaProject.Models;
using System.Diagnostics;
using DiplomaProject.Data;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;


namespace DiplomaProject.Controllers
{
    public class HomeController : Controller
    {
        ApplicationContext db;
        public HomeController(ApplicationContext context)
        {
            db = context;
        }

        [HttpPost]
        public async Task<IActionResult> UploadBackground(IFormFile imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                // зберігаємо в бд
                using (var stream = new MemoryStream())
                {
                    // копіюємо файл в поток
                    await imageFile.CopyToAsync(stream);

                    var background = new Background
                    {
                        Image = Convert.ToBase64String(stream.ToArray())
                    };

                    db.Backgrounds.Add(background);
                    db.SaveChanges();
                }
            }

            return RedirectToAction("Index");
        }

        [HttpGet]
        public IActionResult GetBackgroundImage(int id)
        {
            var background = db.Backgrounds.FirstOrDefault(b => b.Id == id);
            if (background != null)
            {
                byte[] bytes = Convert.FromBase64String(background.Image);
                return File(bytes, "image/png");
            }
            else
            {
                return NotFound();
            }
        }

        public async Task<IActionResult> Index()
        {
            return View(await db.Indicators.ToListAsync());
        }
    }
}