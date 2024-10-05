using KLM.Repository.Base;
using KLM.Repository.Models;
using KLM.Repository.ModelView;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KLM.Repository.Repositories
{
    public class LabTblRepository : GenericRepository<LabTbl>   
    {
        public LabTblRepository(Swp391Context context) => _context ??= context;


        //show all labs with associated types and kits
        public async Task<List<LabDTO>> GetLabDto()
        {
            var lab = await _context.Set<LabTbl>()
        .Select(p => new LabDTO
        {
            LabId = p.LabId,
            LabName = p.Name,
            LabDescription = p.Description,
            Document = p.Document,
            DateOfCreationLab = p.DateOfCreation,
            DateOfDeletionLab = p.DateOfDeletion,
            DateOfChangeLab = p.DateOfChangeLab,
            Status = p.Status,
            LabTypes = p.Ltypes.Select(k => k.TypeName).ToList(),
            Kits = p.Kits.Select(l => l.Name).ToList()
        })
        .ToListAsync();

            return lab;
        }



        //tim lab bang name
        public async Task<List<LabDTO>> GetLabByName(string inputName)
        {
            var lab = await _context.Set<LabTbl>()
        .Select(p => new LabDTO
        {
            LabId = p.LabId,
            LabName = p.Name,
            LabDescription = p.Description,
            Document = p.Document,
            DateOfCreationLab = p.DateOfCreation,
            DateOfDeletionLab = p.DateOfDeletion,
            DateOfChangeLab = p.DateOfChangeLab,
            Status = p.Status,
            LabTypes = p.Ltypes.Select(k => k.TypeName).ToList(),
            Kits = p.Kits.Select(l => l.Name).ToList()
        })
        .Where(search => EF.Functions.Like(search.LabName, $"%{inputName}%"))
        .ToListAsync();
            return lab;
        }



        //create lab
        public async Task<string> CreateLab(string labName, string description, string documentUrl, List<string> types, DateOnly DateOfCreation)
        {
            string? nameCheck = _context.Set<LabTbl>().Where(e => e.Name == $"{labName}").Select(e => e.Name).FirstOrDefault()?.ToString();
            string labId;
            string? idCheck;
            string error = "";

            do
            {
                labId = "LAB" + (new Random()).Next(000,999);
                idCheck = _context.Set<LabTbl>().Where(e => e.LabId == $"{labId}").Select(e => e.LabId).FirstOrDefault()?.ToString();
            } while (!string.IsNullOrWhiteSpace(idCheck));

            if (!string.IsNullOrWhiteSpace(nameCheck)) 
            {
                error = "Name existed";
                return error;
            }

            //mapping du lieu
            var lab = new LabTbl
            {
                LabId = labId,
                Name = labName,
                Description = description,
                Document = documentUrl,
                DateOfCreation = DateOfCreation,
                Status = "New"
            };

            //Filter cac type trong Ktype dua tren List<string> types
            var labTypes = await _context.LtypeTbls
                .Where(t => types.Contains(t.TypeName))
                .ToListAsync();


            //check truong hop labType ko trung voi so luong type gui den
            if (labTypes.Count != types.Count)
            {
                error = "Messed up 107 lab repo";
                return error;
            }

            //associate lab's type voi lab
            lab.Ltypes = labTypes;


            //associate lab voi product
            //Tim cac Ktype trung voi list types
            var kitTypes = await _context.KtypeTbls
                .Where(l => types.Contains(l.TypeName))
                .ToListAsync();

            //Filter cac kit voi type co trong type cua lab, kit co status bi deleted thi khong them lab duoc
            var kitLists = await _context.Set<ProductKitTbl>()
                .Where(l => l.Ktypes.Any(ktype => kitTypes.Contains(ktype)))
                .Where(k => k.Status != "Deleted")
                .ToListAsync();

            //associate lab voi product
            lab.Kits = kitLists;

            _context.LabTbls.Add(lab);


            await _context.SaveChangesAsync();

            return error;
        }
    }
}
