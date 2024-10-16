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

        [HttpPost("{orderId}, {kitId}, {kitName}, {kitQuantity}, {price}")]
        public IActionResult AddOrderDetails(string orderId, string kitId, string kitName, decimal price, int kitQuantity)
        {
            OrderDetailTbl orderDetail = new OrderDetailTbl();
            orderDetail.OrderId = orderId;
            orderDetail.KitId = kitId;
            orderDetail.KitName = kitName;
            orderDetail.KitQuantity = kitQuantity;
            orderDetail.Price = price;
            _unitOfWork.OrderDetailsRepository.Create(orderDetail);
            return Ok(orderDetail);
        }

    }
}
