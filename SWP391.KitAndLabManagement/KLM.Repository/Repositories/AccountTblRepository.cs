using KLM.Repository.Base;
using KLM.Repository.Models;
using KLM.Repository.ModelView;
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
        

        //get account for admin
        public async Task<List<AccountDTO>> GetAccountForAdmin()
        {
            var listOfAccount = await _context.Set<AccountTbl>().Select(a => new AccountDTO
            {
                accountId = a.AccountId,
                username = a.UserName,
                password = a.Password,
                email = a.Email,
                fullName = a.FullName,
                phoneNumber = a.PhoneNumber,
                address = a.Address,
                role = a.Role,
                status = a.Status,
            }).ToListAsync();
            return listOfAccount;
        }

        //promotion account
        public async Task<bool> PromotingAccount(string id)
        {
            var accountSearch = await _context.Set<AccountTbl>().FirstOrDefaultAsync(e => e.AccountId == $"{id}" && e.Role != "Admin");

            if (accountSearch == null)
            {
                return false;
            }

            if(accountSearch.Role == "Staff")
            {
                accountSearch.Role = "Customer";
            }
            else
            {
                accountSearch.Role = "Staff";
            }

            await _context.SaveChangesAsync();

            return true;
        }

        //banning account
        public async Task<bool> BanningAccount(string id)
        {
            var accountSearch = await _context.Set<AccountTbl>().FirstOrDefaultAsync(e => e.AccountId == $"{id}" && e.Role != "Admin");

            if (accountSearch == null)
            {
                return false;
            }

            if (accountSearch.Status == "Active")
            {
                accountSearch.Status = "DeActive";
            }
            else
            {
                accountSearch.Status = "Active";
            }

            await _context.SaveChangesAsync();
            return true;
        }
    }
}