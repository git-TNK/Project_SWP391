using System.ComponentModel.DataAnnotations;

namespace KLM.APIService.RequestModifier
{
    public class AddLabRequest
    {
        [Required]
        public string labName { get; set; }


        [Required]
        public string description { get; set; }

        [Required]
        public IFormFile document { get; set; }


        [Required]
        public List<string> labTypes { get; set; }
    }
}
