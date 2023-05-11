using Microsoft.AspNetCore.Mvc;

namespace DiplomaProject.Controllers
{
    public class GeneratorController : Controller
    {
        [HttpGet]
        public ActionResult GenerateValues()
        {
            string values = "";
            for (int i = 0; i < 30; i++)
            {
                values += new Random().Next(30, 46) + ",";
            }
            values = values.TrimEnd(',');

            return Json(values);
        }
    }
}
