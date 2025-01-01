using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using UrWave.Application.DTOs;
using UrWave.Application.Helpers;
using UrWave.Domain.Entities;
using UrWave.Domain.Interfaces;

namespace UrWave.API.Endpoints
{

    public static class CategoryEndpoints
    {
        public static void MapCategoryEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/categories").WithTags("Categories");

            // GET /categories
            group.MapGet("/", async (ICategoryRepository repository, IMemoryCache cache, ILogger<Category> logger) =>
            {
                logger.LogInformation("Fetching all categories");
                if (!cache.TryGetValue("Categories", out IEnumerable<CategoryViewDto> categories))
                {
                    categories = (await repository.GetAllAsync())
                        .Select(c => c.ToViewDto());
                    cache.Set("Categories", categories, TimeSpan.FromMinutes(5));
                    logger.LogInformation("Categories cached");
                }
                return Results.Ok(categories);
            }).WithName("GetAllCategories");

            // GET /categories/{id}
            group.MapGet("/{id:guid}", async (ICategoryRepository repository, Guid id, ILogger<Category> logger) =>
            {
                logger.LogInformation($"Fetching category with ID {id}");
                var category = await repository.GetByIdAsync(id);
                return category != null ? Results.Ok(category.ToViewDto()) : Results.NotFound();
            }).WithName("GetCategoryById");
            // Add this method in the CategoryEndpoints class
            group.MapGet("/dropdown", async (ICategoryRepository repository, ILogger<Category> logger) =>
            {
                logger.LogInformation("Fetching categories for dropdown");
                var categories = await repository.GetAllAsync();
                var dropdownItems = categories.Select(c => new
                {
                    c.Id,
                    c.Name
                });
                return Results.Ok(dropdownItems);
            }).WithName("GetCategoriesForDropdown");

            // POST /categories
            group.MapPost("/", async (ICategoryRepository repository, [FromBody] CategoryCreateUpdateDto dto, IMemoryCache cache, ILogger<Category> logger) =>
                {
                    logger.LogInformation("Creating a new category");
                    var category = dto.ToEntity();
                    await repository.AddAsync(category);
                    cache.Remove("Categories");
                    return Results.Created($"/categories/{category.Id}", category.ToViewDto());
                }).WithName("CreateCategory");

            // PUT /categories/{id}
            group.MapPut("/{id:guid}", async (ICategoryRepository repository, Guid id, [FromBody] CategoryCreateUpdateDto dto, IMemoryCache cache, ILogger<Category> logger) =>
            {
                logger.LogInformation($"Updating category with ID {id}");
                var existingCategory = await repository.GetByIdAsync(id);
                if (existingCategory == null) return Results.NotFound();

                existingCategory.UpdateEntity(dto);
                await repository.UpdateAsync(existingCategory);
                cache.Remove("Categories");
                return Results.NoContent();
            }).WithName("UpdateCategory");

            // DELETE /categories/{id}
            //group.MapDelete("/{id:guid}", async (ICategoryRepository repository, Guid id, IMemoryCache cache, ILogger<Category> logger) =>
            //{
            //    logger.LogInformation($"Deleting category with ID {id}");
            //    var existingCategory = await repository.GetByIdAsync(id);
            //    if (existingCategory == null) return Results.NotFound();

            //    await repository.DeleteAsync(id);
            //    cache.Remove("Categories");
            //    return Results.NoContent();
            //}).WithName("DeleteCategory");
            // Add this endpoint in the `CategoryEndpoints` class
            group.MapGet("/hierarchy", async (ICategoryRepository repository, ILogger<Category> logger) =>
            {
                logger.LogInformation("Fetching category hierarchy");
                var categories = await repository.GetAllAsync();
                var rootCategories = categories
                    .Where(c => c.ParentCategoryId == null) // Root categories
                    .Select(c => c.ToHierarchyDto())
                    .ToList();
                return Results.Ok(rootCategories);
            }).WithName("GetCategoryHierarchy");
            group.MapPost("/reassign", async (ReassignProductsDto dto, ICategoryRepository categoryRepo, IProductRepository productRepo, ILogger<Category> logger) =>
            {
                logger.LogInformation($"Reassigning products from category {dto.OldCategoryId} to {dto.NewCategoryId}");

                // Validate the old category
                var oldCategory = await categoryRepo.GetByIdAsync(dto.OldCategoryId);
                if (oldCategory == null)
                {
                    return Results.NotFound(new { Message = "Old category not found." });
                }

                // Validate the new category
                var newCategory = await categoryRepo.GetByIdAsync(dto.NewCategoryId);
                if (newCategory == null)
                {
                    return Results.BadRequest(new { Message = "New category not found for reassignment." });
                }

                // Get all products in the old category
                var productsToReassign = await productRepo.GetProductsByCategoryAsync(dto.OldCategoryId);
                if (!productsToReassign.Any())
                {
                    return Results.BadRequest(new { Message = "No products found in the old category for reassignment." });
                }

                // Reassign the products
                foreach (var product in productsToReassign)
                {
                    product.CategoryId = dto.NewCategoryId;
                }
                await productRepo.UpdateRangeAsync(productsToReassign);

                logger.LogInformation($"Reassigned {productsToReassign} products from category {dto.OldCategoryId} to {dto.NewCategoryId}");
                return Results.Ok(new { Message = "Products reassigned successfully." });
            }).WithName("ReassignProductsCategory");


            group.MapDelete("/{id:guid}", async (Guid id, [FromQuery] Guid? newCategoryId, ICategoryRepository categoryRepo, IProductRepository productRepo, IMemoryCache cache, ILogger<Category> logger) =>
            {
                logger.LogInformation($"Deleting category with ID {id}");
                var category = await categoryRepo.GetByIdAsync(id);
                if (category == null)
                {
                    return Results.NotFound(new { Message = "Category not found." });
                }

                var productsInCategory = await productRepo.GetProductsByCategoryAsync(id);

                if (productsInCategory.Any() && !newCategoryId.HasValue)
                {
                    return Results.BadRequest(new
                    {
                        Message = "This category has associated products. Please provide a valid new category for reassignment."
                    });
                }

                if (newCategoryId.HasValue)
                {
                    var newCategory = await categoryRepo.GetByIdAsync(newCategoryId.Value);
                    if (newCategory == null)
                    {
                        return Results.BadRequest(new
                        {
                            Message = "The new category for reassignment does not exist."
                        });
                    }

                    foreach (var product in productsInCategory)
                    {
                        product.CategoryId = newCategoryId.Value;
                    }
                    await productRepo.UpdateRangeAsync(productsInCategory);
                }

                await categoryRepo.DeleteAsync(id);
                cache.Remove("Categories");
                return Results.NoContent();
            }).WithName("DeleteCategoryWithReassignment");
        }
        }

    }
