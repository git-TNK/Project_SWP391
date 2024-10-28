using KLM.APIService.RequestModifier;
using KLM.Repository;
using KLM.Repository.Models;
using KLM.Repository.ModelView;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;

namespace KLM.APIService.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;

        public AccountController(UnitOfWork unitOfWork) => _unitOfWork = unitOfWork;

        [HttpPost("Login")]
        public async Task<IActionResult> CheckExistAccount([FromBody] LoginRequest request)
        {
            List<AccountTbl> account = await _unitOfWork.AccountTblRepository.GetAllAccounts();
            for (int i = 0; i < account.Count; i++)
            {
                if ((account[i].UserName.Equals(request.userNameOrEmail) || account[i].Email.Equals(request.userNameOrEmail)) && account[i].Password.Equals(request.password))
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
            bool sameUsername = false;
            bool sameEmail = false;


            foreach (var account in listAccount)
            {
                if (account.Email.Equals(request.Email))
                {
                    sameEmail = true;
                }
                if (account.UserName.Equals(request.UserName))
                {
                    sameUsername = true;
                }
                if (sameUsername && sameEmail)
                {
                    break;
                }
            }


            if (sameEmail && sameUsername)
            {
                Console.WriteLine("Both existed");
                return BadRequest("Both existed");
            }
            else if (sameEmail)
            {
                Console.WriteLine("Email existed");
                return BadRequest("Email existed");
            }
            else if (sameUsername)
            {
                Console.WriteLine("Username already existed");
                return BadRequest("Username existed");
            }



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

        [HttpPut("EditProfile")]
        public async Task<IActionResult> UpdateProfile([FromBody] EditProfileRequest request)
        {
            var listAcc = await GetAccountTbls();
            string cleanedPhone = request.phoneNumber.Trim().Replace(" ", "");

            // Biểu thức chính quy kiểm tra số điện thoại Việt Nam hợp lệ
            string pattern = @"^(0[3|5|7|8|9])\d{8}$";

            // Kiểm tra tính hợp lệ bằng Regex
            bool checkPhone = Regex.IsMatch(cleanedPhone, pattern);

            foreach (var account in listAcc)
            {
                if (request.email.Equals(account.Email))
                {
                    return BadRequest("Email đã tồn tại");
                }
                if (account.AccountId.Equals(request.accountId))
                {
                    account.PhoneNumber = request.phoneNumber;
                    account.Address = request.address;
                    account.Email = request.email;
                    account.FullName = request.fullName;
                    _unitOfWork.AccountTblRepository.Update(account);
                    return Ok(true);
                }
            }
            return BadRequest();
        }

        [HttpPut("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
        {
            var account = await _unitOfWork.AccountTblRepository.GetAllAccounts();
            foreach (var item in account)
            {
                if (item.AccountId.Equals(request.accountId) && item.Password.Equals(request.oldPassword))
                {
                    item.Password = request.newPassword;
                    _unitOfWork.AccountTblRepository.Update(item);
                    return Ok(item);
                }
            }
            return BadRequest("Mật khẩu nhập không chính xác");
        }
    }
}
