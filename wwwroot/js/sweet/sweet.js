// Real-time calculation of the final cost pirce unit * quantity
$(document).ready(function () {
    $("#quantity").on("input", calculateFinalCost);
    $("#unit").on("change", calculateFinalCost);
    function calculateFinalCost() {
        const pricePerKg = parseFloat($("#price").val()) || 0;
        const quantity = parseFloat($("#quantity").val()) || 0;
        const unit = $("#unit").val();

        let finalQuantity = quantity;
        if (unit === "Gram") {
            finalQuantity = quantity / 1000;
        }
        else if (unit === "ml") {
            finalQuantity = quantity * 0.001;
        }

        const finalCost = (finalQuantity * pricePerKg).toFixed(2);
        $("#finalCost").val(finalCost); // Update the Final Cost field
    }

    // Trigger validation on submit
    $("form").submit(function (e) {
        var isValid = true;
        if (!isValid) {
            e.preventDefault();
        }
    });
});


