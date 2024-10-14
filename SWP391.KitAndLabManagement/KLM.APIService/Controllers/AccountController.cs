using KLM.Repository;
using KLM.Repository.Models;
using KLM.Repository.ModelView;
using Microsoft.AspNetCore.Mvc;

namespace KLM.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;

        public AccountController(UnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        [HttpGet("{userName},{password}")]
        public async Task<IActionResult> CheckExistAccount(string userName, string password)
        {
            List<AccountTbl> account = await _unitOfWork.AccountTblRepository.GetAllAccounts();
            for (int i = 0; i < account.Count; i++)
            {
                if (account[i].UserName.Equals(userName) && account[i].Password.Equals(password))
                {
                    return Ok(account[i]);
                }
            }
            return NotFound();
        }

        //get account for admin page
        [HttpGet("AccountManage")]
        public async Task<List<AccountDTO>> GetAccountForAdmin()
        {
            return await _unitOfWork.AccountTblRepository.GetAccountForAdmin();
        }

        [HttpPut("AccountPromote")]
        public async Task<IActionResult> Promotion(string id)
        {
            bool result = await _unitOfWork.AccountTblRepository.PromotingAccount(id);

            if (result)
            {
                Console.WriteLine("Success");
                return Ok("Success");
            }
            else
            {
                Console.WriteLine("Failed to change role");
                return BadRequest("Fail to promote");
            }
        }


        [HttpPost("{userName},{fullName} ,{password},{email}")]
        public async Task<bool> Register(string userName, string password, string email, string fullName)
        {
            var listAccount = _unitOfWork.AccountTblRepository.GetAll();
            foreach (var account in listAccount)
            {
                if (account.Email.Equals(email))
                {
                    return false;
                }
            }
            string accountId = "ACC" + (new Random().Next(000, 999));
            if (await CheckExistAccount(userName, password) != null)
            {
                return false;
            }
            else
            {
                AccountTbl registerAccount = new AccountTbl();
                registerAccount.AccountId = accountId;
                registerAccount.FullName = fullName;
                registerAccount.UserName = userName;
                registerAccount.Password = password;
                registerAccount.Email = email;
                registerAccount.Role = "Member";
                registerAccount.Status = "Active";
                registerAccount.DateOfCreation = DateOnly.MaxValue;
                _unitOfWork.AccountTblRepository.Create(registerAccount);
                return true;
            }

        }
        [HttpGet]
        public async Task<List<AccountTbl>> GetAccountTbls()
        {
            return await _unitOfWork.AccountTblRepository.GetAllAccounts();
        }

        [HttpGet("{userName}")]
        public async Task<IActionResult> ViewProfile(string userName)
        {
            var listAccount = await GetAccountTbls();
            foreach (var account in listAccount)
            {
                if (account.UserName.Equals(userName))
                {
                    return Ok(account);
                }
            }
            return NotFound();
        }

        [HttpPut("{userName},{phoneNumber}, {address}")]
        public async Task<bool> UpdateProfile(string userName, string phoneNumber, string address)
        {
            var listAcc = await GetAccountTbls();
            foreach (var account in listAcc)
            {
                if (account.UserName.Equals(userName))
                {
                    account.PhoneNumber = phoneNumber;
                    account.Address = address;
                    _unitOfWork.AccountTblRepository.Update(account);
                    return true;
                }
            }
            return false;
        }
    }
}
