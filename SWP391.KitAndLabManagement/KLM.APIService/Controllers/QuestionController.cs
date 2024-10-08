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

        public QuestionController(UnitOfWork unitOfWork) => _unitOfWork ??= unitOfWork;

        [HttpGet]
        public async Task<List<QuestionTbl>> GetAllQuestions()
        {
            return await _unitOfWork.QuestionTblRepository.GetAllQuestions();
        }

    }
}
