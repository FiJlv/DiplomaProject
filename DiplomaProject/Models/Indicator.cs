using System.ComponentModel.DataAnnotations.Schema;

namespace DiplomaProject.Models
{
    public class Indicator
    {
        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string ValueOnTheChart { get; set; }
        public int BaseNum { get; set; }
        public string Values { get; set; }
    }
}
