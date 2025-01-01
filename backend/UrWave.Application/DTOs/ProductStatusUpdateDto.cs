using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrWave.Application.DTOs
{
    public class ProductStatusUpdateDto
    {
        public IEnumerable<Guid> ProductIds { get; set; } = new List<Guid>();
        public int Status { get; set; } // New status to be applied
    }
}
