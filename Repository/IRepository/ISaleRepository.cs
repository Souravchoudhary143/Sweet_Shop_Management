using Sweet_Shop_Management.Models;

namespace Sweet_Shop_Management.Repository.IRepository
{
    public interface ISaleRepository
    {
        Task AddSaleAsync(Sale sale);
        Task<List<Sale>> GetAllSalesAsync();
        Task<Sale> GetSaleByIdAsync(int id);
        Task<Sale> GetAllSaleByIdAsync(int id);
        Task UpdateSaleAsync(Sale sale);
        Task DeleteAsync(int id);
        Task DeleteSalesByDateRangeAsync(DateTime startDate, DateTime endDate); // If we need to delete record from a specific range
        Task SaveAsync();
    }
}
