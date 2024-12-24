using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Sweet_Shop_Management.Data;
using Sweet_Shop_Management.Models;
using Sweet_Shop_Management.Models.ViewModel;
using Sweet_Shop_Management.Models.ViewModels;
using Sweet_Shop_Management.Repository;
using Sweet_Shop_Management.Repository.IRepository;

namespace Sweet_Shop_Management.Controllers
{
    //[Authorize]
    public class SweetShopController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly ApplicationDbContext _context;
        public SweetShopController(IUnitOfWork unitOfWork, ApplicationDbContext context)
        {
            _unitOfWork = unitOfWork;
            _context = context;
        }
        [Route("sweet")]
        public async Task<IActionResult> Index()
        {
            try
            {
                var sweetItems = await _unitOfWork.SweetItem.GetAllWithConvertedUnitsAsync();
                return View(sweetItems);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<IActionResult> Details(int id)
        {
            try
            {
                var sweetItem = await _unitOfWork.SweetItem.GetByIdAsync(id);
                if (sweetItem == null)
                {
                    return NotFound();
                }

                return View(sweetItem);
            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public IActionResult Create()
        {
            try
            {
                // Fetch categories directly from the database
                var categories = _context.ProductCategories 
                    .Select(c => new SelectListItem
                    {
                        Value = c.Category,
                        Text = c.Category
                    })
                    .ToList();
                ViewBag.ProductCategoryList = categories;

                return View(new SweetItem());
                // return View();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> GetSweetItems()
        {
            try
            {
                var sweetItems = await _unitOfWork.SweetItem.GetAllAsync();

                var result = sweetItems.Select(item => new
                {
                    item.ItemName,
                    item.Price,
                    item.Currency,
                    item.TotalQuantity,
                    item.Unit,
                    item.FinalCost,
                    ProductCategory = item.ProductCategory != null ? item.ProductCategory.ToString() : "No Category"
                }).ToList();

                return Json(new { data = result });
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message });
            }
        }



        #region APIs

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(SweetItem model)
        {
            try
            {
                if (ModelState.IsValid)
                {
                    _context.SweetItems.Add(model);
                    _context.SaveChanges();
                    return RedirectToAction("Index");
                }
                // If invalid, repopulate categories
                ViewBag.ProductCategoryList = _context.ProductCategories.Select(c => new SelectListItem
                {
                    Value = c.Category,
                    Text = c.Category
                }).ToList();

                return View(model);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var item = await _unitOfWork.SweetItem.GetByIdAsync(id);

                if (item == null)
                {
                    return NotFound();
                }

                await _unitOfWork.SweetItem.DeleteAsync(id);
                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            try
            {
                // Fetch categories directly from the database
                var categories = _context.ProductCategories
                    .Select(c => new SelectListItem
                    {
                        Value = c.Category,
                        Text = c.Category
                    })
                    .ToList();
                ViewBag.ProductCategoryList = categories;
                var sweetItem = await _unitOfWork.SweetItem.GetByIdAsync(id);
                if (sweetItem == null)
                {
                    return NotFound();
                }
                return View(sweetItem);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(SweetItem sweetItem, double? quantityToAdd)
        {
            try
            {
                if (quantityToAdd.HasValue)
                {
                    if (quantityToAdd <= 0)
                    {
                        ModelState.AddModelError("", "Please enter a valid quantity to add.");
                        return RedirectToAction(nameof(Index));
                    }
                    var existingSweetItem = await _unitOfWork.SweetItem.GetByIdAsync(sweetItem.Id);
                    existingSweetItem.TotalQuantity += quantityToAdd.Value;
                    await _unitOfWork.SweetItem.UpdateAsync(existingSweetItem);
                    await _unitOfWork.SaveAsync();
                    return RedirectToAction(nameof(Index));
                }

                if (ModelState.IsValid)
                {
                    try
                    {
                        await _unitOfWork.SweetItem.UpdateAsync(sweetItem);
                        await _unitOfWork.SaveAsync();
                        return RedirectToAction(nameof(Index));
                    }
                    catch (Exception ex)
                    {
                        ModelState.AddModelError("", "An error occurred while updating the item.");
                    }
                }
                return View(sweetItem);
            }
            catch (Exception ex)
            {
                throw ex;
            }

            #endregion
        }
    }
}
