namespace KLM.APIService.RequestModifier
{
    public class ChangePasswordRequest
    {

        public string accountId { get; set; }

        public string oldPassword { get; set; }

        public string newPassword { get; set; }
    }
}
