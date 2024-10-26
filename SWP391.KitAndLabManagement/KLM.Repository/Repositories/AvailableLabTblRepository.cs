using KLM.Repository.Base;
using KLM.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace KLM.Repository.Repositories
{
    public class AvailableLabTblRepository : GenericRepository<AvailableLabTbl>
    {
        public AvailableLabTblRepository(Swp391Context context) => _context ??= context;
        public async Task<List<AvailableLabTbl>> GetAllOrderedLabsByOrderedId(string orderId)
        {
            return await _context.AvailableLabTbls.Where(x => x.OrderId.Equals(orderId)).ToListAsync();
        }
    }
}
