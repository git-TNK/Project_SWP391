using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KLM.Repository.ModelView
{
    public class LabForKit
    {
        public string LabId { get; set; }

        public string LabName { get; set; }


        public string Status { get; set; }

        public List<string> LabTypes { get; set; }

    }
}
