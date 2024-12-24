namespace Sweet_Shop_Management.Repository.IRepository
{
    public interface IUnitOfWork
    {
        ISweetItemRepository SweetItem { get; }
        ISaleRepository Sale { get; }

        Task<int> CompleteAsync();
        Task SaveAsync();
    }
}
