window.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById("calc-form");
  if (form) {
    setupIntialValues();
    form.addEventListener("submit", function(e) {
      e.preventDefault();
      update();
    });
  }
});

function getCurrentUIValues() {
  return {
    amount: +(document.getElementById("loan-amount").value),
    years: +(document.getElementById("loan-years").value),
    rate: +(document.getElementById("loan-rate").value),
  }
}

// Get the inputs from the DOM.
// Put some default values in the inputs
// Call a function to calculate the current monthly payment
function setupIntialValues() {
  document.getElementById("loan-amount").value = 10000;
  document.getElementById("loan-years").value = 5;
  document.getElementById("loan-rate").value = 0.10;
}

// Get the current values from the UI
// Update the monthly payment
function update() {
  try {
    updateMonthly(calculateMonthlyPayment(getCurrentUIValues()));
  } catch (err) {
    alert(err.message);
  }
}

// Given an object of values (a value has amount, years and rate ),
// calculate the monthly payment.  The output should be a string
// that always has 2 decimal places.
function calculateMonthlyPayment(values) {
  const i = values.rate / 12; 
  let monthly;

  // if (values.amount <= 0) {
  //   throw Error('Loan Amount should be greater than 0');
  // }

  if (values.years <= 0) {
    throw Error('Term in Years should be greater than 0');
  }

  if (i == 0) {
    monthly = values.amount / (values.years * 12);
  } else {
    const negN = values.years * -12;
    // monthly = (p * i) / (1 - (1 + i)**-n)
    monthly = (values.amount * i) / (1 - (1 + i)**negN)
  }
  return monthly.toFixed(2).toString();
}

// Given a string representing the monthly payment value,
// update the UI to show the value.
function updateMonthly(monthly) {
  document.getElementById("monthly-payment").innerText = monthly;
}
