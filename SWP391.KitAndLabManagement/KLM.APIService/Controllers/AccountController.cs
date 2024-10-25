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

        [HttpGet("{userNameOrMail},{password}")]
        public async Task<IActionResult> CheckExistAccount(string userNameOrMail, string password)
        {
            List<AccountTbl> account = await _unitOfWork.AccountTblRepository.GetAllAccounts();
            for (int i = 0; i < account.Count; i++)
            {
                if ((account[i].UserName.Equals(userNameOrMail) || account[i].Email.Equals(userNameOrMail)) && account[i].Password.Equals(password))
                {
                    if (account[i].Status == "DeActive")
                    {
                        return BadRequest("Tài khoản của bạn đã bị chặn vui lòng liên hệ: FPT University - kitcentral@gmail.com");
                    }
                    return Ok(account[i]);
                }
            }
            return BadRequest("Sai tài khoản hoặc mật khẩu");
        }

        //get account for admin page
        [HttpGet("AccountManage")]
        public async Task<List<AccountDTO>> GetAccountForAdmin()
        {
            return await _unitOfWork.AccountTblRepository.GetAccountForAdmin();
        }

        //Account promotion
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

        //Account banning
        [HttpPut("AccountBanning")]
        public async Task<IActionResult> Banning(string id)
        {
            bool result = await _unitOfWork.AccountTblRepository.BanningAccount(id);

            if (result)
            {
                Console.WriteLine($"Banned or unbanned account {id}");
                return Ok("Success");
            }
            else
            {
                Console.WriteLine($"Failed to ban or unban account {id}");
                return BadRequest("Fail to ban");
            }
        }


        [HttpPost("Register")]

        public async Task<IActionResult> Register(AccountTbl request)
        {
            var listAccount = _unitOfWork.AccountTblRepository.GetAll();
            AccountTbl? idCheck;
            string? accountId;
            foreach (var account in listAccount)
            {
                if (account.Email.Equals(request.Email) && account.UserName.Equals(request.UserName))
                {
                    Console.WriteLine("Both existed");
                    return BadRequest("Both existed");
                }
                else if (account.Email.Equals(request.Email))
                {
                    Console.WriteLine("Email existed");
                    return BadRequest("Email existed");
                }
                else if (account.UserName.Equals(request.UserName))
                {
                    Console.WriteLine("Username already existed");
                    return BadRequest("Username existed");
                }
            }

            //foreach (var x in listAccount)
            //{
            //    if (x.AccountId.Equals(accountId))
            //    {
            //        accountId = "ACC" + (new Random().Next(000, 999));
            //    }
            //}

            do
            {
                accountId = "ACC" + (new Random().Next(000, 999));
                idCheck = _unitOfWork.AccountTblRepository.GetById(accountId);
            } while (idCheck != null);

            AccountTbl registerAccount = new AccountTbl();
            registerAccount.AccountId = accountId;
            registerAccount.FullName = request.FullName.Trim();
            registerAccount.UserName = request.UserName.Trim();
            registerAccount.Password = request.Password.Trim();
            registerAccount.PhoneNumber = request.PhoneNumber.Trim();
            registerAccount.Email = request.Email.Trim();
            registerAccount.Role = "Customer";
            registerAccount.Status = "Active";
            registerAccount.DateOfCreation = DateOnly.FromDateTime(DateTime.Now);
            _unitOfWork.AccountTblRepository.Create(registerAccount);
            return Ok("Success");
        }


        [HttpGet]
        public async Task<List<AccountTbl>> GetAccountTbls()
        {
            return await _unitOfWork.AccountTblRepository.GetAllAccounts();
        }

        [HttpGet("{userName}")]
        public async Task<IActionResult?> ViewProfile(string userName)
        {
            var listAccount = await GetAccountTbls();
            foreach (var account in listAccount)
            {
                if (account.UserName.Equals(userName))
                {
                    return Ok(account);
                }
            }
            return null;
        }

        [HttpPut("{accountId},{phoneNumber},{address},{email},{fullName}")]
        public async Task<bool> UpdateProfile(string accountId, string phoneNumber, string address, string email, string fullName)
        {
            var listAcc = await GetAccountTbls();
            foreach (var account in listAcc)
            {
                if (account.AccountId.Equals(accountId))
                {
                    account.PhoneNumber = phoneNumber;
                    account.Address = address;
                    account.Email = email;
                    account.FullName = fullName;
                    _unitOfWork.AccountTblRepository.Update(account);
                    return true;
                }
            }
            return false;
        }

        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassword(string accountId, string oldPassword, string newPassword)
        {
            var account = await _unitOfWork.AccountTblRepository.GetAllAccounts();
            foreach (var item in account)
            {
                if (item.AccountId.Equals(accountId) && item.Password.Equals(oldPassword))
                {
                    item.Password = newPassword;
                    _unitOfWork.AccountTblRepository.Update(item);
                    return Ok(item);
                }
            }
            return BadRequest("Mật khẩu nhập không chính xác");
        }
    }
}
