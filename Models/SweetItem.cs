using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sweet_Shop_Management.Models
{
    public class SweetItem
    {
        [Display(Name = "Item Id")]
        public int Id { get; set; }
        [Required]
        [Display(Name = "Item Name")]
        public string ItemName { get; set; }
        [Required]
        public double Price { get; set; }

        [Required(ErrorMessage = "Please select a currency.")]
        [Display(Name = "Currency (Dollar or Rupee)")]
        public string Currency { get; set; } 

        [Required(ErrorMessage = "Please select a unit.")]
        [Display(Name = "Unit (Kg, Gram, Liter, Piece)")]
        public string Unit { get; set; }

        [Required]
        [Display(Name = "Total Quantity")]
        public double TotalQuantity { get; set; }
        [Display(Name = "Quantity Sell")]
        public double TotalSellQuantity { get; set; }
        [Display(Name = "Final Cost")]
        public double FinalCost { get; set; }

        [Display(Name = "Snacks, Drink, Sweets")]
        public string ProductCategory { get; set; }
        //public int? ProductCategoryId { get; set; }

        // [ForeignKey("ProductCategoryId")]
        // public ProductCategory ProductCategory { get; set; }
    }
}
