using KLM.Repository.Base;
using KLM.Repository.Models;
using KLM.Repository.ModelView;
using Microsoft.EntityFrameworkCore;

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

        //tim lab bang id
        public async Task<LabDTO> GetLabById(string id)
        {
            var searchedLab = await _context.Set<LabTbl>()
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
                .FirstOrDefaultAsync(search => search.LabId == $"{id}");
            return searchedLab;
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
        public async Task<string> CreateLab(string labName, string description, string documentUrl, List<string> types, DateTime DateOfCreation)
        {
            string? nameCheck = _context.Set<LabTbl>().Where(e => e.Name == $"{labName}").Select(e => e.Name).FirstOrDefault()?.ToString();
            string labId;
            string? idCheck;
            string error = "";

            do
            {
                labId = "LAB" + (new Random()).Next(000, 999);
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


        //delete lab
        public async Task<bool> DeleteLabs(string labId)
        {
            var lab = await _context.Set<LabTbl>()
                .Include(l => l.Kits)
                .FirstOrDefaultAsync(p => p.LabId == $"{labId}");

            if (lab == null)
            {
                return false;
            }

            lab.Status = "Deleted";
            //cho nay Khanh sua
            lab.DateOfDeletion = DateTime.Now;

            //lab.Kits.Clear();

            await _context.SaveChangesAsync();

            return true;
        }


        //update lab
        public async Task<ValueTuple<string, string>> UpdateLab(string idToChange, string labName, string description, string documentUrl, List<string> types, DateOnly dateOfChange, bool isNewFileUpload)
        {
            //get name in database base on request's sent name
            string? nameCheck = _context.Set<LabTbl>().Where(e => e.Name == $"{labName}" && e.LabId != idToChange).Select(e => e.Name).FirstOrDefault()?.ToString();

            //string labId; (keep old id so not needed)
            //string? idCheck; (not needed)

            string oldDocumentUrl = "";

            string errors = "";


            var searchedLab = await _context.Set<LabTbl>()
            .Include(p => p.Ltypes)
            .Include(p => p.Kits)
            .FirstOrDefaultAsync(p => p.LabId == $"{idToChange}");


            //check if no lab found or deleted
            if (searchedLab == null)
            {
                Console.WriteLine("No existing lab found to change");
                errors = $"No existing lab with input {idToChange} found to change";
                return (errors, oldDocumentUrl);
            }
            else if (string.Equals(searchedLab.Status, "Deleted", StringComparison.OrdinalIgnoreCase))
            {
                Console.WriteLine("Lab is deleted");
                errors = "Lab is deleted";
                return (errors, oldDocumentUrl);
            }


            //string oldName = searchedLab.Name;
            //&& !string.Equals(nameCheck, oldName, StringComparison.OrdinalIgnoreCase)

            //check existed lab name
            if (!string.IsNullOrWhiteSpace(nameCheck))
            {
                Console.WriteLine("Existed name");
                errors = "Existed name";
                return (errors, oldDocumentUrl);
            }

            if (isNewFileUpload)
            {
                oldDocumentUrl = searchedLab.Document;
                searchedLab.Document = documentUrl;
            }


            //mapping du lieu
            //oldDocumentUrl = searchedLab.Document;

            searchedLab.Name = labName;
            searchedLab.Description = description;
            //searchedLab.Document = documentUrl;
            searchedLab.DateOfChangeLab = dateOfChange;
            searchedLab.Status = "Changed";


            //Filter cac type trong Ltype dua tren List<string> types
            var labTypes = await _context.LtypeTbls
                .Where(t => types.Contains(t.TypeName))
                .ToListAsync();


            //check truong hop kitType ko trung voi so luong type gui den (not important here)
            if (labTypes.Count != types.Count)
            {
                Console.WriteLine("Messed up here 161");
                return (errors, oldDocumentUrl);
            }

            //associate types voi lab
            searchedLab.Ltypes.Clear();
            searchedLab.Ltypes = labTypes;

            //Tim cac Ktype trung voi list types
            var kitTypes = await _context.KtypeTbls
                .Where(l => types.Contains(l.TypeName))
                .ToListAsync();

            //Filter cac kit voi type co trong type cua lab
            var kitLists = await _context.Set<ProductKitTbl>()
                .Where(l => l.Ktypes.Any(ktype => kitTypes.Contains(ktype)))
                .Where(k => k.Status != "Deleted") //cac kit da bi deleted thi khong them vao
                .ToListAsync();

            //associate product voi kit
            searchedLab.Kits.Clear();
            searchedLab.Kits = kitLists;

            //await _context.SaveChangesAsync();

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                errors = $"Error saving changes: {ex.Message}";
            }

            return (errors, oldDocumentUrl);
        }



        //get lab for add and update kit
        public async Task<List<LabForKit>> GetLabForAddUpdate()
        {
            var lab = await _context.Set<LabTbl>()
                .Select(l => new LabForKit
                {
                    LabId = l.LabId,
                    LabName = l.Name,
                    Status = l.Status,
                    LabTypes = l.Ltypes.Select(l => l.TypeName).ToList(),
                }).ToListAsync();
            return lab;
        }
    }
}
