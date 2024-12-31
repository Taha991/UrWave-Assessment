using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace UrWave.Application.Helpers
{
    public static class PasswordHelper
    {
        private const string FixedKey = "urWave-assignment"; // Use a consistent key

        public static string HashPassword(string password)
        {
            var key = Encoding.UTF8.GetBytes(FixedKey);
            using var hmac = new HMACSHA512(key);
            return Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
        }

        public static bool VerifyPassword(string password, string hashedPassword)
        {
            var key = Encoding.UTF8.GetBytes(FixedKey);
            using var hmac = new HMACSHA512(key);
            var computedHash = Convert.ToBase64String(hmac.ComputeHash(Encoding.UTF8.GetBytes(password)));
            return computedHash == hashedPassword;
        }
    }
}
