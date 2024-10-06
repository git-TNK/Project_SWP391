using KLM.APIService.RequestModifier;
using KLM.Repository;
using KLM.Repository.ModelView;
using Microsoft.AspNetCore.Mvc;

namespace KLM.APIService.Controllers
{

    [Route("/[controller]")]
    [ApiController]

    public class LabController : ControllerBase
    {
        private readonly UnitOfWork _unitOfWork;
        private readonly FirebaseStorageService _firebaseStorageService;

        public LabController(UnitOfWork unitOfWork, FirebaseStorageService firebaseStorageService)
        {
            _unitOfWork = unitOfWork;
            _firebaseStorageService = firebaseStorageService;
        }


        [HttpGet]
        public async Task<ActionResult<IEnumerable<LabDTO>>> DisplayLabDto()
        {
            return await _unitOfWork.LabTblRepository.GetLabDto();
        }


        //cai search nay lam fe duoc ko?
        [HttpGet("SearchLab")]
        public async Task<ActionResult<IEnumerable<LabDTO>>> SearchLabByName(string input)
        {
            return await _unitOfWork.LabTblRepository.GetLabByName(input);
        }


        //testing upload pdf len firebase
        [HttpPost("UploadPDF(testing)")]
        public async Task<ActionResult> UploadPdfTest(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            using (var stream = file.OpenReadStream())
            {
                var uploadUrl = await _firebaseStorageService.UploadPDFAsync(stream, file.FileName, file.ContentType);
                return Ok(new { DownloadUrl = uploadUrl });
            }
        }



        //create lab(them kit)
        [HttpPost("AddLab")]
        public async Task<IActionResult> UploadLab(AddLabRequest request)
        {
            string documentUrl;

            using (var stream = request.document.OpenReadStream())
            {
                var uploadUrl = await _firebaseStorageService.UploadPDFAsync(stream, request.document.FileName, request.document.ContentType);
                documentUrl = uploadUrl;
            }

            if(documentUrl == null || documentUrl.Length == 0)
            {
                return BadRequest("No document uploaded");
            }

            string labName = request.labName;
            string description = request.description;
            List<string> types = request.labTypes;
            DateOnly DateOfCreation = DateOnly.FromDateTime(DateTime.Today.Date);

            string result = await _unitOfWork.LabTblRepository.CreateLab(labName, description,documentUrl, types, DateOfCreation);

            if (result != null)
            {
                return Ok("Added lab");
            }
            else
            {
                //neu fail thi delete lab trong firebase
                await _firebaseStorageService.DeleteImageAsync(documentUrl);
                return BadRequest($"{result}");
            }
        }


        //delete lab (xoa cac kit lien quan)
        [HttpDelete("DeleteLab")]
        public async Task<IActionResult> DeleteLab(string id)
        {
            bool result = false;

            result = await _unitOfWork.LabTblRepository.DeleteLabs(id);


            if (result)
            {
                return Ok("Deleted");
            }
            else
            {
                return NotFound($"No product with {id} exist");
            }
        }

        //update lab(them xoa kit neu can)
    }
}
