using KLM.Repository.Models;
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

        public DateTime DateOfCreation { get; set; }

        public DateTime? DateOfDeletion { get; set; }

        public string Status { get; set; }

        public DateTime? DateOfChange { get; set; }

        public List<string> TypeNames { get; set; }


        public List<LabTbl> Labs { get; set; }
    }
}
