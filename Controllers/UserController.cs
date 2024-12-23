using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Sweet_Shop_Management.Data;
using Sweet_Shop_Management.Repository.IRepository;

namespace Sweet_Shop_Management.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<IdentityUser> _userManager;
        public UserController(ApplicationDbContext context, IUnitOfWork unitOfWork, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }
        public IActionResult Index()
        {
            return View();
        }
        #region Api 
        [HttpGet]
        public IActionResult GetAll()
        {
            var userList = _context.Users.ToList();
            var roles = _context.Roles.ToList();
            var userRoles = _context.UserRoles.ToList(); 

            foreach (var user in userList)
            {
                var roleId = userRoles.FirstOrDefault(ur => ur.UserId == user.Id)?.RoleId;
                user.Role = roles.FirstOrDefault(r => r.Id == roleId)?.Name;
            }

            // var adminUser = userList.FirstOrDefault(u => u.Role == Utility.Role_Admin);
            //userList.Remove(adminUser);

            return Json(new { data = userList });
        }

        [HttpDelete]
        public IActionResult DeleteUser(string id)
        {
            if (string.IsNullOrEmpty(id))
                return Json(new { success = false, message = "Invalid user ID!" });

            var userInDb = _context.Users.Find(id);
            if (userInDb == null)
                return Json(new { success = false, message = "User not found!" });

            _context.Users.Remove(userInDb);
            _context.SaveChanges();

            return Json(new { success = true, message = "User deleted successfully!" });
        }

        #endregion
    }
}
