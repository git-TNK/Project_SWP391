using KLM.Repository;
using KLM.Repository.Models;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace KLM.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnswerController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly FirebaseStorageService _firebaseStorageService;
        public AnswerController(UnitOfWork unitOfWork, FirebaseStorageService firebaseStorageService)
        {
            _unitOfWork ??= unitOfWork;
            _firebaseStorageService ??= firebaseStorageService;
        }

        [HttpGet]
        public async Task<List<AnswerTbl>> GetAllAnswers()
        {
            return await _unitOfWork.AnswerTblRepository.GetAllAnswers();
        }

        [HttpPost("answerQuestion/{questionId}/{accountId}/{answer}/{labName}")]
        public async Task<IActionResult> CreatNewAnswer(string questionId, string accountId, string answer, string labName, IFormFile? acctachFile)
        {
            string? documentUrl = null;
            if (acctachFile != null && acctachFile.Length > 0)
            {
                using (var stream = acctachFile.OpenReadStream())
                {
                    var uploadUrl = await _firebaseStorageService.UploadPDFAsync(stream, acctachFile.FileName, acctachFile.ContentType);
                    documentUrl = uploadUrl;
                }
            }
            var listQuestion = _unitOfWork.QuestionTblRepository.GetAllQuestions();
            foreach (var x in await listQuestion)
            {
                if (x.QuestionId.Equals(questionId))
                {
                    x.Status = "Answered";
                    _unitOfWork.QuestionTblRepository.Update(x);
                }
            }
            var result = new AnswerTbl();
            result.AnswerId = questionId;
            result.QuestionId = questionId;
            result.AccountId = accountId;
            result.Answer = answer;
            result.LabName = labName;
            result.AttachedFile = documentUrl;
            result.DateOfAnswer = DateOnly.FromDateTime(DateTime.Now.Date);
            result.Status = "Answered";
            if (documentUrl != null)
            {
                await _firebaseStorageService.DeleteDocumentAsync(documentUrl);
            }
            _unitOfWork.AnswerTblRepository.Create(result);
            return Ok(result);
        }

        [HttpGet("getAnswerById/{accountId}")]
        public async Task<IActionResult?> GetAnswerById(string accountId)
        {
            var check = _unitOfWork.AnswerTblRepository.GetAllAnswerByAccId(accountId);
            if (check != null)
            {
                return Ok(await _unitOfWork.AnswerTblRepository.GetAllAnswerByAccId(accountId));
            }
            return NotFound();
        }

    }
}
