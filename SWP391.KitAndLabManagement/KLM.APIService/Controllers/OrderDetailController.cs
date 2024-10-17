using KLM.Repository;
using KLM.Repository.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KLM.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;

        public OrderDetailController(UnitOfWork unitOfWork) => _unitOfWork = unitOfWork;


        [HttpGet("{orderId}")]
        public async Task<List<OrderDetailTbl>> GetOrderDetailTbls(string orderId)
        {
            return await _unitOfWork.OrderDetailsRepository.GetAllOrdersDetailsById(orderId);
        }

        [HttpPost("{accounId}/{kitId}/{kitName}/{kitQuantity}/{price}")]
        public async Task<IActionResult> AddOrderDetails(string accounId, string kitId, string kitName, decimal price, int kitQuantity)
        {

            List<OrderTbl> listOrder = await _unitOfWork.OrderTblRepository.GetAllOrderTblByAccountId(accounId);
            List<ProductKitTbl> productKits = _unitOfWork.ProductKitTblRepository.GetAll();
            if (listOrder != null)
            {
                List<DateTime> DateOrder = new List<DateTime>();

                foreach (OrderTbl x in listOrder)
                {
                    DateOrder.Add(x.OrderDate);
                }
                DateTime latestDate = listOrder.Max(x => x.OrderDate);
                string orderId = "";
                foreach (var item in listOrder)
                {
                    if (item.OrderDate.Equals(latestDate))
                    {
                        orderId = item.OrderId;
                    }
                }

                OrderDetailTbl orderDetail = new OrderDetailTbl();
                orderDetail.OrderId = orderId;
                orderDetail.KitId = kitId;
                orderDetail.KitName = kitName;
                orderDetail.KitQuantity = kitQuantity;
                orderDetail.Price = price;
                _unitOfWork.OrderDetailsRepository.Create(orderDetail);
                foreach (var item in productKits)
                {
                    if (orderDetail.KitId.Equals(item.KitId))
                    {
                        item.Quantity = item.Quantity - kitQuantity;
                        _unitOfWork.ProductKitTblRepository.Update(item);
                    }
                }
                return Ok(orderDetail);
            }
            else { return BadRequest(); }
        }

    }
}
