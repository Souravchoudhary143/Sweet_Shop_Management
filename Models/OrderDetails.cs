using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Sweet_Shop_Management.Models
{
    public class OrderDetails
    {
        [Key]
        public int Id { get; set; } 

        [Required]
        [Display(Name = "Total Items")]
        public int TotalItems { get; set; }

        [Required]
        [Display(Name = "Total Price")]
        public decimal TotalPrice { get; set; }

        [Display(Name = "Discount (%)")]
        public decimal? Discount { get; set; }

        [Required]
        [Display(Name = "Final Price")]
        public decimal FinalPrice { get; set; }

        [Display(Name = "Order Date")]
        public DateTime OrderDate { get; set; } = DateTime.Now;
    }
}
