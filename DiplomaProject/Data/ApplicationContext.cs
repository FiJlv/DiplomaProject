using DiplomaProject.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaProject.Data
{
    public class ApplicationContext : DbContext
    {
        // Представляє таблицю в базі даних для зберігання сутностей індикатора
        public DbSet<Indicator> Indicators { get; set; } = null!;

        // Представляє таблицю в базі даних для зберігання фонових сутностей
        public DbSet<Background> Backgrounds { get; set; } = null!;

        // Конструктор для класу ApplicationContext
        // Бере екземпляр DbContextOptions<ApplicationContext> для налаштування контексту
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            // Забезпечує створення бази даних та її схеми, якщо вони не існують
            Database.EnsureCreated();
        }
    }

}
