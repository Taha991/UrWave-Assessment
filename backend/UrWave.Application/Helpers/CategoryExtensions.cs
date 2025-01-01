using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrWave.Application.DTOs;
using UrWave.Domain.Entities;

namespace UrWave.Application.Helpers
{
    public static class CategoryExtensions
    {
        public static CategoryHierarchyDto ToHierarchyDto(this Category category)
        {
            return new CategoryHierarchyDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                Children = category.InverseParentCategory?.Select(c => c.ToHierarchyDto()).ToList()
            };
        }
    }
}
