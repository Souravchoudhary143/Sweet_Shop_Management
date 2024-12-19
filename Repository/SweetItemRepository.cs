using Microsoft.EntityFrameworkCore;
using Sweet_Shop_Management.Data;
using Sweet_Shop_Management.Models;
using Sweet_Shop_Management.Repository.IRepository;

namespace Sweet_Shop_Management.Repository
{
    public class SweetItemRepository : ISweetItemRepository
    {
        private readonly ApplicationDbContext _context;
        public SweetItemRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public double ConvertToKg(double grams)
        {
            return grams / 1000.0;
        }
        private double ConvertToLiter(double milliliters)
        {
            return milliliters / 1000; 
        }


        public async Task CreateAsync(SweetItem sweetItem)
        {
            await _context.SweetItems.AddAsync(sweetItem);
            await SaveAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var sweetItem = await GetByIdAsync(id);
            try
            {
                if (sweetItem != null)
                {
                    _context.Remove(sweetItem);
                    await SaveAsync(); // Save changes
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<SweetItem>> GetAllAsync()
        {
            return await _context.SweetItems.ToListAsync();
        }

        public async Task<IEnumerable<SweetItem>> GetAllWithConvertedUnitsAsync()
        {
            var items = await _context.SweetItems.ToListAsync();
            foreach (var item in items)
            {
                if (item.Unit == "Gram")
                {
                    item.TotalQuantity = ConvertToKg(item.TotalQuantity); //Convert gram to kg 
                }
                else if (item.Unit == "ml")
                {
                    item.TotalQuantity = ConvertToLiter(item.TotalQuantity); // Convert milliliters to liters
                    item.Unit = "Liter"; 
                }
                else if (item.Unit == "Liter" || item.Unit == "Piece")
                {
                    continue;
                }
            }
            return items;
        }

        public async Task<SweetItem> GetByIdAsync(int id)
        {
            var sweetItem = await _context.SweetItems.FirstOrDefaultAsync(s => s.Id == id);
            return sweetItem;
        }

        public async Task<SweetItem> GetByNameAsync(string name)
        {
#pragma warning disable CS8603 // Possible null reference return.
            return await _context.SweetItems.FirstOrDefaultAsync(s => s.ItemName == name);
#pragma warning restore CS8603 // Possible null reference return.
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(SweetItem sweetItem)
        {
            _context.SweetItems.Update(sweetItem);
            await SaveAsync();
        }
    }
}
