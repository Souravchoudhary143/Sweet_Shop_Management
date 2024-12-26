using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Sweet_Shop_Management.Data;
using Sweet_Shop_Management.Models;
using Sweet_Shop_Management.Models.ViewModel;
using System;
using System.Linq;

namespace Sweet_Shop_Management.Controllers
{
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }


        [HttpGet]
        public IActionResult GetAllOrders()
        {
            var orders = _context.OrderDetails.ToList();
            return View(orders);
        }

        [HttpGet]
        public IActionResult GetOrderItems(int orderId)
        {
            // Transform OrderItems to a view model
            var orderItems = _context.OrderItems
                .Where(item => item.OrderId == orderId)
                .Include(item => item.SweetItem)
                .Select(item => new ItemViewModel
                {
                    SweetItemId = item.SweetItem.Id,
                    SweetItemName = item.SweetItem.ItemName,
                    QuantitySold = item.QuantitySold,
                    SalePrice = item.SalePrice,
                    FinalPrice = item.FinalPrice
                }).ToList();

            return View(orderItems);
        }

        [HttpPost]
        public IActionResult SaveOrder([FromBody] SaveOrderViewModel model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    // Save OrderDetails
                    var orderDetails = new OrderDetails
                    {
                        TotalItems = model.TotalItems,
                        TotalPrice = (decimal)model.TotalPrice,
                        Discount = (decimal)model.Discount,
                        FinalPrice = (decimal)model.FinalPrice,
                        OrderDate = DateTime.Now
                    };

                    _context.OrderDetails.Add(orderDetails);
                    _context.SaveChanges();

                    // Save OrderItems
                    foreach (var item in model.OrderItems)
                    {
                        var orderItem = new OrderItems
                        {
                            OrderId = orderDetails.Id,
                            SweetItemId = item.SweetItemId,
                            QuantitySold = item.QuantitySold,
                            SalePrice = item.SalePrice,
                            FinalPrice = item.FinalPrice
                        };

                        // Deduct quantity from SweetItem
                        var sweetItem = _context.SweetItems.Find(item.SweetItemId);
                        sweetItem.TotalQuantity -= item.QuantitySold;
                        sweetItem.TotalSellQuantity += item.QuantitySold;

                        _context.OrderItems.Add(orderItem);
                    }

                    _context.SaveChanges();

                    return Json(new { success = true, message = "Order saved successfully!" });
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = "An error occurred while saving the order: " + ex.Message });
                }
            }

            return Json(new { success = false, message = "Invalid data submitted." });
        }
    }
}
