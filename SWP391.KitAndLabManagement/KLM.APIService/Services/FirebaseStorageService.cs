using Firebase.Storage;
using Google.Api.Gax.ResourceNames;
using Google.Cloud.Storage.V1;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Threading.Tasks;
using System.Web;

namespace KLM.APIService
{
    public class FirebaseStorageService
    {
        private readonly FirebaseStorage _firebaseStorage;
        private readonly StorageClient _storageClient;
        private readonly string _bucketName;

        //set up
        public FirebaseStorageService(IConfiguration configuration)
        {
            var firebaseConfig = configuration.GetSection("Firebase");
            var bucketName = firebaseConfig["StorageBucket"];
            var credentialPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Config", "swp391-2004-firebase-adminsdk-q3a4s-e95d2d073c.json");

            Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", credentialPath);

            _firebaseStorage = new FirebaseStorage(bucketName);
            _storageClient = StorageClient.Create();
            _bucketName = bucketName;
        }


        //add image vao folder Images tren firebase
        public async Task<string> UploadImageAsync(Stream fileStream, string fileName, string contentType)
        {
            string folderName = "Images";
            var imageName = $"{fileName}_{DateTime.UtcNow:HHmmssyyyyMMdd}";
            var fullPath = $"{folderName.Trim('/')}/{imageName}";

            var uploadTask = _firebaseStorage.Child(fullPath).PutAsync(fileStream, default);


            var downloadUrl = await uploadTask;
            return downloadUrl;
        }


        //download anh + file
        /*
        public async Task<MemoryStream> DownloadFileAsync(string fileName)
        {
            var memoryStream = new MemoryStream();
            await _storageClient.DownloadObjectAsync(_bucketName, fileName, memoryStream);
            memoryStream.Position = 0;
            return memoryStream;
        }
        */



        //delete anh 
        public async Task DeleteImageAsync(string imageURL)
        {
            //url mau
            //https://firebasestorage.googleapis.com/v0/b/swp391-2004.appspot.com/o/Images%2Fcat.jpg_090412?alt=media&token=37e0932a-f3eb-498a-9627-e9e4befc5710

            try
            {
                var uri = new Uri(imageURL);

                string path = HttpUtility.UrlDecode(uri.AbsolutePath);

                // xoa "/v0/b/[bucket-name]/o/"
                string[] pathParts = path.Split(new[] { "/o/" }, StringSplitOptions.None);

                string fileName = pathParts[1];

                // xoa parameters
                int indexOfQueryParam = fileName.IndexOf('?');
                if (indexOfQueryParam != -1)
                {
                    fileName = fileName.Substring(0, indexOfQueryParam);
                }

                //lay path : Images/cat.jpg
                string objectPath = fileName;

                //delete
                await _storageClient.DeleteObjectAsync(_bucketName, objectPath);
            }
            catch (Exception ex)
            {
                
                throw new Exception($"An error occurred while deleting the image: {ex.Message}", ex);
            }
        }


        //Upload file
        public async Task<string> UploadPDFAsync(Stream fileStream, string fileName, string contentType)
        {
            string folderName = "Labs";
            var PdfName = $"{fileName}_{DateTime.UtcNow:HHmmssyyyyMMdd}";
            var fullPath = $"{folderName.Trim('/')}/{PdfName}";

            var uploadTask = _firebaseStorage.Child(fullPath).PutAsync(fileStream, default);


            var downloadUrl = await uploadTask;
            return downloadUrl;
        }

        //Delete file




    }
}