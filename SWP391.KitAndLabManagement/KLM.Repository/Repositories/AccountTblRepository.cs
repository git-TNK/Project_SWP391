using KLM.Repository.Base;
using KLM.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace KLM.Repository.Repositories
{
    public class AccountTblRepository : GenericRepository<AccountTbl>
    {
        public AccountTblRepository(Swp391Context context) => _context ??= context;

        public async Task<List<AccountTbl>> GetAllAccounts()
        {
            return await _context.AccountTbls.Select(a => new AccountTbl
            {
                AccountId = a.AccountId,
                UserName = a.UserName,
                Password = a.Password,
                Address = a.Address,
                Email = a.Email,
                FullName = a.FullName,
                PhoneNumber = a.PhoneNumber,
                Status = a.Status,
                Role = a.Role,
                OrderTbls = a.OrderTbls,
            }).ToListAsync();
        }
    }
}