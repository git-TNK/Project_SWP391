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
                LabNames = p.Labs.Select(l => l.Name).ToList()
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
            LabNames = p.Labs.Select(l => l.Name).ToList()
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
                    LabNames = p.Labs.Select(l => l.Name).ToList()
                })
                .FirstOrDefaultAsync(search => search.KitId == $"{userChoice}");

            //string selectCheck = _context.Set<ProductKitTbl>().Where(e => e.Name == $"{userInput}").Select(e => e.Name).FirstOrDefault()?.ToString();
            //string selectCheck = _context.Set<ProductKitTbl>().Select(p => new ProductKitTbl{
            //    Name = p.Name
            //})
            //   .FirstOrDefault(e => e.Name == $"{userInput}")?.ToString();

            //Where(e => e.Name == $"{userInput}").Select(e => e.Name).ToListAsync()?.ToString()
            
            return searchedProducts;
        }



        //Create Product (TO CREATE PRODUCT DO NOT MODIFY FOR NOW)
        public async Task<bool> CreateProduct(string kitName, string brand, string description, string pictureUrl, int price, int quantity, List<string> types, DateOnly dateOfCreation)
        {
            string? nameCheck = _context.Set<ProductKitTbl>().Where(e => e.Name == $"{kitName}").Select(e => e.Name).FirstOrDefault()?.ToString();
            string kitId;
            string? idCheck;

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
                return false;
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
                return false;
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

            return true;
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
            product.DateOfDeletion = DateOnly.FromDateTime(DateTime.Today.Date);
            await _context.SaveChangesAsync();

            return true;
        }



        //Update Product (NOT CREATE PRODUCT PAY ATTENTION)
        public async Task<ValueTuple<string, string>> UpdateProduct(string idToChange,string kitName, string brand, string description, string pictureUrl, int price, int quantity, List<string> types, DateOnly dateOfChange)
        {
            //get name in database base on request's sent name
            string? nameCheck = _context.Set<ProductKitTbl>().Where(e => e.Name == $"{kitName}").Select(e => e.Name).FirstOrDefault()?.ToString();

            //string kitId; (keep old id so not needed)
            //string? idCheck; (not needed)

            string oldImageUrl = "";

            string errors = "";

            //getting old kit
            /*var searchedProducts = await _context.Set<ProductKitTbl>()
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
                    //TypeNames = p.Ktypes.Select(k => k.TypeName).ToList()
                    //LabNames = p.Labs.Select(l => l.Name).ToList()
                })
                .FirstOrDefaultAsync(search => search.KitId == $"{idToChange}");
            */


            var searchedProducts = await _context.Set<ProductKitTbl>()
            .Include(p => p.Ktypes)
            .Include(p => p.Labs)
            .FirstOrDefaultAsync(p => p.KitId == $"{idToChange}");


            //check if no product found or deleted
            if (searchedProducts == null)
            {
                Console.WriteLine("No existing kit found to change");
                errors = $"No existing kit with input {idToChange} found to change";
                return (errors, oldImageUrl);
            } 
            else if (string.Equals(searchedProducts.Status, "Deleted", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine("Product is deleted");
                errors = "Product is deleted";
                return (errors, oldImageUrl);
            }

            //cheking existed ID (keep old ID)
            /*do
            //{
            //    kitId = "KIT" + (new Random().Next(000, 999));
            //    idCheck = _context.Set<ProductKitTbl>().Where(e => e.KitId == $"{kitId}").Select(e => e.KitId).FirstOrDefault()?.ToString();
            //}
            //while (!string.IsNullOrWhiteSpace(idCheck));*/

            string oldName = searchedProducts.Name;

            //check existed kit name
            if (!string.IsNullOrWhiteSpace(nameCheck) && !string.Equals(nameCheck, oldName, StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine("Existed name");
                errors = "Existed name";
                return (errors, oldImageUrl);
            }


            //mapping du lieu
            /*var product = new ProductKitTbl
            {
                KitId = searchedProducts.KitId,
                Name = kitName,
                Brand = brand,
                Description = description,
                Picture = pictureUrl,
                Price = price,
                Quantity = quantity,
                DateOfChange = dateOfChange,
                Status = "Changed"
            };*/


            oldImageUrl = searchedProducts.Picture;

            searchedProducts.Name = kitName;
            searchedProducts.Brand = brand;
            searchedProducts.Description = description;
            searchedProducts.Picture = pictureUrl;
            searchedProducts.Price = price;
            searchedProducts.Quantity = quantity;
            searchedProducts.DateOfChange = dateOfChange;
            searchedProducts.Status = "Changed";


            //Filter cac type trong Ktype dua tren List<string> types
            var kitTypes = await _context.KtypeTbls
                .Where(t => types.Contains(t.TypeName))
                .ToListAsync();


            //check truong hop kitType ko trung voi so luong type gui den (not important here)
            if (kitTypes.Count != types.Count)
            {
                Console.WriteLine("Messed up here 161");
                return (errors, oldImageUrl);
            }

            //associate kit voi product
            searchedProducts.Ktypes.Clear();
            searchedProducts.Ktypes = kitTypes;

            //Tim cac LType trung voi list types
            var labTypes = await _context.LtypeTbls
                .Where(l => types.Contains(l.TypeName))
                .ToListAsync();

            //Filter cac lab voi type co trong type cua product
            var labLists = await _context.Set<LabTbl>()
                .Where(l => l.Ltypes.Any(ltype => labTypes.Contains(ltype)))
                .Where(k => k.Status != "Deleted") //add them vao ngay 10/05
                .ToListAsync();

            //associate product voi kit
            searchedProducts.Labs.Clear();
            searchedProducts.Labs = labLists;

            await _context.SaveChangesAsync();

            return (errors, oldImageUrl);
        }

    }
}
