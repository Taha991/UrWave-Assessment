﻿using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrWave.Domain.Entities;
using UrWave.Domain.Interfaces;
using UrWave.Infrastructure.Data;

namespace UrWave.Infrastructure.Repositories
{
    public class ProductRepository : GenericRepository<Product>, IProductRepository
    {
        public ProductRepository(AppDbContext context) : base(context) { }

        public async Task<IEnumerable<Product>> GetProductsWithCategoryAsync()
        {
            return await _context.Products
                .Include(p => p.Category)
                .ToListAsync();
        }
        public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(Guid categoryId)
        {
            return await _context.Products.Where(p => p.CategoryId == categoryId).ToListAsync();
        }

        public async Task<IEnumerable<Product>> GetPaginatedProductsAsync(
      int page, int pageSize, string? sortBy, string? sortOrder, string? categoryId, int? status, decimal? minPrice, decimal? maxPrice)
        {
            var query = _context.Products.AsQueryable();

            // Filtering
            if (!string.IsNullOrEmpty(categoryId))
                query = query.Where(p => p.CategoryId.ToString() == categoryId);
            if (status.HasValue)
                query = query.Where(p => p.Status == status.Value);
            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice);
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice);

            // Sorting
            if (!string.IsNullOrEmpty(sortBy))
            {
                query = sortOrder?.ToLower() == "desc"
                    ? query.OrderByDescending(e => EF.Property<object>(e, sortBy))
                    : query.OrderBy(e => EF.Property<object>(e, sortBy));
            }

            // Pagination
            return await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
        }

        public async Task<int> GetTotalCountAsync(string? categoryId, int? status, decimal? minPrice, decimal? maxPrice)
        {
            var query = _context.Products.AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(categoryId))
                query = query.Where(p => p.CategoryId.ToString() == categoryId);
            if (status.HasValue)
                query = query.Where(p => p.Status == status.Value);
            if (minPrice.HasValue)
                query = query.Where(p => p.Price >= minPrice);
            if (maxPrice.HasValue)
                query = query.Where(p => p.Price <= maxPrice);

            return await query.CountAsync();
        }
        public async Task DeleteManyAsync(IEnumerable<Guid> ids)
        {
            var products = await _context.Products.Where(p => ids.Contains(p.Id)).ToListAsync();

            if (products.Any())
            {
                _context.Products.RemoveRange(products);
                await _context.SaveChangesAsync();
            }
        }
        public async Task UpdateProductsStatusAsync(IEnumerable<Guid> productIds, int status)
        {
            var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

            if (products.Any())
            {
                foreach (var product in products)
                {
                    product.Status = status;
                    product.UpdatedDate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }
        }
        public async Task ReassignProductsCategoryAsync(IEnumerable<Guid> productIds, Guid categoryId)
        {
            var products = await _context.Products.Where(p => productIds.Contains(p.Id)).ToListAsync();

            if (products.Any())
            {
                foreach (var product in products)
                {
                    product.CategoryId = categoryId;
                    product.UpdatedDate = DateTime.UtcNow;
                }

                await _context.SaveChangesAsync();
            }
        }

        public async Task UpdateRangeAsync(IEnumerable<Product> products)
        {
            _context.Products.UpdateRange(products);
            await _context.SaveChangesAsync();

        }



        }
    }
