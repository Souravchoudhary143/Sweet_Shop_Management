using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Sweet_Shop_Management.Models;
using Sweet_Shop_Management.Repository.IRepository;

namespace Sweet_Shop_Management.Controllers
{
    //[Authorize]
    public class SaleController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        public SaleController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;   
        }
        [Route("sale")]
        public async Task<IActionResult> Index()
        {
            try
            {
                var sales = await _unitOfWork.Sale.GetAllSalesAsync();
                var sweetItems = await _unitOfWork.SweetItem.GetAllAsync();
                // Combine sales with profit and currency
                var salesWithDetails = sales.Select(sale =>
                {
                    var sweetItem = sweetItems.FirstOrDefault(item => item.Id == sale.SweetItemId);

                    if (sweetItem != null)
                    {
                        sale.CostPrice = sweetItem.Price;
                        var ShowQuantitySold = sale.QuantitySold * 100;
                        var totalSalePrice = sale.QuantitySold * sale.SalePrice;
                        var discountPercentage = sale.Discount ;
                        var discountAmount = (discountPercentage / 100) * (decimal)totalSalePrice; 
                        var finalSalePrice = (decimal)totalSalePrice - discountAmount;
                        var totalCost = sweetItem.Price * sale.QuantitySold;
                        var profit = (double)finalSalePrice - totalCost;
                        sale.Profit = profit;
                        var itemName = sweetItem.ItemName;
                    }
                    return sale;
                }).ToList();

                // Pass the list of SweetItems to the view 
                ViewBag.SweetItems = sweetItems;
                return View(salesWithDetails);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> Create(int? id)
        {
            var sweetItems = await _unitOfWork.SweetItem.GetAllAsync();
            var viewModel = sweetItems.Select(item => new SaleViewModel { SweetItemId = item.Id, SweetItemName = item.ItemName, TotalAvailableQuantity = item.TotalQuantity, Unit = item.Unit, Currency = item.Currency }).ToList();
            ViewBag.SweetItems = viewModel;
            var saleViewModel = new SaleViewModel();
            if (id.HasValue)
            {
                saleViewModel.SweetItemId = id.Value;
                //used to get the cost price value which we need to show in the create view
                var sale = await _unitOfWork.Sale.GetAllSaleByIdAsync(id.Value);
                if (sale != null)
                {
                    saleViewModel.CostPrice = sale.CostPrice;
                }
            }
            return View(saleViewModel);
        }
        [HttpPost]
        public async Task<IActionResult> Create(List<SaleViewModel> saleViewModels)
        {
            try
            {
                foreach (var saleViewModel in saleViewModels)
                {
                    var sweetItem = await _unitOfWork.SweetItem.GetByIdAsync(saleViewModel.SweetItemId);
                    if (sweetItem == null)
                    {
                        ModelState.AddModelError("", $"Sweet item with ID {saleViewModel.SweetItemId} not found.");
                        return View(saleViewModels);
                    }

                    var quantitySold = saleViewModel.QuantitySold;
                    var availableQuantity = sweetItem.TotalQuantity;
                    var availableUnit = sweetItem.Unit;
                    var discount = saleViewModel.Discount ?? 0;

                    string selectedCurrency = saleViewModel.Currency ?? "INR";
                    if (saleViewModel.Unit == "Gram" && availableUnit == "Kg")
                    {
                        quantitySold /= 1000;
                    }
                    else if (saleViewModel.Unit == "Kg" && availableUnit == "Gram")
                    {
                        quantitySold *= 1000;
                    }

                    if (quantitySold > availableQuantity)
                    {
                        ModelState.AddModelError("QuantitySold", "The quantity sold cannot exceed the total available quantity.");
                        return View(saleViewModels);
                    }

                    sweetItem.TotalQuantity -= quantitySold;
                    sweetItem.TotalSellQuantity += quantitySold;

                    // Calculate the profit, considering the discount if provided
                    decimal salePrice = (decimal)saleViewModel.SalePrice;
                    if (saleViewModel.Discount.HasValue)
                    {
                        decimal discountAmount = (saleViewModel.Discount.Value / 100) * salePrice;
                        salePrice -= discountAmount;
                    }

                    var sale = new Sale
                    {
                        SweetItemId = saleViewModel.SweetItemId,
                        QuantitySold = quantitySold,
                        SalePrice = saleViewModel.SalePrice,
                        SaleDate = DateTime.Now,
                        RemainingQuantity = sweetItem.TotalQuantity,
                        Unit = saleViewModel.Unit ?? availableUnit,
                        Currency = selectedCurrency,
                        CostPrice = sweetItem.Price,
                        Profit = (saleViewModel.SalePrice - sweetItem.Price) * quantitySold,
                        Discount = discount
                    };

                    await _unitOfWork.Sale.AddSaleAsync(sale);
                    await _unitOfWork.SweetItem.UpdateAsync(sweetItem);
                }

                // Save all changes to the database
                await _unitOfWork.CompleteAsync(); // Commit all changes automatically

                return RedirectToAction(nameof(Index));
            }
            catch (Exception ex)
            {
                ModelState.AddModelError("", "An error occurred while processing the sale. Please try again.");
                return View(saleViewModels);
            }
        }


        [HttpGet]
        public async Task<IActionResult> GetCostPrice(int sweetItemId)
        {
            var sweetItem = await _unitOfWork.SweetItem.GetByIdAsync(sweetItemId);
            if (sweetItem != null)
            {
                return Json(new { costPrice = sweetItem.Price, currency = sweetItem.Currency});
            }
            return Json(new { costPrice = 0, currency = ""});
        }
    }
}
