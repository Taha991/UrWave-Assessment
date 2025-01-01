using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using UrWave.Application.DTOs;
using UrWave.Application.Helpers;
using UrWave.Domain.Entities;
using UrWave.Domain.Interfaces;

namespace UrWave.API.Endpoints
{
    public static class ProductEndpoints
    {
        
              public static void MapProductEndpoints(this IEndpointRouteBuilder routes)
            {
                var group = routes.MapGroup("/products").WithTags("Products");

            // GET /products
            // GET /products
            group.MapGet("/", async (HttpRequest request, IProductRepository repository, IMemoryCache cache, ILogger<Product> logger) =>
            {
                logger.LogInformation("Fetching paginated, filtered, and sorted products");

                // Extract query parameters
                var queryParams = request.Query;
                int page = int.TryParse(queryParams["page"], out var parsedPage) ? parsedPage : 1;
                int pageSize = int.TryParse(queryParams["pageSize"], out var parsedPageSize) ? parsedPageSize : 10;
                string? sortBy = queryParams["sortBy"];
                string? sortOrder = queryParams["sortOrder"]; // "asc" or "desc"
                string? categoryId = queryParams["categoryId"];
                int? status = int.TryParse(queryParams["status"], out var parsedStatus) ? parsedStatus : null; // Parse status as int?
                decimal? minPrice = decimal.TryParse(queryParams["minPrice"], out var parsedMinPrice) ? parsedMinPrice : null;
                decimal? maxPrice = decimal.TryParse(queryParams["maxPrice"], out var parsedMaxPrice) ? parsedMaxPrice : null;

                // Fetch data
                var products = await repository.GetPaginatedProductsAsync(page, pageSize, sortBy, sortOrder, categoryId, status, minPrice, maxPrice);
                var totalItems = await repository.GetTotalCountAsync(categoryId, status, minPrice, maxPrice);

                // Prepare response
                var response = new
                {
                    Data = products.Select(p => p.ToViewDto()),
                    TotalItems = totalItems,
                    TotalPages = (int)Math.Ceiling(totalItems / (double)pageSize),
                    CurrentPage = page,
                    PageSize = pageSize
                };

                return Results.Ok(response);
            }).WithName("GetPaginatedProducts");


            // GET /products/{id}
            group.MapGet("/{id:guid}", async (IProductRepository repository, Guid id, ILogger<Product> logger) =>
                {
                    logger.LogInformation($"Fetching product with ID {id}");
                    var product = await repository.GetByIdAsync(id);
                    return product != null ? Results.Ok(product.ToViewDto()) : Results.NotFound();
                }).WithName("GetProductById");

                // POST /products
                group.MapPost("/", async (IProductRepository repository, [FromBody] ProductCreateUpdateDto dto, IMemoryCache cache, ILogger<Product> logger) =>
                {
                    logger.LogInformation("Creating a new product");
                    var product = dto.ToEntity();
                    await repository.AddAsync(product);
                    cache.Remove("Products");
                    return Results.Created($"/products/{product.Id}", product.ToViewDto());
                }).WithName("CreateProduct");

                // PUT /products/{id}
                group.MapPut("/{id:guid}", async (IProductRepository repository, Guid id, [FromBody] ProductCreateUpdateDto dto, IMemoryCache cache, ILogger<Product> logger) =>
                {
                    logger.LogInformation($"Updating product with ID {id}");
                    var existingProduct = await repository.GetByIdAsync(id);
                    if (existingProduct == null) return Results.NotFound();

                    existingProduct.UpdateEntity(dto);
                    await repository.UpdateAsync(existingProduct);
                    cache.Remove("Products");
                    return Results.NoContent();
                }).WithName("UpdateProduct");
            // GET /products/category/{categoryId}
            group.MapGet("/category/{categoryId:guid}", async (IProductRepository repository, Guid categoryId, ILogger<Product> logger) =>
            {
                logger.LogInformation($"Fetching products for category ID {categoryId}");
                var products = await repository.GetProductsByCategoryAsync(categoryId);
                return products.Any() ? Results.Ok(products.Select(p => p.ToViewDto())) : Results.NotFound();
            }).WithName("GetProductsByCategory");


            // DELETE /products/{id}
            group.MapDelete("/{id:guid}", async (IProductRepository repository, Guid id, IMemoryCache cache, ILogger<Product> logger) =>
                {
                    logger.LogInformation($"Deleting product with ID {id}");
                    var existingProduct = await repository.GetByIdAsync(id);
                    if (existingProduct == null) return Results.NotFound();

                    await repository.DeleteAsync(id);
                    cache.Remove("Products");
                    return Results.NoContent();
                }).WithName("DeleteProduct");
            }
        }
}
