using KLM.APIService.RequestModifier;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class EmailController : ControllerBase
{
    private readonly EmailService _emailService;

    public EmailController(EmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendEmail([FromBody] EmailRequest request)
    {
        if (string.IsNullOrEmpty(request.To))
            return BadRequest("Recipient email is required.");

        await _emailService.SendEmailAsync(request.To, request.Subject, request.Body);
        return Ok("Email sent successfully.");
    }
}