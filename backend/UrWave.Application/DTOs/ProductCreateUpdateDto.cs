using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrWave.Application.DTOs
{
    public class ProductCreateUpdateDto
    {
        public string Name { get; set; } = null!;
        public string Description { get; set; } = null!;
        public decimal Price { get; set; }
        public Guid CategoryId { get; set; }
        public int Status { get; set; }
        public int StockQuantity { get; set; }
    }
}
