using System.ComponentModel.DataAnnotations;

namespace KLM.APIService.RequestModifier
{
    public class AddProductRequest
    {
        public string kitName { get; set; }

        public string brand { get; set; }

        public string description { get; set; }

        public IFormFile? picture { get; set; }

        [Range(1, int.MaxValue)]
        public int price { get; set; }

        [Range(1, int.MaxValue)]
        public int quantity { get; set; }

        public List<string> types { get; set; }
    }
}
