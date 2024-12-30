function viewOrderItems(orderId) {
    $.ajax({
        url: `/Order/GetOrderItems?orderId=${orderId}`,
        type: 'GET',
        success: function (response) {
            if (response.success) {
                let itemsHtml = '';
                response.orderItems.forEach(item => {
                    itemsHtml += `
                        <tr>
                            <td>${item.SweetItemName || 'N/A'}</td>
                            <td>${item.QuantitySold}</td>
                            <td>${item.SalePrice.toFixed(2)}</td>
                            <td>${item.FinalPrice.toFixed(2)}</td>
                        </tr>
                    `;
                });

                // Insert the items into the modal table body
                $('#orderItemsTableBody').html(itemsHtml);
                // Show the modal
                $('#orderItemsModal').modal('show');
            } else {
                alert('Failed to fetch order items');
            }
        },
        error: function (error) {
            console.error('Error fetching order items:', error);
        }
    });
}
