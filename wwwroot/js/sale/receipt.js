$(document).ready(function () {
    $('#submitSale').on('click', function () {
        let saleItems = [];
        let saleItemsSummary = '';
        let totalPrice = 0;
        let totalItems = 0;

        // Loop through each row in the selected items table
        $('#selectedItemsTable tbody tr').each(function () {
            const $row = $(this);
            const sweetItemId = $row.data('id');
            const itemName = $row.find('td').eq(0).text(); // Item name from the first column
            const quantitySold = parseFloat($row.find('.quantity-sold').val()) || 0;
            const unit = $row.find('.quantity-unit').val() || 'Unit'; // Fetching the unit from the dropdown
            const currency = $row.find('.price-currency').val() || 'INR';
            const pricePerUnit = parseFloat($row.find('.price-per-unit').val()) || 0;
            const finalPrice = parseFloat($row.find('.final-price').val()) || 0;

            // Only add to summary if the item has valid data
            if (quantitySold > 0 && pricePerUnit > 0 && finalPrice > 0) {
                saleItemsSummary += `
                    <tr>
                        <td>${itemName}</td>
                        <td>${quantitySold}  ${unit}</td>
                        <td>${pricePerUnit.toFixed(2)} ${currency}</td>
                        <td>${finalPrice.toFixed(2)} ${currency}</td>
                    </tr>
                `;
                totalPrice += finalPrice;
                
                    totalItems += 1;
                

                // Push data into saleItems array
                saleItems.push({
                    SweetItemId: sweetItemId,
                    QuantitySold: quantitySold,
                    SalePrice: pricePerUnit,
                    FinalPrice: finalPrice,
                    Discount: $('#discount').val() || 0,
                    Unit: unit,
                    Currency: currency
                });
            }
        });

        const discount = parseFloat($('#discount').val()) || 0;
        const discountedPrice = totalPrice - (totalPrice * (discount / 100));

        console.log('Sale Items:', saleItems);
        console.log('Total Price:', totalPrice);
        console.log('Discounted Price:', discountedPrice);

        const receiptContent = `
            <div>
                <h5><strong>Sale Items:</strong></h5>
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th>Item Name</th>
                            <th>Quantity Sold</th>
                            <th>Price per Unit</th>
                            <th>Final Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${saleItemsSummary}
                    </tbody>
                </table>
                <p><strong>Total Price:</strong> ${totalPrice.toFixed(2)} </p>
                <p><strong>Discount:</strong> ${discount.toFixed(2)}%</p>
                <p><strong>Total After Discount:</strong> ${discountedPrice.toFixed(2)} INR</p>
                <p><strong>Date and Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
        `;

        $('#receiptModalBody').html(receiptContent);

        $('#receiptModal').modal('show');

        $('#printReceipt').off('click').on('click', function () {
            const printContents = $('#receiptModalBody').html();

            if (!printContents) {
                alert('No receipt content available to print.');
                return;
            }

            const printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Receipt</title>');
            printWindow.document.write('<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">'); // Optional: Link to Bootstrap for styling
            printWindow.document.write('</head><body>');
            printWindow.document.write(printContents);
            printWindow.document.close(); 
            printWindow.focus();
            printWindow.print(); 
            setTimeout(function () {
                $('#closeReceipt').click();
                $('#saveSale').click(); 
            }, 3000);
        });

        // Close and Submit functionality
        $('#closeReceipt').off('click').on('click', function () {
            $('#receiptModal').modal('hide');
        });

        //$('#closeReceipt').click(function () {
        //    $('#saleForm')[0].submit(); // Submit the form after closing
        //});
        $('#closeReceipt').off('click').on('click', function () {
            $.ajax({
                url: orderUrl, 
                type: 'POST',
                contentType: 'application/json',
                data : JSON.stringify({
                    OrderItems: saleItems,
                    TotalPrice: totalPrice,
                    TotalItems: totalItems,
                    FinalPrice: discountedPrice,
                    Discount: discount,
                    SaleDate: new Date().toISOString()
                }),
                success: function (response) {
                    if (response.success) {
                        //It will automatically trigger the save sell record button 
                        $('#saveSale').click();
                        // Close the receipt (modal or receipt section) after successful submission
                        $('#receiptModal').modal('hide');
                    } else {
                        alert('Failed to save the order. Please try again.');
                    }
                },
                error: function (error) {
                    alert('Failed to save the order. Please try again.');
                }
            });
        });
    });
});




