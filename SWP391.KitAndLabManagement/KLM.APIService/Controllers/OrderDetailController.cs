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
        private readonly FirebaseStorageService _firebaseService;

        public OrderDetailController(UnitOfWork unitOfWork, FirebaseStorageService firebaseService)
        {
            _unitOfWork = unitOfWork;
            _firebaseService = firebaseService;
        }


        [HttpGet("{orderId}")]
        public async Task<List<OrderDetailTbl>> GetOrderDetailTbls(string orderId)
        {
            return await _unitOfWork.OrderDetailsRepository.GetAllOrdersDetailsById(orderId);
        }

        [HttpPost("{accounId}/{kitId}/{kitName}/{kitQuantity}/{price}")]
        public async Task<IActionResult> AddOrderDetails(string accounId, string kitId, string kitName, decimal price, int kitQuantity)
        {
            List<OrderTbl> listOrder = await _unitOfWork.OrderTblRepository.GetAllOrderTblByAccountId(accounId);

            if (listOrder == null || !listOrder.Any())
            {
                return BadRequest("No orders found for the specified account.");
            }

            List<DateTime> DateOrder = listOrder.Select(x => x.OrderDate).ToList();

            if (DateOrder == null || !DateOrder.Any())
            {
                return BadRequest("No valid order dates found.");
            }

            DateTime newestTime = DateOrder.Max();
            string orderId = listOrder.First(item => item.OrderDate.Equals(newestTime)).OrderId;

            // Thêm chi tiết đơn hàng
            OrderDetailTbl orderDetail = new OrderDetailTbl
            {
                OrderId = orderId,
                KitId = kitId,
                KitName = kitName,
                KitQuantity = kitQuantity,
                Price = price
            };
            _unitOfWork.OrderDetailsRepository.Create(orderDetail);

            // Cập nhật số lượng sản phẩm
            List<ProductKitTbl> productKits = _unitOfWork.ProductKitTblRepository.GetAll();
            var productKit = productKits.FirstOrDefault(item => item.KitId.Equals(kitId));
            if (productKit != null)
            {
                productKit.Quantity -= kitQuantity;
                _unitOfWork.ProductKitTblRepository.Update(productKit);
            }

            // Cập nhật lượt câu hỏi
            //List<QuestionTbl> listQuestion = await _unitOfWork.QuestionTblRepository.GetQuestionByAccountId(accounId);
            //if (listQuestion != null && listQuestion.Any())
            //{
            //    var latestQuestionCreate = listQuestion.Max(q => q.DateOfQuestion);
            //    var latestQuestionItem = listQuestion.First(q => q.DateOfQuestion.Equals(latestQuestionCreate));
            //    latestQuestionItem.Turn += kitQuantity * 2;
            //    _unitOfWork.QuestionTblRepository.Update(latestQuestionItem);
            //}

            return Ok(orderDetail);
        }



        [HttpGet("AllOrderDetail")]
        public async Task<ActionResult<IEnumerable<OrderDetailTbl>>> GetListForDashboard()
        {
            return await _unitOfWork.OrderDetailsRepository.GetAllOrderDetail();
        }

    }
}
