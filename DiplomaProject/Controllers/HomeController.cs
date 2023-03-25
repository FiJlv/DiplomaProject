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

            // начальные данные для тестирования
            if (!db.Backgrounds.Any())
            {
                Background image1 = new Background { Image = "image1" };
                Background image2 = new Background { Image = "image2" };

                Indicator indicator1 = new Indicator { X = 1, Y = 2, TemperatureValues = 34, Background = image1 };
                Indicator indicator2 = new Indicator { X = 3, Y = 4, TemperatureValues = 35, Background = image2 };
                Indicator indicator3 = new Indicator { X = 4, Y = 5, TemperatureValues = 36, Background = image2 };

                db.Backgrounds.AddRange(image1, image2);
                db.Indicators.AddRange(indicator1, indicator2, indicator3);
                db.SaveChanges();
            }
        }

        public IActionResult GetIndicators()
        {
            return Json(db.Indicators.ToList());
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