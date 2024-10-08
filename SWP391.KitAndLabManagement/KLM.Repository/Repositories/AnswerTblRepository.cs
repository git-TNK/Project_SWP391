using KLM.Repository.Base;
using KLM.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace KLM.Repository.Repositories
{
    public class AnswerTblRepository : GenericRepository<AnswerTbl>
    {
        public AnswerTblRepository(Swp391Context context) => _context ??= context;

        public async Task<List<AnswerTbl>> GetAllAnswers()
        {
            return await _context.AnswerTbls.Select(x => new AnswerTbl
            {
                LabName = x.LabName,
                AnswerId = x.AnswerId,
                QuestionId = x.QuestionId,
                AccountId = x.AccountId,
                Answer = x.Answer,
                AttachedFile = x.AttachedFile,
                DateOfAnswer = x.DateOfAnswer,
                Status = x.Status,
            }).ToListAsync();
        }
    }
}
