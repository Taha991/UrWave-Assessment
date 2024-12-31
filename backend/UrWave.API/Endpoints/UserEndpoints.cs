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

            // Register a new user
            group.MapPost("/register", async (UserCreateUpdateDto dto, IUserRepository repository, ILogger<User> logger) =>
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
            }).WithName("RegisterUser");


            // Login
            group.MapPost("/login", async (UserLoginDto dto, IUserRepository repository, IConfiguration config, ILogger<User> logger) =>
            {
                var user = await repository.GetByUsernameAsync(dto.Username);
                if (user == null)
                {
                    logger.LogWarning("Login failed for username: {Username}. Reason: User not found.", dto.Username);
                    return Results.BadRequest(new
                    {
                        StatusCode = 400,
                        Message = "Invalid username or password. Please try again."
                    });
                }

                if (!PasswordHelper.VerifyPassword(dto.Password, user.PasswordHash)) // Use PasswordHelper
                {
                    logger.LogWarning("Login failed for username: {Username}. Reason: Incorrect password.", dto.Username);
                    return Results.BadRequest(new
                    {
                        StatusCode = 400,
                        Message = "Invalid username or password. Please try again."
                    });
                }

                var token = JwtHelper.GenerateJwtToken(user.Id.ToString(), user.Email, user.Role, config["Jwt:Key"]);
                logger.LogInformation("User {Username} logged in successfully.", dto.Username);
                return Results.Ok(new
                {
                    Token = token,
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
                var users = await repository.GetAllAsync();
                return Results.Ok(users.Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Role,
                    u.CreatedDate
                }));
            }).RequireAuthorization(policy => policy.RequireRole("Admin")).WithName("GetAllUsers");
        }
    }
}
