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
        [HttpPost("UploadPDF")]
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
        //[HttpPost("AddLab")]



        //delete lab (xoa cac kit lien quan)

        //update lab(them xoa kit neu can)
    }
}
