using DiplomaProject.Data;
using DiplomaProject.Models;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaProject.Controllers
{
    public class IndicatorController : Controller
    {
        ApplicationContext db;
        public IndicatorController(ApplicationContext context)
        {
            db = context;
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

        public IActionResult GetIndicators()
        {
            return Json(db.Indicators.ToList());
        }

        [HttpPost]
        public async Task<IActionResult> Delete(int? id)
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
    }
}
