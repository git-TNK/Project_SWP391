using System.ComponentModel.DataAnnotations;

namespace KLM.APIService.RequestModifier
{
    public class AddProductRequest
    {
        [Required]
        public string kitName { get; set; }

        [Required]
        public string brand { get; set; }

        [Required]
        public string description { get; set; }

        [Required]
        public IFormFile picture { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int price { get; set; }

        [Required]
        [Range(1, int.MaxValue)]
        public int quantity { get; set; }

        [Required]
        public List<string> types { get; set; }
    }
}
