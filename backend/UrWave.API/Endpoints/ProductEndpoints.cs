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
                group.MapGet("/", async (IProductRepository repository, IMemoryCache cache, ILogger<Product> logger) =>
                {
                    logger.LogInformation("Fetching all products");
                    if (!cache.TryGetValue("Products", out IEnumerable<ProductViewDto> products))
                    {
                        products = (await repository.GetProductsWithCategoryAsync())
                            .Select(p => p.ToViewDto());
                        cache.Set("Products", products, TimeSpan.FromMinutes(5));
                        logger.LogInformation("Products cached");
                    }
                    return Results.Ok(products);
                }).WithName("GetAllProducts");

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
