using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using Sweet_Shop_Management.Data;
using Sweet_Shop_Management.Models;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

public static class ApplicationDbInitializer
{
    public static async Task SeedUsersFromJsonAsync(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Load the JSON file
        var filePath = Path.Combine(Directory.GetCurrentDirectory(), "SeedUsers.json");
        if (!File.Exists(filePath)) return;

        var jsonData = await File.ReadAllTextAsync(filePath);
        var users = JsonConvert.DeserializeObject<List<SeedUser>>(jsonData);

        if (users == null || users.Count == 0) return;

        foreach (var user in users)
        {
            // Check if role exists, create if not
            if (!await roleManager.RoleExistsAsync(user.Role))
            {
                await roleManager.CreateAsync(new IdentityRole(user.Role));
            }

            // Check if user exists
            var existingUser = await userManager.FindByEmailAsync(user.Email);
            {
                if (existingUser == null)
                {
                    var newUser = new User
                    {
                        UserName = user.UserName,
                        Email = user.Email,
                        Name = user.Name,
                        City = user.City,
                        State = user.State,
                        PostalCode = user.PostalCode,
                        EmailConfirmed = true
                    };

                    var result = await userManager.CreateAsync(newUser, user.Password);
                    if (result.Succeeded)
                    {
                        await userManager.AddToRoleAsync(newUser, user.Role);
                    }
                }
            }
        }
    }
    public class SeedUser : IdentityUser
    {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } 
        public string Role { get; set; }
        public string Name { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string PostalCode { get; set; }
    }
}
