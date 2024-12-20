//Code for printing the receipt 
$(document).ready(function () {
    $('#saleForm').submit(function (e) {
        e.preventDefault(); // Prevent form submission

        // Capture input data
        var sweetItemText = $('#sweetItemId option:selected').text();
        var sweetItemName = sweetItemText.split('(')[0].trim();
        var quantitySold = $('#quantitySold').val();
        var units = $('#unit').val();
        var currency = $('#currencyLabel1').text();
        var salePrice = parseFloat($('#salePrice').val());
        var discount = parseFloat($('#discount').val()) || 0;

        // Validate Discount
        if (discount < 0 || discount > 100) {
            $('#discountError').text("Discount must be between 0 and 100%.");
            return;
        } else {
            $('#discountError').text("");
        }

        // Validate finalPrice
        var finalPrice = parseFloat($('#finalPrice').val());
        if (isNaN(finalPrice) || finalPrice <= 0) {
            alert('Please enter a valid final price.');
            return; // Exit if final price is invalid
        }

        // Generate receipt content
        var receiptContent = `
            <div>
                <h5><strong>Item Name:</strong> ${sweetItemName}</h5>
                <p><strong>Quantity:</strong> ${quantitySold} ${units}</p>
                <p><strong>Sale Price per Unit:</strong> ${salePrice.toFixed(2)} ${currency}</p>
                <p><strong>Discount :</strong> ${discount.toFixed(2)}%</p>
                <p><strong>Price to be Paid:</strong> ${finalPrice.toFixed(2)} ${currency}</p>
                <p><strong>Date and Time of Purchase:</strong> ${new Date().toLocaleString()}</p>
            </div>
        `;

        // Inject content into the modal and show it
        $('#receiptModalBody').html(receiptContent);
        $('#receiptModal').modal('show');

        // Print functionality
        $('#printReceipt').off('click').on('click', function () {
            var printContents = $('#receiptModalBody').html();
            var printWindow = window.open('', '', 'height=600,width=800');
            printWindow.document.write('<html><head><title>Receipt</title></head><body>');
            printWindow.document.write(printContents);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();
            // Automatically submit the form after the print click
            setTimeout(function () {
                $('#saleForm')[0].submit(); 
            }, 4000); 
        });

        $('#closeReceipt').off('click').on('click', function () {
            $('#receiptModal').modal('hide');
            $('#saleForm')[0].submit();
        });

        // Close and Submit functionality
          $('#closeReceipt').click(function () {
              $('#saleForm')[0].submit(); 
           });
      });
});

