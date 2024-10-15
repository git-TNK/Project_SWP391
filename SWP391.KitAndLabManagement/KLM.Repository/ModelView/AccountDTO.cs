using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KLM.Repository.ModelView
{
    public class AccountDTO
    {
        public string accountId { get; set; }

        public string username { get; set; }

        public string password { get; set; }

        public string fullName { get; set; }

        public string email { get; set; }

        public string phoneNumber { get; set; }

        public string role { get; set; }

        public string address { get; set; }

        public string status { get; set; }
    }
}
