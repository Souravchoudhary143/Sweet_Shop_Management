using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sweet_Shop_Management.Models
{
    public class OrderItems
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int OrderId { get; set; }

        [ForeignKey("OrderId")]
        public OrderDetails OrderDetails { get; set; }

        [Required]
        public int SweetItemId { get; set; }

        [ForeignKey("SweetItemId")]
        public SweetItem SweetItem { get; set; }

        [Display(Name = "Quantity Sold")]
        public double QuantitySold { get; set; }

        [Display(Name = "Sale Price")]
        public double SalePrice { get; set; }

        [Display(Name = "Final Price")]
        public double FinalPrice { get; set; }

        [Display(Name = "Unit")]
        public string Unit { get; set; }

        [Display(Name = "Currency")]
        public string Currency { get; set; }
    }
}
