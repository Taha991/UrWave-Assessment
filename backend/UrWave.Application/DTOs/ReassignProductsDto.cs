using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrWave.Application.DTOs
{
    public class ReassignProductsDto
    {
        public Guid OldCategoryId { get; set; }
        public Guid NewCategoryId { get; set; }
    }
}
