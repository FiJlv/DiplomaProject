using DiplomaProject.Data;
using DiplomaProject.Source;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// �������� ����� ���������� � ���������������� �����
string connection = builder.Configuration.GetConnectionString("DefaultConnection");

// ������ �������� ApplicationContext �� ����� � �������
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
    endpoints.MapHub<RandomNumberHub>("/randomnumberhub"); // ������� ��� ����
});

app.UseAuthorization();

app.Run();
