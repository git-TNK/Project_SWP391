namespace KLM.APIService.RequestModifier
{
    public class EditProfileRequest
    {
        public string accountId { get; set; }

        public string phoneNumber { get; set; }

        public string address { get; set; }

        public string email { get; set; }

        public string fullName { get; set; }
    }
}
