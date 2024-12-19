//this is for Pagination and Searching sorting
$(document).ready(function () {
    //Code for pagination 
    const rowsPerPage = 10;
    let currentPage = 1;
    let allRows = [];
    let filteredRows = [];
    function updatePaginationControls() {
        const totalPages = Math.ceil(filteredRows.length / rowsPerPage);
        $('#pageNumber').text('Page ' + currentPage + ' of ' + totalPages);
        $('#prevPage').prop('disabled', currentPage === 1);
        $('#nextPage').prop('disabled', currentPage * rowsPerPage >= filteredRows.length);
    }
    function showPage(page) {
        currentPage = page;
        $('tbody .sale-row').hide();
        var startIndex = (currentPage - 1) * rowsPerPage;
        var endIndex = startIndex + rowsPerPage;
        $(filteredRows.slice(startIndex, endIndex)).show();
        updatePaginationControls();
    }

    //Code for searching sorting 
    $('#searchOption').change(function () {
        var selectedOption = $(this).val();
        $('#textInputContainer').hide();
        $('#monthDropdownContainer').hide();
        $('#datePickerContainer').hide();
        $('#itemNameContainer').hide();

        // Show the appropriate container based on the selected option
        if (selectedOption === 'ItemName') {
            $('#itemNameContainer').show();
        } else if (selectedOption === 'All') {
            $('#textInputContainer').show();
        } else if (selectedOption === 'Month') {
            $('#monthDropdownContainer').show();
        } else if (selectedOption === 'Date') {
            $('#datePickerContainer').show();
            $('#searchDate').datepicker({
                dateFormat: 'yy-mm-dd',
                changeMonth: true,
                changeYear: true,
                maxDate: new Date()
            });
        }
    });
    $('#searchButton').click(function () {
        var searchOption = $('#searchOption').val();
        var keyword = $('#searchKeyword').val().toLowerCase();
        var month = $('#monthDropdown').val();
        var searchDate = $('#searchDate').val();
        const selectedItemName = $('#itemNameDropdown').val()?.toLowerCase();
        var totalFilteredCount = 0;
        var totalQuantitySold = 0;
        filteredRows = [];

        // Hide all rows initially
        $('tbody .sale-row').hide();

        // Filter rows based on search criteria
        $('tbody .sale-row').filter(function () {
            var itemName = $(this).data('saleitemname') ? $(this).data('saleitemname').toLowerCase() : '';
            var saleMonth = $(this).data('month') ? $(this).data('month').toString() : '';
            const saleDate = $(this).data('saledate');
            var quantitySold = parseInt($(this).find('td:nth-child(2)').text()) || 0;

            var isVisible = false;

            if (searchOption === 'All') {
                isVisible = (itemName.includes(keyword) || saleMonth === keyword) && (selectedItemName ? itemName === selectedItemName : true);
            } else if (searchOption === 'ItemName') {
                isVisible = itemName.includes(keyword) && (selectedItemName ? itemName === selectedItemName : true);
            } else if (searchOption === 'Month') {
                isVisible = saleMonth === month;
            } else if (searchOption === 'Date') {
                isVisible = saleDate === searchDate;
            }

            if (isVisible) {
                filteredRows.push(this);
                totalFilteredCount++;
                totalQuantitySold += quantitySold;
                $(this).show();
            }

            return isVisible;
        }).show();

        // Update total items sold and total quantity sold dynamically
        $('#totalSoldCount').text(totalFilteredCount);
        $('#totalQuantitySold').text(totalQuantitySold);

        // Show or hide total items sold alert
        if (totalFilteredCount > 0) {
            $('#totalItemsSold').show();
            $('#noItemsMessage').hide();
        } else {
            $('#totalItemsSold').hide();
            $('#noItemsMessage').show();
        }
        // Show or hide total items sold and quantity alerts
        if (totalFilteredCount > 0) {
            $('#totalItemsSold').show();
            $('#noItemsMessage').hide(); // Hide "No items sold" message
        } else {
            $('#totalItemsSold').hide();
            $('#noItemsMessage').show(); // Show "No items sold" message
        }
        showPage(1);
    });

    // Reset Button Click
    $('#resetButton').click(function () {
        $('tbody .sale-row').show();
        $('#searchOption').val('Search By');
        $('#searchKeyword').val('');
        $('#monthDropdown').val('');
        $('#monthDropdownContainer').hide();
        $('#textInputContainer').show();
        $('#datePickerContainer').hide(); 
        $('#itemNameContainer').hide(); 

        // Reset total count display
        $('#totalSoldCount').text(0);
        $('#totalItemsSold').hide();
        $('#noItemsMessage').hide();
        filteredRows = allRows.slice(); // Show all rows and reset filteredRows
    });

    // previous button click
    $('#prevPage').click(function () {
        if (currentPage > 1) {
            showPage(currentPage - 1);
        }
    });

    // next button click
    $('#nextPage').click(function () {
        if (currentPage * rowsPerPage < filteredRows.length) {
            showPage(currentPage + 1);
        }
    });

    // Initialize page with all rows and pagination
    function initializeRows() {
        allRows = $('tbody .sale-row').toArray();
        filteredRows = allRows.slice();
        showPage(1);
        $('#paginationControls').show();
    }
    initializeRows();
});


//User to calculate the price and discount
$(document).ready(function () {
    var salePrice = 0;
    var quantitySold = 1;
    var currency = $('#currency').val();
    var unit = $('#unit').val(); 

    // Update sale price when a sweet item is selected
    $('#sweetItemId').change(function () {
        var selectedOption = $(this).find('option:selected');
        salePrice = parseFloat(selectedOption.data('saleprice')) || 0;
        $('#salePrice').val(salePrice.toFixed(2));
        updateFinalPrice();
    });

    $('#salePrice').keyup(function () {
        salePrice = parseFloat($(this).val()) || 0;
        updateFinalPrice();
    });

    $('#discount').keyup(function () {
        updateFinalPrice();
    });

    // Update quantity sold when the input changes
    $('#quantitySold').keyup(function () {
        quantitySold = parseFloat($(this).val()) || 1; // Default to 1 if input is invalid
        updateFinalPrice();
    });

    // Update currency when it changes
    $('#currency').change(function () {
        currency = $(this).val();
        updateFinalPrice();
    });

    // Update unit selection
    $('#unit').change(function () {
        unit = $(this).val();
        updateFinalPrice();
    });

    // Calculate and update the final price
    function updateFinalPrice() {
        var discountPercentage = parseFloat($('#discount').val()) || 0;
        var totalPrice = salePrice * quantitySold;
        var convertedPrice = totalPrice;
        // Adjust price for unit
        if (unit === 'Gram')
        {
            convertedPrice = totalPrice / 1000;
        }
        var finalPrice = convertedPrice;

        if (discountPercentage > 0) {
            finalPrice = finalPrice - (finalPrice * discountPercentage / 100);
        }

        $('#finalPrice').val(finalPrice.toFixed(2));
        $('#currencyLabel1').text(currency); 
    }
    updateFinalPrice();
});


