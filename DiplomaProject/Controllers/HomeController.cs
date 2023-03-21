using Microsoft.AspNetCore.Mvc;
using DiplomaProject.Models;
using System.Diagnostics;
using DiplomaProject.Data;
using Microsoft.EntityFrameworkCore;

namespace DiplomaProject.Controllers
{
    public class HomeController : Controller
    {
        ApplicationContext db;
        public HomeController(ApplicationContext context)
        {
            db = context;
        }
        public async Task<IActionResult> Index()
        {
            return View(await db.Indicators.ToListAsync());
        }
        public IActionResult Create()
        {
            return View();
        }
        [HttpPost]
        public async Task<IActionResult> Create(Indicator indicator)
        {
            db.Indicators.Add(indicator);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
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