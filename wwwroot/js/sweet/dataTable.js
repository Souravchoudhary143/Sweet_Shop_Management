﻿///*@* Below code is used to add new quantity in the existing record * @*/
$(document).ready(function () {
    // Open modal when "show-" button is clicked
    $('[id^="show-"]').on('click', function () {
        var itemId = $(this).data('item-id');
        $('#addQuantityModal-' + itemId).modal('show');
    });

    $('[id^="quantityToAdd-"]').on('input', function () {
        var itemId = $(this).attr('id').split('-')[1];
        var currentQuantity = parseFloat($('#currentQuantity-' + itemId).val()) || 0;
        var quantityToAdd = parseFloat($(this).val()) || 0;
        var newQuantity = currentQuantity + quantityToAdd;
        $('#newQuantity-' + itemId).val(newQuantity.toFixed(2));
    });

    $('[data-dismiss="modal"]').on('click', function () {
        var modalId = $(this).closest('.modal').attr('id');
        $('#' + modalId).modal('hide');
    });
});


 //this is for adding datatable
 $(document).ready(function () {
   $('#tblData').DataTable();
 });