using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrWave.Application.DTOs;
using UrWave.Domain.Entities;

namespace UrWave.Application.Helpers
{
    public static class CategoryMapping
    {
        public static CategoryViewDto ToViewDto(this Category category)
        {
            return new CategoryViewDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ParentCategoryId = category.ParentCategoryId
            };
        }

        public static Category ToEntity(this CategoryCreateUpdateDto dto)
        {
            return new Category
            {
                Name = dto.Name,
                Description = dto.Description,
                ParentCategoryId = dto.ParentCategoryId
            };
        }

        public static void UpdateEntity(this Category entity, CategoryCreateUpdateDto dto)
        {
            entity.Name = dto.Name;
            entity.Description = dto.Description;
            entity.ParentCategoryId = dto.ParentCategoryId;
        }
    }
}
