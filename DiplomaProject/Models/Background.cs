namespace DiplomaProject.Models
{
    public class Background
    {
        public Guid Id { get; set; }
        public string? Image { get; set; }
        public List<Indicator> Indicators { get; set; } = new();
    }
}
