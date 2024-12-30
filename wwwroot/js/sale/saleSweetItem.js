$(document).ready(function () {
    const $sweetItemDropdown = $('#selectSweetItem');
    const $selectedItemsTable = $('#selectedItemsTable');
    const $tableBody = $selectedItemsTable.find('tbody');
    const $totalFinalPrice = $('#totalFinalPrice');
    const $discount = $('#discount');
    const $saleForm = $('#saleForm');

    $sweetItemDropdown.on('change', function () {
        let isDuplicate = false;
        
        const $selectedOption = $(this).find(':selected').last();
        const sweetItemId = $selectedOption.val();
        if (!sweetItemId) return;

        $tableBody.find('tr').each(function () {
            const existingId = $(this).data('id');
            if (existingId == sweetItemId) {
                isDuplicate = true;
                return false;
            }
        });
        if (isDuplicate) {
            Swal.fire({
                icon: 'warning',
                text: 'This item is already selected. Please choose a different item.',
                confirmButtonText: 'OK',
                position: 'top-bottom',
                customClass: {
                    popup: 'swal-custom-popup'
                }
            });
            $sweetItemDropdown.val(''); // Reset dropdown
            return;
        }
        const sweetItemName = $selectedOption.data('name');
        const availableQuantity = parseFloat($selectedOption.data('quantity'));
        const unit = $selectedOption.data('unit');       

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
                               style="width: 80px;">
                        <select class="form-select quantity-unit" style="max-width: 150px;">
                            <option value="${unit}" selected>${unit}</option>
                            <option value="Kg">Kg</option>
                            <option value="Gram">Gram</option>
                        </select>
                    </div>
                    <div class="error-message text-danger" style="display;"></div>
                </td>
                <td>
                    <input type="text" class="form-control cost-price" readonly   style="width: 80px;">
                </td>
                <td>
                    <div class="input-group">
                        <input type="number" class="form-control price-per-unit"
                               placeholder="Price per Unit" min="1.00" required  style="width: 80px;">
                        <select class="form-select price-currency" style="max-width: 80px;">
                            <option value="INR" selected>INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                        </select>
                    </div>
                    <div class="error-message text-danger" style="display;"></div>
                </td>
                <td>
                    <input type="text" class="form-control final-price" readonly  style="width: 80px;">
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
            const $row = $(this).closest("tr");
            const sweetItemId = $row.data('id');
            $row.remove();
            const $option = $sweetItemDropdown.find(`option[value="${sweetItemId}"]`);
            $option.prop("disabled", false);
            $option.prop("selected", false);
            updateTotalFinalPrice();

            if ($tableBody.children('tr').length === 0) {
                $selectedItemsTable.addClass('d-none');
            }
        });

        $row.find('.quantity-sold, .price-per-unit').on('input', function () {
            validateFields($row);
            validateQuantity($row);
            calculateRowFinalPrice($row);
            updateTotalFinalPrice();
        });

        $selectedOption.prop('disabled', true);
        $sweetItemDropdown.val('');
    });


    function validateFields($row) {
        const $quantityInput = $row.find('.quantity-sold');
        const $priceInput = $row.find('.price-per-unit');
        const $quantityError = $quantityInput.siblings('.error-message');
        const $priceError = $priceInput.siblings('.error-message');

        let isValid = true;

        if (!$quantityInput.val()) {
            $quantityError.text('Quantity is required.').show();
            isValid = false;
        } else {
            $quantityError.hide();
        }

        // Validate price per unit field
        if (!$priceInput.val()) {
            $priceError.text('Price per unit is required.').show();
            isValid = false;
        } else {
            $priceError.hide();
        }

        return isValid;
    }

    $(document).on('change', '.quantity-unit', function () {
        const $row = $(this).closest('tr');
        const selectedUnit = $(this).val();
        const $quantityInput = $row.find('.quantity-sold');
        const currentQuantity = parseFloat($quantityInput.val()) || 0;
        const availableQuantity = parseFloat($quantityInput.data('available'));

        if (selectedUnit === 'Gram') {
            $quantityInput.data('available', availableQuantity * 1000);
        } else if (selectedUnit === 'Kg') {
            $quantityInput.data('available', availableQuantity / 1000);
        }

        if (currentQuantity > 0) {
            let adjustedQuantity;
            if (selectedUnit === 'Gram') {
                adjustedQuantity = currentQuantity * 1000;
            } else if (selectedUnit === 'Kg') {
                adjustedQuantity = currentQuantity / 1000;
            }
            //Swal.fire({
            //    icon: 'question',
            //    title: 'Adjust Quantity?',
            //    text: `Would you like to adjust the entered quantity (${currentQuantity}) to the new unit (${adjustedQuantity} ${selectedUnit})?`,
            //    showCancelButton: true,
            //    confirmButtonText: 'Yes, adjust it',
            //    cancelButtonText: 'No, keep it as is',
            //}).then((result) => {
            //    if (result.isConfirmed) {
            //        $quantityInput.val(adjustedQuantity.toFixed(2));
            //    }
            //});
        }

        validateQuantity($row);
    });


    function validateQuantity($row) {
        const $quantityInput = $row.find('.quantity-sold');
        const availableQuantity = parseFloat($quantityInput.data('available'));
        const enteredQuantity = parseFloat($quantityInput.val()) || 0;

        if (enteredQuantity > availableQuantity) {
            Swal.fire({
                icon: 'warning',
                title: 'Quantity Exceed',
                text: 'Sold quantity cannot exceed available quantity.',
                confirmButtonText: 'OK',
                position: 'top-bottom',
                customClass: {
                    popup: 'swal-custom-popup'
                }
            });
           $quantityInput.val(' ');
        }
    }

    function calculateRowFinalPrice($row) {
        const quantity = parseFloat($row.find('.quantity-sold').val()) || 0;
        const pricePerUnit = parseFloat($row.find('.price-per-unit').val()) || 0;
        const unit = $row.find('.quantity-unit').val();
        let adjustedQuantity = quantity;

        if (unit === 'Gram') {
            adjustedQuantity = quantity / 1000;
        }

        const finalPrice = adjustedQuantity * pricePerUnit;
        $row.find('.final-price').val(finalPrice.toFixed(2));
    }

    function updateTotalFinalPrice() {
        let totalPrice = 0;

        $tableBody.find('tr').each(function () {
            const finalPrice = parseFloat($(this).find('.final-price').val()) || 0;
            totalPrice += finalPrice;
        });
        const discount = parseFloat($discount.val()) || 0;
         if (discount < 0) {
            $discount.val(0);
        }
        if (discount > 100) {
            $discount.val(100);
            Swal.fire({
                icon: 'warning',
                text: 'Discount cannot exceed 100%. It has been set to 100%.',
                confirmButtonText: 'OK',
                position: 'top-bottom',
                customClass: {
                    popup: 'swal-custom-popup'
                }
            });
        }

        if (discount > 0) {
            totalPrice -= totalPrice * (discount / 100);
        }

        $totalFinalPrice.val(totalPrice.toFixed(2));
    }

    $discount.on('input', updateTotalFinalPrice);
});



// Form submission logic
$(document).ready(function () {
    $('#saveSale').on('click', function () {
        $('#saleForm').find('input[type="hidden"]').remove();

        const $tableBody = $('#selectedItemsTable').find('tbody');
        if ($tableBody.children('tr').length === 0) {
            Swal.fire({
                icon: 'warning',
                title: 'No Items Selected',
                text: 'Please select at least one item before submitting.',
                confirmButtonText: 'OK',
                position: 'top-bottom',
                customClass: {
                    popup: 'swal-custom-popup'
                }
            });
            return;
        }

        let isValid = true; 

        $tableBody.find('tr').each(function () {
            const $row = $(this);
            $row.find('input, select').each(function () {
                const $input = $(this);
                const value = $input.val();

                if (!value || value.trim() === '') {
                    $input.closest('div').find('.error-message').text('This field is required.').show();
                    isValid = false;
                } else {
                    $input.closest('div').find('.error-message').text('This field is required.').hide();
                }
            });
        });

        if (!isValid) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Failed',
                text: 'Please fill all required fields before submission.',
                confirmButtonText: 'Fix Issues',
                position: 'top-bottom',
                customClass: {
                    popup: 'swal-custom-popup'
                }
            });
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

