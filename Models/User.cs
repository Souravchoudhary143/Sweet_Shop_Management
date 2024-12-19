using Microsoft.AspNetCore.Identity;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Sweet_Shop_Management.Models
{
    public class User : IdentityUser
    {
        [Required]
        public string Name { get; set; }
        [Display(Name = "Street Address")]
        public string City { get; set; }
        public string State { get; set; }
        [Display(Name = "Postal Code")]
        public string PostalCode { get; set; }

        [NotMapped]
        public string Role { get; set; }
    }
}
