using Sweet_Shop_Management.Models;

namespace Sweet_Shop_Management.Repository.IRepository
{
    public interface ISweetItemRepository
    {
        Task<IEnumerable<SweetItem>> GetAllAsync();
        Task<SweetItem> GetByIdAsync(int id);
        Task CreateAsync(SweetItem sweetItem);
        Task UpdateAsync(SweetItem sweetItem);
        Task DeleteAsync(int id);
        Task<SweetItem> GetByNameAsync(string name);
        double ConvertToKg(double grams);
        Task<IEnumerable<SweetItem>> GetAllWithConvertedUnitsAsync();
        Task SaveAsync();
    }
}
