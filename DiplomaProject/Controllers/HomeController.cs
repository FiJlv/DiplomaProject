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

        public IActionResult GetIndicators()
        {
            return Json(db.Indicators.ToList());
        }

        [HttpPost]
        public async Task<IActionResult> UploadBackground(IFormFile imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                // сохраняем в бд
                using (var stream = new MemoryStream())
                {
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
        public IActionResult GetBackgroundImage()
        {
            var background = db.Backgrounds.FirstOrDefault();
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
        public ActionResult SaveInput(int x, int y, int temperatureValues)
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

        [HttpPost]
        public async Task<IActionResult> Delete(Guid? id)
        {
            if (id != null)
            {
                Indicator user = new Indicator { Id = id.Value };
                db.Entry(user).State = EntityState.Deleted;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return NotFound();
        }
        public async Task<IActionResult> Edit(Guid? id)
        {
            if (id != null)
            {
                Indicator? indicator = await db.Indicators.FirstOrDefaultAsync(p => p.Id == id);
                if (indicator != null) return View(indicator);
            }
            return NotFound();
        }
        [HttpPost]
        public async Task<IActionResult> Edit(Indicator indicator)
        {
            db.Indicators.Update(indicator);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }
    }
}