using Microsoft.EntityFrameworkCore;
using Sweet_Shop_Management.Data;
using Sweet_Shop_Management.Models;
using Sweet_Shop_Management.Repository.IRepository;

namespace Sweet_Shop_Management.Repository
{
    public class SaleRepository : ISaleRepository
    {
        private readonly ApplicationDbContext _context;
        public SaleRepository(ApplicationDbContext context)
        {
            _context = context;
        }
        public async Task AddSaleAsync(Sale sale)
        {
            await _context.Sales.AddAsync(sale);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var sale = await GetByIdAsync(id);
            try
            {
                if (sale != null)
                {
                    _context.Remove(sale);
                    await SaveAsync(); // Save changes
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private async Task<object> GetByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<Sale> GetAllSaleByIdAsync(int id)
        {
            return await _context.Sales.Where(s => s.Id == id).FirstOrDefaultAsync();
        }

        public async Task<List<Sale>> GetAllSalesAsync()
        {
            try
            {
                var sales = await _context.Sales.Include(s => s.SweetItem).ToListAsync(); //getting conversion error here
                return sales;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Sale> GetSaleByIdAsync(int id)
        {
#pragma warning disable CS8603 // Possible null reference return.
            return await _context.Sales.Include(s => s.SweetItem).FirstOrDefaultAsync(s => s.Id == id);
#pragma warning restore CS8603 // Possible null reference return.
        }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }

        public async Task UpdateSaleAsync(Sale sale)
        {
            _context.Sales.Update(sale);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteSalesByDateRangeAsync(DateTime startDate, DateTime endDate)
        {
            var salesToDelete = await _context.Sales
                .Where(s => s.SaleDate >= startDate && s.SaleDate <= endDate) //Delete record from specific range
                .ToListAsync();

            if (salesToDelete.Any())
            {
                _context.Sales.RemoveRange(salesToDelete);
                await _context.SaveChangesAsync();
            }
        }
    }
}
