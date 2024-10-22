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
            List<ProductKitTbl> productKits = _unitOfWork.ProductKitTblRepository.GetAll();
            List<QuestionTbl> listQuestion = await _unitOfWork.QuestionTblRepository.GetQuestionByAccountId(accounId);
            List<DateTime> latestQuestion = new List<DateTime>();

            if (listOrder == null || !listOrder.Any())
            {
                // Xử lý trường hợp không có đơn hàng nào
                return BadRequest("No orders found for the specified account.");
            }

            List<DateTime> DateOrder = listOrder.Select(x => x.OrderDate).ToList();

            // Kiểm tra nếu DateOrder không có phần tử nào
            if (!DateOrder.Any())
            {
                return BadRequest("No valid order dates found.");
            }
            if (listOrder != null)
            {
                DateTime newestTime = DateOrder.Max();
                string orderId = "";
                foreach (var item in listOrder)
                {
                    if (item.OrderDate.Equals(newestTime))
                    {
                        orderId = item.OrderId;
                    }
                }

                //===================================================
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


                //Neu mua them thi cong them luot          
                foreach (var x in listQuestion)
                {
                    latestQuestion.Add(x.DateOfQuestion);
                }
                var latestQuestionCreate = latestQuestion.Max();
                foreach (var item in listQuestion)
                {
                    if (item.DateOfQuestion.Equals(latestQuestionCreate))
                    {
                        item.Turn = item.Turn + kitQuantity * 2;
                        _unitOfWork.QuestionTblRepository.Update(item);
                    }
                }
                return Ok(orderDetail);
            }
            //else if (listOrder == null)
            //{
            //    //for if Account first order
            //    return Ok(await AddOrderDetails(accounId, kitId, kitName, price, kitQuantity));
            //}
            else { return BadRequest(); }
        }



        [HttpGet("AllOrderDetail")]
        public async Task<ActionResult<IEnumerable<OrderDetailTbl>>> GetListForDashboard()
        {
            return await _unitOfWork.OrderDetailsRepository.GetAllOrderDetail();
        }

    }
}
