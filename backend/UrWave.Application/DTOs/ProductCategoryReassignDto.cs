using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrWave.Application.DTOs
{
    public class ProductCategoryReassignDto
    {
        public IEnumerable<Guid> ProductIds { get; set; } = new List<Guid>();
        public Guid CategoryId { get; set; } // New category to be assigned
    }
}
