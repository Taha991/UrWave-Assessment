using Microsoft.Data.SqlClient;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using UrWave.Application.DTOs;
using UrWave.Application.Helpers;
using UrWave.Domain.Entities;
using UrWave.Domain.Interfaces;

namespace UrWave.API.Endpoints
{
    public static class UserEndpoints
    {
        public static void MapUserEndpoints(this IEndpointRouteBuilder routes)
        {
            var group = routes.MapGroup("/users").WithTags("Users");

            group.MapPost("/register", async (UserCreateUpdateDto dto, IUserRepository repository, ILogger<User> logger) =>
            {
                try
                {
                    var hashedPassword = PasswordHelper.HashPassword(dto.Password); // Use PasswordHelper
                    var user = new User
                    {
                        Id = Guid.NewGuid(),
                        Username = dto.Username,
                        Email = dto.Email,
                        PasswordHash = hashedPassword,
                        Role = dto.Role,
                        CreatedDate = DateTime.UtcNow
                    };

                    await repository.AddAsync(user);
                    return Results.Created($"/users/{user.Id}", user);
                }
                catch (SqlException sqlEx) when (sqlEx.Number == 2627) // SQL Server error code for unique constraint violation
                {
                    string duplicateField = sqlEx.Message.Contains("UQ__Users__A9D10534") ? "email" : "username"; // Adjust to match constraint names
                    logger.LogWarning(sqlEx, "Duplicate {Field} registration attempt: {Value}", duplicateField, dto.Email);
                    return Results.Conflict(new
                    {
                        Title = $"Duplicate {char.ToUpper(duplicateField[0]) + duplicateField.Substring(1)}",
                        Detail = $"The {duplicateField} '{(duplicateField == "email" ? dto.Email : dto.Username)}' is already registered. Please use a different {duplicateField}.",
                        StatusCode = 409
                    });
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while registering the user: {ErrorMessage}", ex.Message);
                    return Results.Problem(
                        title: "User Registration Failed",
                        detail: "An unexpected error occurred. Please try again later.",
                        statusCode: 500
                    );
                }
            }).WithName("RegisterUser");



            // Login
            group.MapPost("/login", async (UserLoginDto dto, IUserRepository repository, IConfiguration config, ILogger<User> logger) =>
            {
                
                var user = await repository.GetByEmailAsync(dto.Email);
                if (user == null)
                {
                    logger.LogWarning("Login failed for username: {Username}. Reason: User not found.", dto.Email);
                    return Results.BadRequest(new
                    {
                        StatusCode = 400,
                        Message = "Invalid username or password. Please try again."
                    });
                }

                if (!PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash)) // Use PasswordHelper
                {
                    logger.LogWarning("Login failed for username: {Username}. Reason: Incorrect password.", dto.Email);
                    return Results.BadRequest(new
                    {
                        StatusCode = 400,
                        Message = "Invalid username or password. Please try again."
                    });
                }

                var token = JwtHelper.GenerateJwtToken(user.Id.ToString(), user.Email, user.Role, config["Jwt:Key"]);
                logger.LogInformation("User {Email} logged in successfully.", dto.Email);
                return Results.Ok(new
                {
                    Token = token,
                    Role = user.Role, // Include the user's role in the response

                    Message = "Login successful."
                });
            }).WithName("LoginUser");

            group.MapPost("/logout", (HttpContext context, ILogger<User> logger) =>
            {
                // Invalidate the token on the client side by clearing it
                logger.LogInformation("User logged out successfully.");
                return Results.Ok(new
                {
                    Message = "Logout successful. Please clear the token from the client side."
                });
            }).WithName("LogoutUser");

            // Get all users (Admin only)
            group.MapGet("/", async (IUserRepository repository, ILogger<User> logger) =>
            {
                try
                {
                    logger.LogInformation("Fetching all users.");
                    var users = await repository.GetAllAsync();

                    // Map users to DTO or return necessary fields
                    return Results.Ok(users.Select(u => new
                    {
                        Id = u.Id,
                        Username = u.Username,
                        Email = u.Email,
                        Role = u.Role,
                        CreatedDate = u.CreatedDate
                    }));
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while fetching users: {ErrorMessage}", ex.Message);
                    return Results.Problem(
                        title: "Failed to Retrieve Users",
                        detail: "An unexpected error occurred. Please try again later.",
                        statusCode: 500
                    );
                }
            });
            // Get user by ID
            group.MapGet("/{id:guid}", async (Guid id, IUserRepository repository, ILogger<User> logger) =>
            {
                try
                {
                    var user = await repository.GetByIdAsync(id);
                    if (user == null) return Results.NotFound($"User with ID {id} not found.");

                    return Results.Ok(new
                    {
                        Id = user.Id,
                        Username = user.Username,
                        Email = user.Email,
                        Role = user.Role,
                        CreatedDate = user.CreatedDate
                    });
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while fetching the user: {ErrorMessage}", ex.Message);
                    return Results.Problem(
                        title: "Failed to Retrieve User",
                        detail: "An unexpected error occurred. Please try again later.",
                        statusCode: 500
                    );
                }
            }).WithName("GetUserById");

            // Update user
            group.MapPut("/{id:guid}", async (Guid id, UserCreateUpdateDto dto, IUserRepository repository, ILogger<User> logger) =>
            {
                try
                {
                    var existingUser = await repository.GetByIdAsync(id);
                    if (existingUser == null) return Results.NotFound($"User with ID {id} not found.");

                    existingUser.Username = dto.Username;
                    existingUser.Email = dto.Email;
                    existingUser.Role = dto.Role;

                    await repository.UpdateAsync(existingUser);
                    return Results.NoContent();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while updating the user: {ErrorMessage}", ex.Message);
                    return Results.Problem(
                        title: "User Update Failed",
                        detail: "An unexpected error occurred. Please try again later.",
                        statusCode: 500
                    );
                }
            }).WithName("UpdateUser");

            // Delete user
            group.MapDelete("/{id:guid}", async (Guid id, IUserRepository repository, ILogger<User> logger) =>
            {
                try
                {
                    var existingUser = await repository.GetByIdAsync(id);
                    if (existingUser == null) return Results.NotFound($"User with ID {id} not found.");

                    await repository.DeleteAsync(existingUser.Id);
                    return Results.NoContent();
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "An error occurred while deleting the user: {ErrorMessage}", ex.Message);
                    return Results.Problem(
                        title: "User Deletion Failed",
                        detail: "An unexpected error occurred. Please try again later.",
                        statusCode: 500
                    );
                }
            }).WithName("DeleteUser");
        }

    }
  }
