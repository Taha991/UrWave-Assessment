using Microsoft.EntityFrameworkCore;
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
    public class UserRepository : GenericRepository<User>, IUserRepository
    {
        public UserRepository(AppDbContext context) : base(context) { }

        public async Task<User?> GetByEmailAsync(string Email)
        {
            return await _dbSet.FirstOrDefaultAsync(u => u.Email == Email);
        }
    }
}
