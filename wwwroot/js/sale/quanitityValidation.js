//@* This code is responsible for the validation that the Sold qantity should not be greater then the available quantity * @
    $(document).ready(function () {
        var availableQuantity = 0;
        var availableUnit = '';
        var submitButton = $('#submitButton');

        submitButton.prop('disabled', true);
        $('#sweetItemId').change(function () {
            var selectedItem = $(this).find(':selected');
            availableQuantity = selectedItem.data('quantity');
            availableUnit = selectedItem.data('unit');
            $('#quantitySold').val('');
            $('#quantitySoldError').text('');
            validateForm();
        });

        $('#quantitySold').keyup(function () {
            validateQuantitySold();
            validateForm();
        });

        $('#unit').change(function () {
            validateUnit();
            validateQuantitySold();
            validateForm();
        });

        function validateQuantitySold() {
            var quantitySold = parseFloat($('#quantitySold').val());
            var unit = $('#unit').val();

            if (isNaN(quantitySold) || quantitySold <= 0) {
                $('#quantitySoldError').text('Please enter a valid quantity').css('color', 'red');
                return false;
            }

            if (unit === 'Gram' && availableUnit === 'Kg') {
                quantitySold = quantitySold / 1000;
            } else if (unit === 'Kg' && availableUnit === 'Gram') {
                quantitySold = quantitySold * 1000;
            }

            if (quantitySold > availableQuantity) {
                $('#quantitySoldError').text('Quantity sold cannot be greater than the available quantity.').css('color', 'red');
                return false;
            }
            $('#quantitySoldError').text('');
            return true;
        }
        function validateUnit() {
            var unit = $('#unit').val();
            if (unit === '') {
                $('#quantitySoldError').text('Please select a valid unit (Kg or Gram)').css('color', 'red');
                return false;
            }
            return true;
        }

        function validateForm() {
            var quantitySoldValid = validateQuantitySold();
            var unitValid = $('#unit').val() !== '';
            var quantitySold = parseFloat($('#quantitySold').val());
            if (quantitySoldValid && unitValid && quantitySold > 0) {
                submitButton.prop('disabled', false); // Enable submit button
            } else {
                submitButton.prop('disabled', true); // Disable submit button
            }
        }
        $('#saleForm').submit(function (e) {
            var quantitySold = parseFloat($('#quantitySold').val());
            var unit = $('#unit').val();

            if (unit === '' || isNaN(quantitySold) || quantitySold <= 0) {
                e.preventDefault();
                $('#quantitySoldError').text('Please enter a valid quantity and unit').css('color', 'red');
                return;
            }
            if (unit === 'Gram' && availableUnit === 'Kg') {
                quantitySold = quantitySold / 1000;
            } else if (unit === 'Kg' && availableUnit === 'Gram') {
                quantitySold = quantitySold * 1000;
            }
            if (quantitySold > availableQuantity) {
                e.preventDefault();
                $('#quantitySoldError').text('Quantity sold cannot be greater than the available quantity.').css('color', 'red');
            }
        });
    });
