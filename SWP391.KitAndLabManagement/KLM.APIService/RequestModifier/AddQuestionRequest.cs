using System.ComponentModel.DataAnnotations;

namespace KLM.APIService.RequestModifier
{
    public class AddQuestionRequest
    {
        [Required]
        public string accounId { get; set; }
        [Required]
        public string question { get; set; }
        [Required]
        public string labName { get; set; }
        [Required]
        public IFormFile? File { get; set; }
    }
}
