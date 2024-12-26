$(document).ready(function () {
    const $sweetItemDropdown = $('#selectSweetItem');
    const $selectedItemsTable = $('#selectedItemsTable');
    const $tableBody = $selectedItemsTable.find('tbody');
    const $totalFinalPrice = $('#totalFinalPrice');
    const $discount = $('#discount');
    const $saleForm = $('#saleForm');

    $sweetItemDropdown.on('change', function () {
        const $selectedOption = $(this).find(':selected');
        const sweetItemId = $selectedOption.val();

        if (!sweetItemId) return;

        const sweetItemName = $selectedOption.data('name');
        const availableQuantity = parseFloat($selectedOption.data('quantity'));
        const unit = $selectedOption.data('unit');

        // Check if the item is already selected
        if ($tableBody.find(`tr[data-id="${sweetItemId}"]`).length > 0) {
            alert('This item is already selected. Please choose a different item.');
            $sweetItemDropdown.val(''); // Reset dropdown
            return;
        }

        // Create and append a new row for the selected item
        const $row = $(`
            <tr data-id="${sweetItemId}">
                <td>${sweetItemName}</td>
                <td>${availableQuantity} ${unit}</td>
                <td>
                    <div class="input-group">
                        <input type="number" class="form-control quantity-sold" 
                               data-available="${availableQuantity}" 
                               placeholder="Quantity" min="1.00" 
                               max="${availableQuantity}" required 
                               style="max-width: 350px;">
                        <select class="form-select quantity-unit" style="max-width: 80px;">
                            <option value="${unit}" selected>${unit}</option>
                        </select>
                    </div>
                    <div class="error-message text-danger" style="display:none;"></div>
                </td>
                <td>
                    <input type="text" class="form-control cost-price" readonly>
                </td>
                <td>
                    <div class="input-group">
                        <input type="number" class="form-control price-per-unit" 
                               placeholder="Price per Unit" min="1.00" required>
                        <select class="form-select price-currency" style="max-width: 80px;">
                            <option value="INR" selected>INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                    <div class="error-message text-danger" style="display:none;"></div>
                </td>
                <td>
                    <input type="text" class="form-control final-price" readonly>
                </td>
                <td>
                    <button class="btn btn-danger btn-sm remove-item">Remove</button>
                </td>
            </tr>
        `);

        $tableBody.append($row);
        $selectedItemsTable.removeClass('d-none'); // Show table if hidden

        // Fetch cost price
        $.ajax({
            url: getCostPriceUrl,
            type: 'GET',
            data: { sweetItemId },
            success: function (data) {
                $row.find('.cost-price').val(`${data.costPrice} ${data.currency}`);
            },
            error: function () {
                alert('An error occurred while fetching the cost price.');
            }
        });

        // Add functionality to remove button
        $row.find('.remove-item').on('click', function () {
            $row.remove();
            $sweetItemDropdown.find(`option[value="${sweetItemId}"]`).prop('disabled', false);
            updateTotalFinalPrice();

            if ($tableBody.children('tr').length === 0) {
                $selectedItemsTable.addClass('d-none');
            }
        });

        // Handle quantity and price changes
        $row.find('.quantity-sold, .price-per-unit').on('input', function () {
            validateQuantity($row);
            calculateRowFinalPrice($row);
            updateTotalFinalPrice();
        });

        // Disable selected option and reset dropdown
        $selectedOption.prop('disabled', true);
        $sweetItemDropdown.val('');
    });

    function validateQuantity($row) {
        const $quantityInput = $row.find('.quantity-sold');
        const availableQuantity = parseFloat($quantityInput.data('available'));
        const enteredQuantity = parseFloat($quantityInput.val()) || 0;

        if (enteredQuantity > availableQuantity) {
            alert('Sold quantity cannot exceed available quantity.');
            $quantityInput.val(availableQuantity);
        }
    }

    function calculateRowFinalPrice($row) {
        const quantity = parseFloat($row.find('.quantity-sold').val()) || 0;
        const pricePerUnit = parseFloat($row.find('.price-per-unit').val()) || 0;

        const finalPrice = quantity * pricePerUnit;
        $row.find('.final-price').val(finalPrice.toFixed(2));
    }

    function updateTotalFinalPrice() {
        let totalPrice = 0;

        $tableBody.find('tr').each(function () {
            const finalPrice = parseFloat($(this).find('.final-price').val()) || 0;
            totalPrice += finalPrice;
        });

        const discount = parseFloat($discount.val()) || 0;
        if (discount > 0) {
            totalPrice -= totalPrice * (discount / 100);
        }

        $totalFinalPrice.val(totalPrice.toFixed(2));
    }

    $discount.on('input', updateTotalFinalPrice);
    //// Form submission logic
});



$(document).ready(function () {
    $('#saveSale').on('click', function () {
        $('#saleForm').find('input[type="hidden"]').remove();

        const $tableBody = $('#selectedItemsTable').find('tbody');
        if ($tableBody.children('tr').length === 0) {
            alert('Please select at least one item before submitting.');
            return;
        }
        $tableBody.find('tr').each(function (index) {
            const $row = $(this);
            $('<input>').attr({
                type: 'hidden',
                name: `saleViewModels[${index}].SweetItemId`,
                value: $row.data('id'),
            }).appendTo('#saleForm');

            $('<input>').attr({
                type: 'hidden',
                name: `saleViewModels[${index}].QuantitySold`,
                value: $row.find('.quantity-sold').val(),
            }).appendTo('#saleForm');

            $('<input>').attr({
                type: 'hidden',
                name: `saleViewModels[${index}].Unit`,
                value: $row.find('.quantity-unit').val(),
            }).appendTo('#saleForm');

            $('<input>').attr({
                type: 'hidden',
                name: `saleViewModels[${index}].SalePrice`,
                value: $row.find('.price-per-unit').val(),
            }).appendTo('#saleForm');

            $('<input>').attr({
                type: 'hidden',
                name: `saleViewModels[${index}].Currency`,
                value: $row.find('.price-currency').val(),
            }).appendTo('#saleForm');

            $('<input>').attr({
                type: 'hidden',
                name: `saleViewModels[${index}].FinalPrice`,
                value: $row.find('.final-price').val(),
            }).appendTo('#saleForm');

            $('<input>').attr({
                type: 'hidden',
                name: 'saleViewModels[${index}].Discount',
                value: discount,
            }).appendTo('#saleForm');
        });
        $('#saleForm')[0].submit();
    });
});
