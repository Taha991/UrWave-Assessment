using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrWave.Domain.Entities;

namespace UrWave.Domain.Interfaces
{
    public interface IProductRepository : IGenericRepository<Product>
    {
        Task<IEnumerable<Product>> GetProductsWithCategoryAsync();
        Task<IEnumerable<Product>> GetProductsByCategoryAsync(Guid categoryId);
    }
}
