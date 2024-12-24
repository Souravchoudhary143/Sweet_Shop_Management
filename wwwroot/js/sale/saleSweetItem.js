$(document).ready(function () {
    $('#selectSweetItem').on('change', function () {
        const $selectElement = $(this);
        const $selectedOption = $selectElement.find(':selected');
        const sweetItemId = $selectedOption.val();

        if (!sweetItemId) {
            return;
        }

        if (!$selectedOption.val()) {
            return;
        }

        const sweetItemName = $selectedOption.data('name');
        const availableQuantity = parseFloat($selectedOption.data('quantity'));
        const unit = $selectedOption.data('unit');

        // Check if the item is already selected
        const alreadySelected = $(`#selectedItemsTable tbody tr[data-id="${sweetItemId}"]`);
        if (alreadySelected.length > 0) {
            alert('This item is already selected. Please choose a different item.');
            return;
        }

        // Create and append a new row for the selected item
        const $row = $(`
                    <tr data-id="${sweetItemId}">
                        <td>${sweetItemName}</td>
                        <td>${availableQuantity} ${unit}</td>
                        <td>
                            <div class="input-group">
                                <input type="number" class="form-control quantity-sold" data-available="${availableQuantity}" placeholder="Quantity" min="1.00" max="${availableQuantity}" required style="max-width: 350px;">
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
                                <input type="number" class="form-control price-per-unit" placeholder="Price per Unit" min="1.00" required>
                                <select class="form-select price-currency" style="max-width: 80px;">
                                    <option value="INR" selected>INR</option>
                                    <option value="USD" >USD</option>
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

        $('#selectedItemsTable tbody').append($row);
        $('#selectedItemsTable').removeClass('d-none'); // Show table if hidden

        // Fetch cost price and set it
        $.ajax({
            url: getCostPriceUrl,
            type: 'GET',
            data: { sweetItemId: sweetItemId },
            success: function (data) {
                $row.find('.cost-price').val(`${data.costPrice} ${data.currency}`);
            },
            error: function () {
                alert('An error occurred while fetching the cost price.');
            }
        });
        // Add remove functionality for the row
        $row.find('.remove-item').on('click', function () {
            const sweetItemId = $row.data('id'); // Get the ID of the removed item
            $row.remove(); // Remove the row from the table

            // Enable the option in the dropdown again
            $('#selectSweetItem option[value="' + sweetItemId + '"]').prop('disabled', false);

            updateTotalFinalPrice(); // Update the total final price

            // Hide table if no rows remain
            if ($('#selectedItemsTable tbody tr').length === 0) {
                $('#selectedItemsTable').addClass('d-none');
            }
        });

        // Handle input changes for quantity and price
        $row.find('.quantity-sold, .price-per-unit').on('input', function () {
            const $currentRow = $(this).closest('tr');
            validateQuantity($currentRow);
            calculateRowFinalPrice($currentRow);
            updateTotalFinalPrice();
        });

        // Disable the selected option to prevent re-selection
        $selectedOption.prop('disabled', true);

        // Reset dropdown to default
        $selectElement.val('');
    });

    // Validate quantity
    function validateQuantity($row) {
        const $quantityInput = $row.find('.quantity-sold');
        const availableQuantity = parseFloat($quantityInput.data('available'));
        const enteredQuantity = parseFloat($quantityInput.val()) || 0;

        if (enteredQuantity > availableQuantity) {
            alert('Sold quantity cannot exceed available quantity.');
            $quantityInput.val(availableQuantity);
        }
    }

    // Calculate final price for a row
    function calculateRowFinalPrice($row) {
        const $quantityInput = $row.find('.quantity-sold');
        const $priceInput = $row.find('.price-per-unit');
        const $finalPriceInput = $row.find('.final-price');

        const quantity = parseFloat($quantityInput.val()) || 0;
        const pricePerUnit = parseFloat($priceInput.val()) || 0;

        const finalPrice = quantity * pricePerUnit;
        $finalPriceInput.val(finalPrice.toFixed(2));
    }

    // Update the total final price
    function updateTotalFinalPrice() {
        let totalPrice = 0;

        $('#selectedItemsTable tbody tr').each(function () {
            const $row = $(this);
            const $finalPriceInput = $row.find('.final-price');
            const finalPrice = parseFloat($finalPriceInput.val()) || 0;
            totalPrice += finalPrice;
        });

        const discount = parseFloat($('#discount').val()) || 0;
        if (discount > 0) {
            totalPrice = totalPrice - (totalPrice * (discount / 100));
        }

        $('#totalFinalPrice').val(totalPrice.toFixed(2));
    }

    // Handle discount input change
    $('#discount').on('input', updateTotalFinalPrice);
});