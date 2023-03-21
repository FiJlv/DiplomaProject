using DiplomaProject.Models;
using Microsoft.EntityFrameworkCore;

namespace DiplomaProject.Data
{
    public class ApplicationContext : DbContext
    {
        public DbSet<Indicator> Indicators { get; set; } = null!;
        //public DbSet<Background> Backgrounds { get; set; } = null!;
        public ApplicationContext(DbContextOptions<ApplicationContext> options)
            : base(options)
        {
            Database.EnsureCreated();
        }
    }
}
