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
                // сохраняем в бд
                using (var stream = new MemoryStream())
                {
                    // копируем файл в поток
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

        [HttpPost]
        public async Task<IActionResult> Delete(Guid? id)
        {
            var indicator = await db.Indicators.FindAsync(id);

            if (indicator != null)
            {
                db.Remove(indicator);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return NotFound();
        }

        public IActionResult GetIndicators()
        {
            return Json(db.Indicators.ToList());
        }

        [HttpPost]
        public ActionResult SaveInput(int x, int y, string temperatureValues)
        {
            var input = new Indicator
            {
                X = x,
                Y = y,
                TemperatureValues = temperatureValues
            };

            db.Indicators.Add(input);
            db.SaveChanges();

            return new EmptyResult();
        }

        public async Task<IActionResult> Index()
        {
            return View(await db.Indicators.ToListAsync());
        }

        [HttpGet]
        public ActionResult GenerateValues()
        {
            string values = "";
            for (int i = 0; i < 100; i++)
            {
                values += new Random().Next(30, 46) + ",";
            }
            values = values.TrimEnd(',');

            return Json(values);
        }
    }
}