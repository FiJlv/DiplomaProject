using Microsoft.AspNetCore.Mvc;

namespace DiplomaProject.Controllers
{
    public class GeneratorController : Controller
    {
        [HttpGet]
        public ActionResult GenerateValues()
        {
            // Створення порожнього рядка для зберігання згенерованих значень
            string values = "";

            // Генерування 30 випадкових значень температури від 30 до 45
            for (int i = 0; i < 30; i++)
            {
                // Додавання до рядка випадково згенерованого значення з комою
                values += new Random().Next(30, 46) + ",";
            }

            // Видалення кінцевої коми з рядка
            values = values.TrimEnd(',');

            // Повертає згенеровані значення як відповідь JSON
            return Json(values);
        }
    }
}
