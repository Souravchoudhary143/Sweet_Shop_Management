using Microsoft.AspNetCore.Mvc.Rendering;

namespace Sweet_Shop_Management.Models.ViewModel
{
    public class SweetItemViewModel
    {
        public SweetItem SweetItem { get; set; }

        public List<SelectListItem> ProductCategoryList { get; set; }
    }
}
