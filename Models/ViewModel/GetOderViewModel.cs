using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace Sweet_Shop_Management.Models.ViewModel
{
    public class GetOderViewModel
    {
            [Required]
            [Display(Name = "Total Items")]
            [JsonProperty("TotalItems")]
            public int TotalItems { get; set; }

            [Required]
            [Display(Name = "Total Price")]
            [JsonProperty("TotalPrice")]
            public double TotalPrice { get; set; }

            [Display(Name = "Discount (%)")]
            [JsonProperty("Discount")]
            public double? Discount { get; set; }

            [Required]
            [Display(Name = "Final Price")]
            [JsonProperty("FinalPrice")]
            public double FinalPrice { get; set; }
            [Required]
            [Display(Name = "Order Date")]
            [JsonProperty("OrderDate")]
            public double OrderDate { get; set; }

            [JsonProperty("OrderItems")]
            public List<OrderItemViewModel> OrderItems { get; set; }
        }

        public class ItemViewModel
        {
            public int SweetItemId { get; set; }
            public string? SweetItemName { get; set; }

            [Display(Name = "Quantity Sold")]
            public double QuantitySold { get; set; }

            [Display(Name = "Sale Price")]
            public double SalePrice { get; set; }

            [Display(Name = "Final Price")]
            public double FinalPrice { get; set; }
    }
}
