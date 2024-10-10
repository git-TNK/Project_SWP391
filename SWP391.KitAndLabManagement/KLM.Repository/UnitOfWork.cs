using KLM.Repository.Models;
using KLM.Repository.Repositories;

namespace KLM.Repository
{


    public class UnitOfWork
    {

        private readonly Swp391Context _context; //thg này đầu tiên là = null
        private ProductKitTblRepository _productKitTblRepository; //tương tự thg trên
        private LabTblRepository _labTblRepository;
        private AccountTblRepository _accountTblRepository;
        private OrderTblRepository _orderTblRepository;
        private AnswerTblRepository _answerTblRepository;
        private QuestionTblRepository _questionTblRepository;
        public UnitOfWork() => _context ??= new Swp391Context(); //2. Khởi tạo _context


        public ProductKitTblRepository ProductKitTblRepository
        {
            get
            {
                return _productKitTblRepository ??= new ProductKitTblRepository
                    (_context);
            }
        }

        public LabTblRepository LabTblRepository
        {
            get
            {
                return _labTblRepository ??= new LabTblRepository
                    (_context);
            }
        }

        public AccountTblRepository AccountTblRepository
        {
            get
            {
                return _accountTblRepository ??= new AccountTblRepository
                    (_context);
            }
        }

        public OrderTblRepository OrderTblRepository
        {
            get
            {
                return _orderTblRepository ??= new OrderTblRepository(_context);
            }
        }

        public AnswerTblRepository AnswerTblRepository
        {
            get
            {
                return _answerTblRepository ??= new AnswerTblRepository(_context);
            }
        }

        public QuestionTblRepository QuestionTblRepository
        {
            get
            {
                return _questionTblRepository ??= new QuestionTblRepository(_context);
            }
        }
    }
}
