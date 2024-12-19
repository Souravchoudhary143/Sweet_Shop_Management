// Real-time calculation of the final cost pirce unit * quantity
document.getElementById("quantity").addEventListener("input", calculateFinalCost);
document.getElementById("unit").addEventListener("change", calculateFinalCost);

function calculateFinalCost() {
    const pricePerKg = parseFloat(document.getElementById("price").value) || 0;
    const quantity = parseFloat(document.getElementById("quantity").value) || 0;
    const unit = document.getElementById("unit").value;

    let finalQuantity = quantity;
    if (unit === "Gram") {
        finalQuantity = quantity / 1000; // Convert grams to kilograms
    }
    else if (unit === "ml") {
        finalQuantity = quantity * 0.001; //convert ml to liter
    }
    const finalCost = (finalQuantity * pricePerKg).toFixed(2);
    document.getElementById("finalCost").value = finalCost;
}

