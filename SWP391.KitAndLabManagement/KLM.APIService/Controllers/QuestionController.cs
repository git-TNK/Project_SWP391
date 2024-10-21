using KLM.APIService.RequestModifier;
using KLM.Repository;
using KLM.Repository.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KLM.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly FirebaseStorageService _firebaseStorageService;

        public QuestionController(UnitOfWork unitOfWork, FirebaseStorageService firebaseStorageService)
        {
            _unitOfWork ??= unitOfWork;
            _firebaseStorageService ??= firebaseStorageService;
        }

        [HttpGet]
        public async Task<List<QuestionTbl>> GetAllQuestions()
        {
            return await _unitOfWork.QuestionTblRepository.GetAllQuestions();
        }

        [HttpGet("GetQuestionByAccountId/{accountId}")]
        public async Task<List<QuestionTbl>> GetQuestionByAccId(string accountId)
        {
            return await _unitOfWork.QuestionTblRepository.GetQuestionByAccountId(accountId);
        }

        [HttpPost("AddQuestion")]
        public async Task<IActionResult> CreateQuestion(AddQuestionRequest request)
        {
            string acccountId = request.accounId;
            string question = request.question;
            string labName = request.labName;
            string documentUrl;
            int minTurn = 0;
            //Lay so luong sp da mua
            int productBuying = 0;
            List<OrderTbl> listOrder = await _unitOfWork.OrderTblRepository.GetAllOrderTblByAccountId(acccountId);
            List<OrderDetailTbl> listOrderDetail = new List<OrderDetailTbl>();
            List<OrderDetailTbl> listAllOrderDetails = await _unitOfWork.OrderDetailsRepository.GetAllAsync();
            foreach (var x in listOrder)
            {
                foreach (var item in listAllOrderDetails)
                {
                    if (x.OrderId.Equals(item.OrderId))
                    {
                        listOrderDetail.Add(item);
                    }
                }
            }
            if (listOrderDetail.Any())
            {
                foreach (var item in listOrderDetail)
                {
                    productBuying += item.KitQuantity;
                }
            }
            //======
            using (var stream = request.File.OpenReadStream())
            {
                var uploadUrl = await _firebaseStorageService.UploadPDFAsync(stream, request.File.FileName, request.File.ContentType);
                documentUrl = uploadUrl;
            }

            string questionId = "Q" + (new Random().Next(000, 999));
            List<QuestionTbl> listQuestionByAcc = await _unitOfWork.QuestionTblRepository.GetQuestionByAccountId(acccountId);
            if (listQuestionByAcc.Any())
            {
                List<DateTime> listQuestionDateByAcc = listQuestionByAcc.Select(x => x.DateOfQuestion).ToList();
                if (listQuestionDateByAcc.Any())
                {
                    DateTime dateOfQuestionNewest = listQuestionDateByAcc.Max();
                    foreach (var x in listQuestionByAcc)
                    {
                        if (x.DateOfQuestion.Equals(dateOfQuestionNewest))
                        {
                            minTurn = x.Turn - 1;
                        }
                        if (x.QuestionId.Equals(questionId))
                        {
                            questionId = "Q" + (new Random().Next(000, 999));
                        }
                    }
                }
                QuestionTbl result = new QuestionTbl();
                result.QuestionId = questionId;
                result.AccountId = acccountId;
                result.Turn = minTurn;
                result.Question = question;
                result.LabName = labName;
                result.AttachedFile = documentUrl;
                result.Status = "Active";
                result.DateOfQuestion = DateTime.Now;
                _unitOfWork.QuestionTblRepository.Create(result);
                return Ok(result);
            }//Lan dau tien hoi
            else
            {
                QuestionTbl result = new QuestionTbl();
                result.QuestionId = questionId;
                result.AccountId = acccountId;
                result.Turn = productBuying * 2 - 1;
                result.Question = question;
                result.LabName = labName;
                result.AttachedFile = documentUrl;
                result.Status = "Active";
                result.DateOfQuestion = DateTime.Now;
                _unitOfWork.QuestionTblRepository.Create(result);
                return Ok(result);
            }
        }

        //Test dang file len question folder firebase
        /*
        [HttpPost("UploadQuestionPDF")]
        public async Task<IActionResult> UploadQuestionFile(IFormFile formFile)
        {
            string? documentUrl;
            try
            {

                using (var stream = formFile.OpenReadStream())
                {
                    var uploadUrl = await _firebaseStorageService.UploadPDFAsyncQuestion(stream, formFile.FileName, formFile.ContentType);
                    documentUrl = uploadUrl;
                }
            }
            catch (Exception ex) 
            {
                return BadRequest("No file uploaded");
            }
            if (documentUrl != null) 
            {
                return Ok($"Success uploaded: {documentUrl}");
            } else
            {
                return BadRequest("No file uploaded");
            }

        }
        */

    }
}
