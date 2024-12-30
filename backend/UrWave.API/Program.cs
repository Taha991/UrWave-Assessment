using Microsoft.EntityFrameworkCore;
using System;
using UrWave.API.Endpoints;
using UrWave.API.Middleware;
using UrWave.Domain.Interfaces;
using UrWave.Infrastructure.Data;
using UrWave.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add services to the container
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register Repositories
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IProductRepository, ProductRepository>();

builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();


builder.Services.AddMemoryCache();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

// Add custom middlewares
app.UseMiddleware<ErrorHandlingMiddleware>(); // Error handling middleware
app.UseMiddleware<LoggingMiddleware>(); // Logging middleware
app.UseMiddleware<PerformanceMiddleware>(); // Performance monitoring middleware



// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

//app.MapControllers();

app.MapCategoryEndpoints();
app.MapProductEndpoints();


app.Run();
