using KLM.Repository.Base;
using KLM.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace KLM.Repository.Repositories
{
    public class OrderTblRepository : GenericRepository<OrderTbl>
    {
        public OrderTblRepository(Swp391Context context) => _context ??= context;

        public async Task<List<OrderTbl>> GetAllOrderTbl()
        {
            return await _context.OrderTbls.Select(o => new OrderTbl
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate,
                AccountId = o.AccountId,
                Note = o.Note,
                Price = o.Price,
                Address = o.Address,
                ReceiveDate = o.ReceiveDate,
                Status = o.Status,
                OrderDetailTbls = o.OrderDetailTbls.ToList(),
            }).ToListAsync();
        }

        public async Task<List<OrderTbl>> GetAllOrderTblByAccountId(string accountId)
        {
            return await _context.OrderTbls.Select(o => new OrderTbl
            {
                OrderId = o.OrderId,
                OrderDate = o.OrderDate,
                AccountId = o.AccountId,
                Note = o.Note,
                Price = o.Price,
                Address = o.Address,
                ReceiveDate = o.ReceiveDate,
                Status = o.Status,
                OrderDetailTbls = o.OrderDetailTbls.ToList(),
            }).Where(o => o.AccountId.Equals(accountId)).ToListAsync();
        }

        public void UpdateOrder(OrderTbl orderUpdate)
        {
            _context.OrderTbls.Update(orderUpdate);
        }
    }
}
