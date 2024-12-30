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
                group.MapDelete("/{id:guid}", async (ICategoryRepository repository, Guid id, IMemoryCache cache, ILogger<Category> logger) =>
                {
                    logger.LogInformation($"Deleting category with ID {id}");
                    var existingCategory = await repository.GetByIdAsync(id);
                    if (existingCategory == null) return Results.NotFound();

                    await repository.DeleteAsync(id);
                    cache.Remove("Categories");
                    return Results.NoContent();
                }).WithName("DeleteCategory");
            }
        }
    }

