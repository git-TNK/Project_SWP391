﻿using KLM.Repository;
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
            return BadRequest();
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


        [HttpPost("Register/{userName}/{password}/{email}/{fullName}/{phone}")]
        public async Task<IActionResult> Register(string userName, string password, string email, string fullName, string phone)
        {
            var listAccount = _unitOfWork.AccountTblRepository.GetAll();
            foreach (var account in listAccount)
            {
                if (account.Email.Equals(email) || account.UserName.Equals(userName))
                {
                    return BadRequest("Email or userName is duplicated");
                }
            }
            string accountId = "ACC" + (new Random().Next(000, 999));
            foreach (var x in listAccount)
            {
                if (x.AccountId.Equals(accountId))
                {
                    accountId = "ACC" + (new Random().Next(000, 999));
                }
            }
            AccountTbl registerAccount = new AccountTbl();
            registerAccount.AccountId = accountId;
            registerAccount.FullName = fullName;
            registerAccount.UserName = userName;
            registerAccount.Password = password;
            registerAccount.Email = email;
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
