using KLM.Repository.Models;
using KLM.Repository.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KLM.Repository
{


    public class UnitOfWork
    {

        private readonly Swp391Context _context; //thg này đầu tiên là = null
        private ProductKitTblRepository _productKitTblRepository; //tương tự thg trên
        private LabTblRepository _labTblRepository;

        public UnitOfWork() => _context ??= new Swp391Context(); //2. Khởi tạo _context


        public ProductKitTblRepository ProductKitTblRepository {
            get { return _productKitTblRepository ??= new ProductKitTblRepository
                    (_context);  }
        }

        public LabTblRepository LabTblRepository
        {
            get
            {
                return _labTblRepository ??= new LabTblRepository
                    (_context);
            }
        }
    }
}
