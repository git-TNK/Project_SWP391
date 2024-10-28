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


        [HttpGet("{id}")]
        public async Task<ActionResult<LabDTO>> GetLabWithChosenId(string id)
        {
            return await _unitOfWork.LabTblRepository.GetLabById(id);
        }



        [HttpPost("AddLab")]
        public async Task<IActionResult> UploadLab(AddLabRequest request)
        {
            string? documentUrl;

            if (request.document is not null)
            {
                using (var stream = request.document.OpenReadStream())
                {
                    var uploadUrl = await _firebaseStorageService.UploadPDFAsync(stream, request.document.FileName, request.document.ContentType);
                    documentUrl = uploadUrl;
                }
            }
            else { documentUrl = null; }

            if (documentUrl == null || documentUrl.Length == 0)
            {
                return BadRequest("No document uploaded");
            }

            string labName = request.labName;
            string description = request.description;
            List<string> types = request.labTypes;
            DateTime DateOfCreation = DateTime.Now;

            string result = await _unitOfWork.LabTblRepository.CreateLab(labName, description, documentUrl, types, DateOfCreation);

            if (string.IsNullOrWhiteSpace(result))
            {
                return Ok("Added lab");
            }
            else
            {
                //neu fail thi delete lab trong firebase
                await _firebaseStorageService.DeleteDocumentAsync(documentUrl);
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
        [HttpPut("{id}/UpdateLab")]

        public async Task<IActionResult> UpdateLabInfo(string id, AddLabRequest request)
        {

            string? documentUrl = null;
            bool isNewFileUpload = false;


            if (request.document != null && request.document.Length > 0)
            {
                //qua trinh upload file gap van de
                using (var stream = request.document.OpenReadStream())
                {
                    documentUrl = await _firebaseStorageService.UploadPDFAsync(stream, request.document.FileName, request.document.ContentType);
                }
                isNewFileUpload = true;
            }



            //if (documentUrl == null || documentUrl.Length == 0)
            //    return BadRequest("No file uploaded");


            string labName = request.labName.Trim();
            string description = request.description.Trim();
            List<string> labTypes = request.labTypes;
            DateTime dateOfChange = DateTime.Now;

            //return (errors, oldImageUrl);
            var (errors, oldDocumentUrl) = await _unitOfWork.LabTblRepository.UpdateLab(id, labName, description, documentUrl, labTypes, dateOfChange, isNewFileUpload);

            if (string.IsNullOrWhiteSpace(errors))
            {
                if (isNewFileUpload && !string.IsNullOrWhiteSpace(oldDocumentUrl))
                {
                    //Xoa file cu khi co file moi upload
                    await _firebaseStorageService.DeleteDocumentAsync(oldDocumentUrl);
                }

                Console.WriteLine("Success");
                return Ok("Success");
            }
            else
            {

                if (isNewFileUpload)
                {
                    //neu fail can delete url tren firebase
                    await _firebaseStorageService.DeleteDocumentAsync(documentUrl);
                }

                Console.WriteLine($"{errors}");
                return BadRequest($"{errors}");
            }
        }

        //get lab for kit's add and update
        [HttpGet("GetLab")]
        public async Task<ActionResult<IEnumerable<LabForKit>>> GetLabForKit()
        {
            return await _unitOfWork.LabTblRepository.GetLabForAddUpdate();
        }
    }
}
