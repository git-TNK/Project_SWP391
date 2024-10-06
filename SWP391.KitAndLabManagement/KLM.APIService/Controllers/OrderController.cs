using KLM.Repository;
using KLM.Repository.Models;
using Microsoft.AspNetCore.Mvc;

namespace KLM.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        public OrderController() => _unitOfWork ??= new UnitOfWork();

        [HttpGet]
        public async Task<List<OrderTbl>> GetOrder()
        {
            return await _unitOfWork.OrderTblRepository.GetAllOrderTbl();
        }
    }
}
