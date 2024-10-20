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
            string accountId = request.accounId;
            string question = request.question;
            string labName = request.labName;
            //DateTime DateOfCreation = DateTime.Now;
            string? documentUrl = null;
            int productBuying = 0;
            bool? isBuying = false;


            List<OrderTbl> checkOrderOfAccount = await _unitOfWork.OrderTblRepository.GetAllOrderTblByAccountId(accountId);
            if (checkOrderOfAccount != null)
            {
                isBuying = true;
                foreach (var x in checkOrderOfAccount)
                {
                    List<OrderDetailTbl> checkOrderDetailsOfAccount = await _unitOfWork.OrderDetailsRepository.GetAllOrdersDetailsById(x.OrderId);
                    foreach (var y in checkOrderDetailsOfAccount)
                    {
                        productBuying += y.KitQuantity;
                    }
                }
            }
            else { isBuying = false; }



            if (request.File != null && request.File.Length > 0)
            {
                using (var stream = request.File.OpenReadStream())
                {
                    var uploadUrl = await _firebaseStorageService.UploadPDFAsyncQuestion(stream, request.File.FileName, request.File.ContentType);
                    documentUrl = uploadUrl;
                }
            }

            if ((bool)isBuying)
            {
                Task<List<QuestionTbl>> listQuestions = _unitOfWork.QuestionTblRepository.GetAllQuestions();
                //Check turn con lai neu Account da hoi roi
                var result = new QuestionTbl();
                List<QuestionTbl> listCheckTurn = new();
                foreach (var x in await listQuestions)
                {
                    if (x.AccountId.Equals(accountId))
                    {
                        listCheckTurn.Add(x);
                    }
                }
                //==================================================================            
                foreach (var item in await listQuestions)
                {
                    if (item.AccountId.Equals(accountId))
                    {
                        int min = 100;
                        int checkTurn = 0;
                        foreach (var x in listCheckTurn)
                        {
                            if (x.Turn <= min)
                            {
                                min = x.Turn;
                                checkTurn = min;
                            }
                        }
                        if (checkTurn > 0)
                        {
                            result.QuestionId = "Q" + (new Random().Next(0, 999));

                            if (result.QuestionId.Equals(item.QuestionId))
                            {
                                result.QuestionId = "Q" + (new Random().Next(0, 999));
                            }
                            result.AccountId = accountId;
                            result.Question = question;
                            result.LabName = labName;
                            result.AttachedFile = documentUrl;
                            result.Status = "Active";
                            result.Turn = min - 1;
                            result.DateOfQuestion = DateTime.Now;
                            //if (documentUrl != null)
                            //{
                            //    await _firebaseStorageService.DeleteDocumentAsync(documentUrl);
                            //}
                            _unitOfWork.QuestionTblRepository.Create(result);
                            return Ok(result);
                        }
                        else if (checkTurn == 0)
                        {
                            return BadRequest("You end of turn to ask");
                        }
                    }
                }
                //Neu Account lan dau hoi thi khong can check turn nua

                result = new QuestionTbl();
                result.QuestionId = "Q" + (new Random().Next(0, 999));

                foreach (var item in await listQuestions)
                {
                    if (result.QuestionId.Equals(item.QuestionId))
                    {
                        result.QuestionId = "Q" + (new Random().Next(0, 999));
                    }
                }
                result.AccountId = accountId;
                result.Question = question;
                result.LabName = labName;
                result.AttachedFile = documentUrl;
                result.Status = "Active";
                result.Turn = productBuying * 2 - 1;
                result.DateOfQuestion = DateTime.Now;
                //if (documentUrl != null)
                //{
                //    await _firebaseStorageService.DeleteDocumentAsync(documentUrl);
                //}
                _unitOfWork.QuestionTblRepository.Create(result);
                return Ok(result);
            }
            else return BadRequest("Fail");
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
