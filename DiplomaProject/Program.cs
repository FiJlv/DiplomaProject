using DiplomaProject.Data;
using DiplomaProject.Source;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// отримуємо рядок підключення з конфігураційного файлу
string connection = builder.Configuration.GetConnectionString("DefaultConnection");

// додаємо контекст ApplicationContext як сервіс у додаток
builder.Services.AddDbContext<ApplicationContext>(options => options.UseSqlServer(connection));

builder.Services.AddControllersWithViews();

builder.Services.AddSignalR();

var app = builder.Build();

app.MapDefaultControllerRoute();
app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseEndpoints(endpoints =>
{
    endpoints.MapHub<RandomNumberHub>("/randomnumberhub"); // Маршрут для хаба
});

app.UseAuthorization();

app.Run();
