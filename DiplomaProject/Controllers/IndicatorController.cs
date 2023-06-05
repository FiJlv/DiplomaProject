using DiplomaProject.Data;
using DiplomaProject.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

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
        public ActionResult EditInput(int x, int y, int baseNum)
        {
            foreach (var input in db.Indicators)
            {
                if (input.X == x && input.Y == y)
                {
                    input.BaseNum = baseNum;
                }
            }

            db.SaveChanges();
            return new EmptyResult();

        }

        [HttpPost]
        public ActionResult SaveInput(int x, int y, int baseNum, string valueOnTheChart)
        {
            if(valueOnTheChart == null)
            {
                valueOnTheChart = "empty";
            }

            var input = new Indicator
            {
                X = x,
                Y = y,
                BaseNum = baseNum,
                Values = "start",
                ValueOnTheChart = valueOnTheChart
            };

            db.Indicators.Add(input); 
            db.SaveChanges();

            return new EmptyResult();
        }

        [HttpPost]
        public ActionResult SavingValues(int x, int y, int value)
        {
            string str = value.ToString();
            foreach (var input in db.Indicators)
            {
                if (input.X == x && input.Y == y)
                {
                    input.Values += ", " + str;          
                }
            }
            db.SaveChanges();

            return new EmptyResult();
        }

        [HttpPost]
        // Метод дії для обробки запиту HTTP POST на видалення індикатора
        // Приймає ідентифікатор 
        public async Task<IActionResult> Delete(int? id)
        {
            // Знаходження об'єкта Indicator із вказаним id у базі даних
            var indicator = await db.Indicators.FindAsync(id);

            if (indicator != null)
            {
                // Видалення індикатора з бази даних
                db.Remove(indicator);

                // Збереження змін в бд 
                await db.SaveChangesAsync();

                // Перенаправлення до методу Index.
                return RedirectToAction("Index");
            }

            // Якщо індикатора не існує, повертаємо результат NotFound
            return NotFound();
        }

        public IActionResult GetIndicators()
        {
            var list = db.Indicators.ToList();
            return Json(list);
        }

    }
}
