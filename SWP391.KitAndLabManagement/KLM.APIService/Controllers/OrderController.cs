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
        private readonly FirebaseStorageService _firebaseService;
        public OrderController(UnitOfWork unitOfWork, FirebaseStorageService firebaseService)
        {
            _unitOfWork = unitOfWork;
            _firebaseService = firebaseService;
        }



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
            newOrder.OrderDate = DateTime.Now;
            newOrder.Status = "Processing";
            _unitOfWork.OrderTblRepository.Create(newOrder);
            return Ok(newOrder);
        }

        [HttpGet("{accountId}")]
        public async Task<IActionResult> GetOrderByAccountId(string accountId)
        {
            return Ok(await _unitOfWork.OrderTblRepository.GetAllOrderTblByAccountId(accountId));
        }

        [HttpPut($"StaffUpdateOrder/{{orderId}}")]
        public async Task<IActionResult> UpdateOrderStatus(string orderId)
        {
            List<OrderTbl> orderUpdate = await _unitOfWork.OrderTblRepository.GetAllOrderTbl();
            foreach (var o in orderUpdate)
            {
                if (o.OrderId.Equals(orderId))
                {
                    o.Status = "Shipped";
                    _unitOfWork.OrderTblRepository.Update(o);
                    return Ok(o);
                }
            }
            return BadRequest("Not Found");
        }

        [HttpPut($"CustomerUpdateOrder/{{orderId}}")]
        public async Task<IActionResult> ConfirmRecivedOrder(string orderId)
        {
            List<OrderTbl> listOrder = await _unitOfWork.OrderTblRepository.GetAllOrderTbl();
            foreach (var x in listOrder)
            {
                if (x.OrderId.Equals(orderId))
                {
                    x.Status = "Done";
                    _unitOfWork.OrderTblRepository.Update(x);
                    return Ok();
                }
            }
            return BadRequest("Not Found");
        }

        [HttpGet("QrResponse")]
        public async Task<IActionResult> QrResponse()
        {
            try
            {
                bool latestPayment = await _firebaseService.AnyTransactionExists();
                await _firebaseService.DeleteAllTransactionsAsync();
                if (latestPayment)
                {

                    return Ok("Success");
                }
                else
                {
                    return BadRequest("Failed");
                }

            }
            catch (Exception ex)
            {
                return BadRequest($"Something wrong, line 92 - orderController : {ex}");
            }
        }

    }
}
