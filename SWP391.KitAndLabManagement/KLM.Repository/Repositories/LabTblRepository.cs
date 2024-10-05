using KLM.Repository.Base;
using KLM.Repository.Models;
using KLM.Repository.ModelView;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
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
    }
}
