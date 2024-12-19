using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Sweet_Shop_Management.Models
{
    public class Sale
    {
        public int Id { get; set; }

        [Required]
        public int SweetItemId { get; set; }

        [ForeignKey("SweetItemId")]
        public SweetItem SweetItem { get; set; }

        [Display(Name = "Quantity Sold")]
        public double QuantitySold { get; set; }

        [Display(Name = "Unit (Kg, Gram, Liter, Piece)")]
        public string Unit { get; set; }

        [Display(Name = "Remaining Quantity")]
        public double RemainingQuantity { get; set; }

        [Display(Name = "Sale Date")]
        public DateTime SaleDate { get; set; }
        [Display(Name = "Sale Price")]
        public double SalePrice { get; set; }
        [Display(Name = "Currency (Dollar or Rupee)")]
        public string Currency { get; set; }
        public double CostPrice { get; set; }
        public double Profit { get; set; }
        public decimal Discount { get; set; }
    }
}
