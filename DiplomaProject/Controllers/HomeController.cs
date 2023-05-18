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
        // Конструктор контролера, що приймає контекст бази даних
        public HomeController(ApplicationContext context)
        {
            db = context;
        }

        [HttpPost]
        // Метод, що обробляє POST-запит на завантаження фонового зображення
        public async Task<IActionResult> UploadBackground(IFormFile imageFile)
        {
            if (imageFile != null && imageFile.Length > 0)
            {
                // зберігаємо в бд
                using (var stream = new MemoryStream())
                {
                    // копіюємо файл в поток
                    await imageFile.CopyToAsync(stream);

                    // Створюємо новий об'єкт фонового зображення
                    var background = new Background
                    {
                        Image = Convert.ToBase64String(stream.ToArray())
                    };

                    // Додаємо фонове зображення в базу даних і зберігаємо зміни
                    db.Backgrounds.Add(background);
                    db.SaveChanges();
                }
            }

            // Перенаправляємо на дію "Іndex"
            return RedirectToAction("Index");
        }

        [HttpGet]
        // Метод, що обробляє GET-запит для отримання фонового зображення за його ідентифікатором
        public IActionResult GetBackgroundImage(int id)
        {
            // Шукаємо фонове зображення в базі даних за ідентифікатором
            var background = db.Backgrounds.FirstOrDefault(b => b.Id == id);
            if (background != null)
            {
                // Перетворення рядка Base64 на масив байтів
                byte[] bytes = Convert.FromBase64String(background.Image);

                // Створюємо файл із масивом байтів
                return File(bytes, "image/png");
            }
            else
            {
                // Якщо фонове зображення не знайдено, повертаємо помилку 404
                return NotFound();
            }
        }

        // Метод, що повертає представлення "Індекс" з даними з бази даних
        public async Task<IActionResult> Index()
        {
            // Вилучаємо список індикаторів із бази даних і передаємо їх у представлення
            return View(await db.Indicators.ToListAsync());
        }
    }
}