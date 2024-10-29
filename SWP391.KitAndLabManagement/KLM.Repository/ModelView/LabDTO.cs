namespace KLM.Repository.ModelView
{
    public class LabDTO
    {
        public string LabId { get; set; }

        public string LabName { get; set; }

        public string LabDescription { get; set; }

        public string Document { get; set; }
        //Cho nay Khanh sua
        public DateTime DateOfCreationLab { get; set; }
        //Cho nay Khanh sua
        public DateTime? DateOfDeletionLab { get; set; }

        public DateOnly? DateOfChangeLab { get; set; }

        public string Status { get; set; }

        public List<string> LabTypes { get; set; }

        public List<string> Kits { get; set; }
    }
}
