using Azure.Core;
using KLM.Repository.Base;
using KLM.Repository.Models;
using KLM.Repository.ModelView;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KLM.Repository.Repositories
{
    public class ProductKitTblRepository : GenericRepository<ProductKitTbl>
    {
        public ProductKitTblRepository(Swp391Context context) => _context ??= context;


        //search kit dựa trên name mà user nhập vào Like '%input%'
        public async Task<List<ProductDTO>> SearchProByName(string userInput)
        {
            var searchedProducts = await _context.Set<ProductKitTbl>().Select(p => new ProductDTO
            {
                KitId = p.KitId,
                Name = p.Name,
                Brand = p.Brand,
                Description = p.Description,
                Picture = p.Picture,
                Price = p.Price,
                Quantity = p.Quantity,
                DateOfCreation = p.DateOfCreation,
                DateOfDeletion = p.DateOfDeletion,
                Status = p.Status,
                DateOfChange = p.DateOfChange,
                TypeNames = p.Ktypes.Select(k => k.TypeName).ToList(),
                Labs = p.Labs.ToList()
            })
                .Where(search => EF.Functions.Like(search.Name, $"%{userInput}%")).ToListAsync();
            return searchedProducts;
        }



        //Ham lam mau
        /*public async Task<List<ProductKitTbl>> GetAllAsyncNew()
        //{
        //    return await _context.Set<ProductKitTbl>()
        //.Select(p => new ProductKitTbl
        //{
        //    KitId = p.KitId,
        //    Name = p.Name,
        //    Brand = p.Brand,
        //    Description = p.Description,
        //    Picture = p.Picture,
        //    Price = p.Price,
        //    Quantity = p.Quantity,
        //    DateOfCreation = p.DateOfCreation,
        //    DateOfDeletion = p.DateOfDeletion,
        //    Status = p.Status,
        //    DateOfChange = p.DateOfChange,
        //    TypeNames = p.Ktypes.Select(k => k.TypeName).ToList()
        //})
        //.ToListAsync();
        }*/



        //Output tất cả sản phẩm kit cùng với type va lab của sản phẩm đó
        public async Task<List<ProductDTO>> GetProductDTO()
        {
            var product = await _context.Set<ProductKitTbl>()
        .Select(p => new ProductDTO
        {
            KitId = p.KitId,
            Name = p.Name,
            Brand = p.Brand,
            Description = p.Description,
            Picture = p.Picture,
            Price = p.Price,
            Quantity = p.Quantity,
            DateOfCreation = p.DateOfCreation,
            DateOfDeletion = p.DateOfDeletion,
            Status = p.Status,
            DateOfChange = p.DateOfChange,
            TypeNames = p.Ktypes.Select(k => k.TypeName).ToList(),
            Labs = p.Labs.ToList()
        })
        .ToListAsync();

            return product;
        }



        //Khi bam vao kit se dua den trang kit, tim kitId
        public async Task<ProductDTO> GetKitById(string userChoice)
        {

            var searchedProducts = await _context.Set<ProductKitTbl>()
                .Select(p => new ProductDTO
                {
                    KitId = p.KitId,
                    Name = p.Name,
                    Brand = p.Brand,
                    Description = p.Description,
                    //Picture = $"{imageUrl}/images/{p.Picture}", // mới thêm: cũ: Picture = p.Picture
                    Picture = p.Picture,
                    Price = p.Price,
                    Quantity = p.Quantity,
                    DateOfCreation = p.DateOfCreation,
                    DateOfDeletion = p.DateOfDeletion,
                    Status = p.Status,
                    DateOfChange = p.DateOfChange,
                    TypeNames = p.Ktypes.Select(k => k.TypeName).ToList(),
                    Labs = p.Labs.ToList()
                })
                .FirstOrDefaultAsync(search => search.KitId == $"{userChoice}");
            
            return searchedProducts;
        }



        //Create Product (TO CREATE PRODUCT DO NOT MODIFY FOR NOW)
        public async Task<string> CreateProduct(string kitName, string brand, string description, string pictureUrl, int price, int quantity, List<string> types, DateTime dateOfCreation)
        {
            string? nameCheck = _context.Set<ProductKitTbl>().Where(e => e.Name == $"{kitName}").Select(e => e.Name).FirstOrDefault()?.ToString();
            string kitId;
            string? idCheck;

            string? error="";



            //cheking existed ID
            do
            {
                kitId = "KIT" + (new Random().Next(000, 999));
                idCheck = _context.Set<ProductKitTbl>().Where(e => e.KitId == $"{kitId}").Select(e => e.KitId).FirstOrDefault()?.ToString();
            }
            while (!string.IsNullOrWhiteSpace(idCheck));
            

            //check existed kit name
            if (!string.IsNullOrWhiteSpace(nameCheck))
            {
                Console.WriteLine("Existed name");
                error = "Existed name";
                return error;
            }


            //mapping du lieu
            var product = new ProductKitTbl
            {
                KitId = kitId,
                Name = kitName,
                Brand = brand,
                Description = description,
                Picture = pictureUrl,
                Price = price,
                Quantity = quantity,
                DateOfCreation = dateOfCreation,
                Status = "New"
            };

            //Filter cac type trong Ktype dua tren List<string> types
            var kitTypes = await _context.KtypeTbls
                .Where(t => types.Contains(t.TypeName))
                .ToListAsync();


            //check truong hop kitType ko trung voi so luong type gui den
            if (kitTypes.Count != types.Count)
            {
                Console.WriteLine("Messed up here 161");
                error = "Messed up here 161";
                return error;
            }

            //associate kit voi product
            product.Ktypes = kitTypes;

            //Tim cac LType trung voi list types
            var labTypes = await _context.LtypeTbls
                .Where(l => types.Contains(l.TypeName))
                .ToListAsync();

            //Filter cac lab voi type co trong type cua product
            var labLists = await _context.Set<LabTbl>()
                .Where(l => l.Ltypes.Any(ltype => labTypes.Contains(ltype)))
                .Where(k => k.Status != "Deleted") //lab da bi deleted thi khong them vao
                .ToListAsync();

            //associate product voi kit
            product.Labs = labLists;


            _context.ProductKitTbls.Add(product);


            await _context.SaveChangesAsync();

            return error;
        }



        //Delete Product
        public async Task<bool> DeleteProduct(string kitId)
        {
            var product = await _context.Set<ProductKitTbl>().FindAsync(kitId);

            if (product == null) 
            {
                return false;
            }

            product.Status = "Deleted";
            product.DateOfDeletion = DateTime.Now;
            await _context.SaveChangesAsync();

            return true;
        }



        //Update Product (NOT CREATE PRODUCT PAY ATTENTION)
        public async Task<ValueTuple<string, string>> UpdateProduct(string idToChange, string kitName, string brand, string description, string pictureUrl, int price, int quantity, List<string> types, DateTime dateOfChange, bool isNewImageUploaded)
        {
            string? nameCheck = _context.Set<ProductKitTbl>().Where(e => e.Name == kitName && e.KitId != idToChange).Select(e => e.Name).FirstOrDefault();

            string oldImageUrl = "";
            string errors = "";

            var searchedProducts = await _context.Set<ProductKitTbl>()
                .Include(p => p.Ktypes)
                .Include(p => p.Labs)
                .FirstOrDefaultAsync(p => p.KitId == idToChange);

            if (searchedProducts == null)
            {
                errors = $"No existing kit with input {idToChange} found to change";
                return (errors, oldImageUrl);
            }
            else if (string.Equals(searchedProducts.Status, "Deleted", StringComparison.OrdinalIgnoreCase))
            {
                errors = "Product is deleted";
                return (errors, oldImageUrl);
            }


            //check existed kit name
            if (!string.IsNullOrWhiteSpace(nameCheck))
            {
                errors = "Existed name";
                return (errors, oldImageUrl);
            }

            //check if new image or old
            if (isNewImageUploaded)
            {
                oldImageUrl = searchedProducts.Picture;
                searchedProducts.Picture = pictureUrl;
            }

            //update other fields
            searchedProducts.Name = kitName;
            searchedProducts.Brand = brand;
            searchedProducts.Description = description;
            searchedProducts.Price = price;
            searchedProducts.Quantity = quantity;
            searchedProducts.DateOfChange = dateOfChange;
            searchedProducts.Status = "Changed";

            // Update types
            var kitTypes = await _context.KtypeTbls
                .Where(t => types.Contains(t.TypeName))
                .ToListAsync();

            if (kitTypes.Count != types.Count)
            {
                errors = "Invalid types provided";
                return (errors, oldImageUrl);
            }

            searchedProducts.Ktypes.Clear();
            searchedProducts.Ktypes = kitTypes;

            // Update labs
            var labTypes = await _context.LtypeTbls
                .Where(l => types.Contains(l.TypeName))
                .ToListAsync();

            var labLists = await _context.Set<LabTbl>()
                .Where(l => l.Ltypes.Any(ltype => labTypes.Contains(ltype)))
                .Where(k => k.Status != "Deleted")
                .ToListAsync();

            searchedProducts.Labs.Clear();
            searchedProducts.Labs = labLists;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                errors = $"Error saving changes: {ex.Message}";
            }

            return (errors, oldImageUrl);
        }


        //Get kit for adding and updating lab
        public async Task<List<KitForLab>> GetKitForAddUpdate()
        {
            var product = await _context.Set<ProductKitTbl>()
                .Select(p => new KitForLab
                {
                    KitId = p.KitId,
                    Name = p.Name,
                    Status = p.Status,
                    TypeNames = p.Ktypes.Select(l => l.TypeName).ToList()
                }).ToListAsync();
            return product;
        }
    }
}
