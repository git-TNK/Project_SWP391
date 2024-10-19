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
    public class KitForLab
    {
        public string KitId { get; set; }

        public string Name { get; set; }


        public string Status { get; set; }

        
        public List<string> TypeNames { get; set; }


        
    }
}
