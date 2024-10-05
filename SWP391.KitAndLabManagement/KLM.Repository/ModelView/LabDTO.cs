using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KLM.Repository.ModelView
{
    public class LabDTO
    {
        public string LabId { get; set; }

        public string LabName { get; set; }

        public string LabDescription { get; set; }

        public string Document { get; set; }

        public DateOnly DateOfCreationLab { get; set; }

        public DateOnly? DateOfDeletionLab { get; set; }

        public DateOnly? DateOfChangeLab { get; set; }

        public string Status { get; set; }

        public List<string> LabTypes { get; set; }

        public List<string> Kits { get; set; }
    }
}
