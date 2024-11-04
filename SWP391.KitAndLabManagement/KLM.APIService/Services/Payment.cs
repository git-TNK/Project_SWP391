namespace KLM.APIService.Services
{
    public class Payment
    {
        public string AccountNumber { get; set; }
        public int Accumulated { get; set; }
        public string Content { get; set; }
        public string Description { get; set; }
        public string Gateway { get; set; }
        public int Id { get; set; }
        public string ReferenceCode { get; set; }
        public string TransactionDate { get; set; }
        public int TransferAmount { get; set; }
        public string TransferType { get; set; }
    }
}
