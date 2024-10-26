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

    [HttpPost("send-otp")]
    public async Task<IActionResult> SendOtp([FromBody] EmailRequest request)
    {
        if (string.IsNullOrEmpty(request.To))
            return BadRequest("Recipient email is required.");

        // Tạo mã OTP 6 chữ số ngẫu nhiên
        var otp = new Random().Next(100000, 999999).ToString();

        // Lưu mã OTP vào cache hoặc database (tùy theo yêu cầu)
        // Giả sử bạn lưu vào bộ nhớ tạm thời bằng cache

        // Gửi mã OTP qua email
        await _emailService.SendEmailAsync(request.To, request.Subject, request.Body + otp);

        return Ok(new { otp = otp, message = "OTP sent successfully." });
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

    //[HttpPost("SendBill")]
    //public async Task<IActionResult> SendBill([FromBody] SendBillRequest request)
    //{
    //    if (request.ListOrderDetail != null && request.ListOrderDetail.Any())
    //    {
    //        // Tạo nội dung email với HTML Table
    //        string content = @"
    //        <h2 style='text-align: center;'>Hóa đơn của bạn</h2>
    //        <table style='width: 100%; border-collapse: collapse;' border='1' cellpadding='5'>
    //            <thead>
    //                <tr style='background-color: #f2f2f2;'>
    //                    <th style='text-align: left;'>STT</th>
    //                    <th style='text-align: left;'>Tên Kit</th>
    //                    <th style='text-align: center;'>Số Lượng</th>
    //                    <th style='text-align: right;'>Giá</th>
    //                </tr>
    //            </thead>
    //            <tbody>
    //    ";

    //        // Thêm từng dòng của danh sách chi tiết đơn hàng
    //        string bodyContent = string.Join("",
    //            request.ListOrderDetail.Select((detail, index) => $@"
    //            <tr>
    //                <td style='text-align: left;'>{index + 1}</td>
    //                <td style='text-align: left;'>{detail.KitName}</td>
    //                <td style='text-align: center;'>{detail.KitQuantity}</td>
    //                <td style='text-align: right;'>{detail.Price:C}</td>
    //            </tr>
    //        "));

    //        // Kết thúc bảng
    //        content += bodyContent + "</tbody></table>";

    //        // Gửi email với nội dung HTML
    //        await _emailService.SendEmailAsync(
    //            request.EmailRequest.To,
    //            request.EmailRequest.Subject,
    //            content // Nội dung HTML được truyền trực tiếp
    //        );
    //    }
    //    return Ok();
    //}

}