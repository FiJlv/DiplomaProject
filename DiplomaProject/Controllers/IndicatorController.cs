using DiplomaProject.Data;
using DiplomaProject.Models;
using Microsoft.AspNetCore.Mvc;

namespace DiplomaProject.Controllers
{
    public class IndicatorController : Controller
    {
        ApplicationContext db;

        // Конструктор контролера, що приймає контекст бази даних
        public IndicatorController(ApplicationContext context)
        {
            db = context;
        }

        // Метод дії для обробки запиту HTTP POST для збереження введених даних
        // Приймає цілі параметри x і y, а також рядковий параметр temperatureValues
        [HttpPost]
        public ActionResult SaveInput(int x, int y, string temperatureValues)
        {
            // Створення нового об’єкту Indicator
            var input = new Indicator
            {
                X = x,
                Y = y,
                TemperatureValues = temperatureValues
            };

            // Додавання нового об’єкта Indicator до колекції Indicators у базі даних
            db.Indicators.Add(input);

            // Збереження змінних 
            db.SaveChanges();

            return new EmptyResult();
        }

        // Метод дії для обробки запиту HTTP GET для отримання індикаторів
        public IActionResult GetIndicators()
        {
            // Отримання всіх об’єктів Indicator з бази даних і перетворення їх у формат JSON
            // Повертає JSON-представлення об’єктів Indicator
            return Json(db.Indicators.ToList());
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
    }
}
