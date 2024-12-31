using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UrWave.Application.DTOs;
using UrWave.Domain.Entities;

namespace UrWave.Application.Helpers
{
    public static class UserMapping
    {
        public static User ToEntity(this UserCreateUpdateDto dto)
        {
            return new User
            {
                Id = Guid.NewGuid(),
                Username = dto.Username,
                Email = dto.Email,
                PasswordHash = HashPassword(dto.Password),
                Role = dto.Role,
                CreatedDate = DateTime.UtcNow
            };
        }

        public static UserViewDto ToViewDto(this User user)
        {
            return new UserViewDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                Role = user.Role,
                CreatedDate = user.CreatedDate
            };
        }

        public static void UpdateEntity(this User entity, UserCreateUpdateDto dto)
        {
            entity.Username = dto.Username;
            entity.Email = dto.Email;

            // Only update password if a new one is provided
            if (!string.IsNullOrEmpty(dto.Password))
            {
                entity.PasswordHash = HashPassword(dto.Password);
            }

            entity.Role = dto.Role;
        }

        private static string HashPassword(string password)
        {
            using var hmac = new System.Security.Cryptography.HMACSHA512();
            return Convert.ToBase64String(hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password)));
        }
    }
}
