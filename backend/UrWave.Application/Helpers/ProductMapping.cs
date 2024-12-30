using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrWave.Application.DTOs;
using UrWave.Domain.Entities;

namespace UrWave.Application.Helpers
{
    public static class ProductMapping
    {
        public static ProductViewDto ToViewDto(this Product product)
        {
            return new ProductViewDto
            {
                Id = product.Id,
                Name = product.Name,
                Description = product.Description,
                Price = product.Price,
                CategoryId = product.CategoryId,
                Status = product.Status,
                StockQuantity = product.StockQuantity,
                CreatedDate = product.CreatedDate,
                UpdatedDate = product.UpdatedDate,
                CategoryName = product.Category?.Name
            };
        }

        public static Product ToEntity(this ProductCreateUpdateDto dto)
        {
            return new Product
            {
                Name = dto.Name,
                Description = dto.Description,
                Price = dto.Price,
                CategoryId = dto.CategoryId,
                Status = dto.Status,
                StockQuantity = dto.StockQuantity,
                CreatedDate = DateTime.UtcNow,
                UpdatedDate = DateTime.UtcNow
            };
        }

        public static void UpdateEntity(this Product product, ProductCreateUpdateDto dto)
        {
            product.Name = dto.Name;
            product.Description = dto.Description;
            product.Price = dto.Price;
            product.CategoryId = dto.CategoryId;
            product.Status = dto.Status;
            product.StockQuantity = dto.StockQuantity;
            product.UpdatedDate = DateTime.UtcNow;
        }
    }
}
