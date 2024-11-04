using KLM.APIService.RequestModifier;
using KLM.Repository;
using KLM.Repository.ModelView;
using Microsoft.AspNetCore.Mvc;

namespace KLM.APIService.Controllers
{
    [Route("/[controller]")]
    [ApiController]

    public class ProductController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly FirebaseStorageService _firebaseStorageService;

        public ProductController(UnitOfWork unitOfWork, FirebaseStorageService firebaseStorageService)
        {
            _unitOfWork = unitOfWork;
            _firebaseStorageService = firebaseStorageService;
        }/*=> _unitOfWork = unitOfWork;*/


        //show all product
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDTO>>> GetProductKitDTO()
        {
            return await _unitOfWork.ProductKitTblRepository.GetProductDTO();
        }


        //when click ON product
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductDTO>> GetProductKitByID(string id)
        {
            return await _unitOfWork.ProductKitTblRepository.GetKitById(id);
        }

        //Cho fe xu li dc ko
        //search product bang name
        [HttpGet("Search")]

        public async Task<ActionResult<IEnumerable<ProductDTO>>> SearchProduct(string productName)
        {
            //var productSearch = await _unitOfWork.ProductRepository.SearchProByName(productName);
            return await _unitOfWork.ProductKitTblRepository.SearchProByName(productName); ;
        }





        //Add product
        [HttpPost("AddProduct")]

        public async Task<IActionResult> UploadProduct(AddProductRequest request)
        {
            string imageUrl;

            using (var stream = request.picture.OpenReadStream())
            {
                var uploadUrl = await _firebaseStorageService.UploadImageAsync(stream, request.picture.FileName, request.picture.ContentType);
                imageUrl = uploadUrl;
            }

            if (imageUrl == null || imageUrl.Length == 0)
                return BadRequest("No file uploaded");

            string kitName = request.kitName.Trim();
            string brand = request.brand.Trim();
            string description = request.description.Trim();
            int price = request.price;
            int quantity = request.quantity;
            List<string> types = request.types;
            DateTime dateOfCreation = DateTime.Now;

            string result = await _unitOfWork.ProductKitTblRepository.CreateProduct(kitName, brand, description, imageUrl, price, quantity, types, dateOfCreation);

            if (string.IsNullOrWhiteSpace(result))
            {
                return Ok("Success");
            }
            else
            {
                //neu fail can delete anh tren firebase
                await _firebaseStorageService.DeleteImageAsync(imageUrl);
                return BadRequest(result);
            }
        }




        //Delete product, de status thanh deleted
        [HttpDelete("DeleteProduct")]

        public async Task<IActionResult> DeleteProductKit(string id)
        {
            bool result = false;

            result = await _unitOfWork.ProductKitTblRepository.DeleteProduct(id);


            if (result)
            {
                return Ok("Deleted");
            }
            else
            {
                return NotFound($"No product with {id} exist");
            }

        }



        //Update product
        [HttpPut("{id}/UpdateProduct")]
        public async Task<IActionResult> UpdateProductKit(string id, AddProductRequest request)
        {
            string? imageUrl = null;
            bool isNewImageUploaded = false;

            if (request.picture != null && request.picture.Length > 0)
            {
                using (var stream = request.picture.OpenReadStream())
                {
                    imageUrl = await _firebaseStorageService.UploadImageAsync(stream, request.picture.FileName, request.picture.ContentType);
                }
                isNewImageUploaded = true;
            }

            string kitName = request.kitName.Trim();
            string brand = request.brand.Trim();
            string description = request.description.Trim();
            int price = request.price;
            int quantity = request.quantity;
            List<string> types = request.types;
            DateTime dateOfChange = DateTime.Now;

            var (errors, oldImageUrl) = await _unitOfWork.ProductKitTblRepository.UpdateProduct(
                id, kitName, brand, description, imageUrl, price, quantity, types, dateOfChange, isNewImageUploaded);

            if (string.IsNullOrWhiteSpace(errors))
            {
                if (isNewImageUploaded && !string.IsNullOrWhiteSpace(oldImageUrl))
                {
                    //Xoa anh cu khi co anh moi upload
                    await _firebaseStorageService.DeleteImageAsync(oldImageUrl);
                }
                Console.WriteLine("Success");
                return Ok("Success");
            }
            else
            {
                if (isNewImageUploaded)
                {
                    //neu fail can delete url tren firebase
                    await _firebaseStorageService.DeleteImageAsync(imageUrl);
                }
                Console.WriteLine($"{errors}");
                return BadRequest($"{errors}");
            }
        }


        //update so luong kit con lai trong kho
        [HttpPut("{kitId}, {quantity}")]
        public IActionResult UpdateQuantityOfKitProduct(string kitId, int quantity)
        {
            var updatingProduct = _unitOfWork.ProductKitTblRepository.GetById(kitId);
            if (updatingProduct != null)
            {
                updatingProduct.Quantity = quantity;
                _unitOfWork.ProductKitTblRepository.Update(updatingProduct);
                return Ok(updatingProduct);
            }
            else
            {
                return BadRequest("Product not found");
            }
        }

        //lay kit cho add voi update lab
        [HttpGet("GetKit")]

        public async Task<ActionResult<IEnumerable<KitForLab>>> GetKitForLab()
        {
            return await _unitOfWork.ProductKitTblRepository.GetKitForAddUpdate();
        }
    }
}