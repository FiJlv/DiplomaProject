﻿using System.ComponentModel.DataAnnotations.Schema;

namespace DiplomaProject.Models
{
    public class Indicator
    {
        public int Id { get; set; }
        public int X { get; set; }
        public int Y { get; set; }
        public string TemperatureValues { get; set; }
    }
}
