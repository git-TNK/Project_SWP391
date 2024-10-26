namespace KLM.APIService.RequestModifier
{
    public class LoginRequest
    {
        public string userNameOrEmail { get; set; }

        public string password { get; set; }
    }
}
