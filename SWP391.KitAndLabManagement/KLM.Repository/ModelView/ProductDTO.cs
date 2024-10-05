using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
//using KLM.Repository.Models;

namespace KLM.Repository.ModelView
{
    public class ProductDTO
    {
        public string KitId { get; set; }

        public string Name { get; set; }

        public string Brand { get; set; }

        public string Description { get; set; }

        public string Picture { get; set; }

        public decimal Price { get; set; }

        public int Quantity { get; set; }

        public DateOnly DateOfCreation { get; set; }

        public DateOnly? DateOfDeletion { get; set; }

        public string Status { get; set; }

        public DateOnly? DateOfChange { get; set; }

        public List<string> TypeNames { get; set; }


        public List<string> LabNames { get; set; }
        //public ProductDTO mapProductDTO (ProductKitTbl product)
        //{
        //    return new ProductDTO
        //    {
        //        KitId = product.KitId,
        //        Name = product.Name,
        //        Brand = product.Brand,
        //        Price = product.Price,
        //        Description = product.Description,
        //        Picture = product.Picture,
        //        Quantity = product.Quantity,
        //        DateOfCreation = product.DateOfCreation,
        //        DateOfChange = product.DateOfChange,
        //        DateOfDeletion = product.DateOfDeletion,
        //        Status = product.Status,
        //        TypeNames = product.TypeNames
        //    };
        //}
    }
}
