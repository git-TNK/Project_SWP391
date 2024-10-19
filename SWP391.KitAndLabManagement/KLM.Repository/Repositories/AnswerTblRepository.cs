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

        public async Task<List<AnswerTbl>> GetAllAnswerByAccId(string accountId)
        {
            return await _context.AnswerTbls.Select(a => new AnswerTbl
            {
                LabName = a.LabName,
                AnswerId = a.AnswerId,
                QuestionId = a.QuestionId,
                AccountId = a.AccountId,
                Answer = a.Answer,
                AttachedFile = a.AttachedFile,
                DateOfAnswer = a.DateOfAnswer,
                Status = a.Status,
            }).Where(a => a.AccountId.Equals(accountId)).ToListAsync();
        }

        public async Task<List<AnswerTbl>> GetAnswerByQuestionId(string questionId)
        {
            return await _context.AnswerTbls.Where(a => a.QuestionId == questionId).ToListAsync();
        }
    }
}
