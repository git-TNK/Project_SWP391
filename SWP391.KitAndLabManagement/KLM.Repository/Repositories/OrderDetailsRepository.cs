using KLM.Repository.Base;
using KLM.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace KLM.Repository.Repositories
{
    public class OrderDetailsRepository : GenericRepository<OrderDetailTbl>
    {
        public OrderDetailsRepository(Swp391Context context) => _context ??= context;

        public async Task<List<OrderDetailTbl>> getAllOrdersDetailsById(string orderId)
        {
            return await _context.OrderDetailTbls.Select(o => new OrderDetailTbl
            {
                OrderId = o.OrderId,
                KitId = o.KitId,
                KitName = o.KitName,
                KitQuantity = o.KitQuantity,
                Price = o.Price,
            }).Where(ordId => ordId.Equals(orderId)).ToListAsync();
        }
    }
}
