using KLM.Repository;
using KLM.Repository.Models;
using Microsoft.AspNetCore.Mvc;

namespace KLM.APIService.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        public OrderController() => _unitOfWork ??= new UnitOfWork();


        //get all order, khi staff bam vao Quan li don hang de proccess cac don hang
        [HttpGet]
        public async Task<List<OrderTbl>> GetOrder()
        {
            return await _unitOfWork.OrderTblRepository.GetAllOrderTbl();
        }

        [HttpPost("addOrder/{accountId}/{note}/{price}/{address}")]
        public async Task<IActionResult> AddOrder(string accountId, string note, string address, decimal price)
        {
            List<OrderTbl> listCheckOrderId = await GetOrder();
            OrderTbl newOrder = new OrderTbl();
            newOrder.OrderId = "ORD" + (new Random().Next(000, 999));
            foreach (var x in listCheckOrderId)
            {
                if (x.OrderId.Equals(newOrder.OrderId))
                {
                    newOrder.OrderId = "ORD" + (new Random().Next(000, 999));
                }
            }
            newOrder.AccountId = accountId;
            newOrder.Note = note;
            newOrder.Address = address;
            newOrder.Price = price;
            newOrder.OrderDate = DateOnly.FromDateTime(DateTime.Today.Date);
            newOrder.Status = "Processing";
            _unitOfWork.OrderTblRepository.Create(newOrder);
            return Ok(newOrder);
        }

        [HttpGet("{accountId}")]
        public async Task<IActionResult> GetOrderByAccountId(string accountId)
        {
            return Ok(await _unitOfWork.OrderTblRepository.GetAllOrderTblByAccountId(accountId));
        }

    }
}
