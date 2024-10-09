using KLM.Repository;
using KLM.Repository.Models;
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
        public async Task<AccountTbl> CheckExistAccount(string userName, string password)
        {
            List<AccountTbl> account = _unitOfWork.AccountTblRepository.GetAll();
            for (int i = 0; i < account.Count; i++)
            {
                if (account[i].UserName.Equals(userName) && account[i].Password.Equals(password))
                {
                    return account[i];
                }
            }
            return null;
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
        public async Task<AccountTbl> ViewProfile(string userName)
        {
            var listAccount = await GetAccountTbls();
            foreach (var account in listAccount)
            {
                if (account.UserName.Equals(userName))
                {
                    return account;
                }
            }
            return null;
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
