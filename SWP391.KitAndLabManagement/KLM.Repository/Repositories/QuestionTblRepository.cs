using KLM.Repository.Base;
using KLM.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace KLM.Repository.Repositories
{
    public class QuestionTblRepository : GenericRepository<QuestionTbl>
    {
        public QuestionTblRepository(Swp391Context context) => _context ??= context;

        public async Task<List<QuestionTbl>> GetAllQuestions()
        {
            return await _context.QuestionTbls.Select(q => new QuestionTbl
            {
                QuestionId = q.QuestionId,
                AccountId = q.AccountId,
                Turn = q.Turn,
                Question = q.Question,
                LabName = q.LabName,
                AttachedFile = q.AttachedFile,
                DateOfQuestion = q.DateOfQuestion,
                Status = q.Status,
            }).ToListAsync();
        }

        public async Task<List<QuestionTbl>> GetQuestionByAccountId(string accountId)
        {
            return await _context.QuestionTbls.Where(q => q.AccountId == accountId).ToListAsync();
        }
    }
}