using System.ComponentModel.DataAnnotations;

namespace Sweet_Shop_Management.Models
{
    public class SaleViewModel
    {
        public int SweetItemId { get; set; }

        public string SweetItemName { get; set; }

        public double TotalAvailableQuantity { get; set; }
        public string Unit { get; set; }

        [Display(Name = "Quantity Sold")]
        [Range(1, double.MaxValue, ErrorMessage = "Quantity must be greater than 0.")]
        public double QuantitySold { get; set; }

        [Display(Name = "Sale Price")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than 0.")]
        public double SalePrice { get; set; }
        public double RemainingQuantity { get; set; }
        public double CostPrice { get; set; }
        public decimal? Discount { get; set; }
        public string Currency { get; internal set; }
    }
}
