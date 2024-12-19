using Microsoft.EntityFrameworkCore;
using Sweet_Shop_Management.Data;
using Sweet_Shop_Management.Repository.IRepository;

namespace Sweet_Shop_Management.Repository
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly ApplicationDbContext _context;
        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            SweetItem = new SweetItemRepository(_context);
            Sale = new SaleRepository(_context);
        }
        public ISweetItemRepository SweetItem { get; set; }

        public ISaleRepository Sale {  get; set; }

        public async Task SaveAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
