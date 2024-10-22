using KLM.APIService.RequestModifier;
using KLM.Repository;
using KLM.Repository.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text;

[Route("api/[controller]")]
[ApiController]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;
    private readonly UnitOfWork _unitOfWork;

    public EmailController(EmailService emailService, UnitOfWork unitOfWork)
    {
        _emailService = emailService;
        _unitOfWork = unitOfWork;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        if (string.IsNullOrEmpty(request.To))
            return BadRequest("Recipient email is required.");

        await _emailService.SendEmailAsync(request.To, request.Subject, request.Body);
        return Ok("Email sent successfully.");
    }

    [HttpPut("sendMailForgotPassword/{email}")]
    public async Task<IActionResult> SendEmailForgotPassword([FromBody] EmailRequest request, string email)
    {
        List<AccountTbl> accountTbls = await _unitOfWork.AccountTblRepository.GetAllAccounts();
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        StringBuilder randomPassword = new StringBuilder();
        Random random = new Random();

        for (int i = 0; i < 8; i++)
        {
            int randomIndex = random.Next(chars.Length);
            randomPassword.Append(chars[randomIndex]);
        }

        string password = randomPassword.ToString();
        bool emailFound = false;

        foreach (var item in accountTbls)
        {
            if (item.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
            {
                item.Password = password;
                _unitOfWork.AccountTblRepository.Update(item);
                emailFound = true;
            }
        }

        if (!emailFound)
        {
            return NotFound("Email not found.");
        }

        if (string.IsNullOrEmpty(request.To))
            return BadRequest("Recipient email is required.");

        // Gửi email với mật khẩu mới
        await _emailService.SendEmailAsync(request.To, request.Subject, $"Here is your new password: {password}");
        return Ok("Email sent successfully.");
    }

}