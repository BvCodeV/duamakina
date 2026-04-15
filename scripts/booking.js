const dayNum = document.getElementById("dayNum");
const pricePerDay = document.getElementById("pricePerDay").textContent;
const totalPrice = document.querySelectorAll(".total-price");
function finalPriceFunction() {
  const days = localStorage.getItem("daysCalc")
  dayNum.textContent = days;
  let finalPrice = days * pricePerDay;
  totalPrice.forEach(price => {
    price.textContent = finalPrice;
  })
  return finalPrice;
};
finalPriceFunction();