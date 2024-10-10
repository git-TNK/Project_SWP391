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


        //get all order, khi staff bam vao Quan li do hang de proccess cac don hang
        [HttpGet]
        public async Task<List<OrderTbl>> GetOrder()
        {
            return await _unitOfWork.OrderTblRepository.GetAllOrderTbl();
        }

        //get specific order by ID (khi customer bam vao lich su giao dich)

    }
}
