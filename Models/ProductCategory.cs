using System.ComponentModel.DataAnnotations;

namespace Sweet_Shop_Management.Models
{
    public class ProductCategory
    {
        public int Id { get; set; }

        [Required]
        [Display(Name = "Category")]
        public string Category { get; set; } 
    }
}
