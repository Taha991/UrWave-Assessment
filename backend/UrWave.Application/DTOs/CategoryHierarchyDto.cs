using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UrWave.Application.DTOs
{
    public class CategoryHierarchyDto
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
        public List<CategoryHierarchyDto>? Children { get; set; } = new List<CategoryHierarchyDto>();
    }
}
