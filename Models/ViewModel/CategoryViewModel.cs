using Microsoft.AspNetCore.Mvc.Rendering;

namespace Sweet_Shop_Management.Models.ViewModels
{
    public class CategoryViewModel
    {
        public SweetItem SweetItem { get; set; }
        public IEnumerable<SelectListItem> ProductCategoryList { get; set; }
    }
}
