$(document).ready(function () {
    $('#submitSale').on('click', function () {
        let saleItemsSummary = '';
        let totalPrice = 0;

        // Loop through each row in the selected items table
        $('#selectedItemsTable tbody tr').each(function () {
            const $row = $(this);
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
            }
        });

        const discount = parseFloat($('#discount').val()) || 0;
        const discountedPrice = totalPrice - (totalPrice * (discount / 100));
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
            printWindow.document.close(); // Close the document to finish rendering
            printWindow.focus(); // Ensure focus is on the print window
            printWindow.print(); // Trigger print dialog
        });

        // Close and Submit functionality
        $('#closeReceipt').off('click').on('click', function () {
            $('#receiptModal').modal('hide');
        });

        //$('#closeReceipt').click(function () {
        //    $('#saleForm')[0].submit(); // Submit the form after closing
        //});
        $('#closeReceipt').click(function () {
            // Gather all rows from the selected items table
            var selectedItems = [];
            $('#selectedItemsTable tbody tr').each(function () {
                var item = {
                    SweetItemId: $(this).data('sweetitemid'),
                    QuantitySold: $(this).find('.quantitySold').val(),
                    SalePrice: $(this).find('.salePrice').val(),
                    Discount: $(this).find('.discount').val(),
                    FinalPrice: $(this).find('.finalPrice').text()
                };
                selectedItems.push(item);
            });

            // Append the selected items to the form as hidden inputs
            selectedItems.forEach(function (item, index) {
                $('<input>').attr({
                    type: 'hidden',
                    name: 'saleViewModels[' + index + '].SweetItemId',
                    value: item.SweetItemId
                }).appendTo('#saleForm');

                $('<input>').attr({
                    type: 'hidden',
                    name: 'saleViewModels[' + index + '].QuantitySold',
                    value: item.QuantitySold
                }).appendTo('#saleForm');

                $('<input>').attr({
                    type: 'hidden',
                    name: 'saleViewModels[' + index + '].SalePrice',
                    value: item.SalePrice
                }).appendTo('#saleForm');

                $('<input>').attr({
                    type: 'hidden',
                    name: 'saleViewModels[' + index + '].Discount',
                    value: item.Discount
                }).appendTo('#saleForm');

                $('<input>').attr({
                    type: 'hidden',
                    name: 'saleViewModels[' + index + '].FinalPrice',
                    value: item.FinalPrice
                }).appendTo('#saleForm');
            });

            // Now submit the form
            $('#saleForm')[0].submit();
        });
    });
});




