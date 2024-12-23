using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sweet_Shop_Management.Data;
using Sweet_Shop_Management.Models;
using RouteAttribute = Microsoft.AspNetCore.Mvc.RouteAttribute;

namespace Sweet_Shop_Management.Controllers
{
    public class CategoryController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }
        [Route("Category")]
        public async Task<IActionResult> Index()
        {
            var categories = await _context.ProductCategories.ToListAsync();
            return View(categories);
        }
        public IActionResult Create()
        {
            return View();
        }
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var productCategory = await _context.ProductCategories.FindAsync(id);
            if (productCategory == null)
            {
                return NotFound();
            }
            return View(productCategory);
        }

        public async Task<IActionResult> Delete(int? id)
        {
            try
            {
                if (id == null)
                {
                    return NotFound();
                }
                var productCategory = await _context.ProductCategories
                    .FirstOrDefaultAsync(m => m.Id == id);
                if (productCategory == null)
                {
                    return NotFound();
                }

                return View(productCategory);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        private bool ProductCategoryExists(int id)
        {
            return _context.ProductCategories.Any(e => e.Id == id);
        }

        #region Api
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Category")] ProductCategory productCategory)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.Add(productCategory);
                    await _context.SaveChangesAsync();
                    return RedirectToAction(nameof(Index));
                }
                return View(productCategory);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Category")] ProductCategory productCategory)  // it restricts the model binding to only the specified properties, improving security and preventing over-posting attacks.
        {
            if (id != productCategory.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(productCategory);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProductCategoryExists(productCategory.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(productCategory);
        }

        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var productCategory = await _context.ProductCategories.FindAsync(id);
                if (productCategory != null)
                {
                    _context.ProductCategories.Remove(productCategory);
                    await _context.SaveChangesAsync();
                }
                return RedirectToAction(nameof(Index));
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}
