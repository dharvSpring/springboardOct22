function createInputs(amount, years, rate) {
  return {
    amount: amount,
    years: years,
    rate: rate,
  }
}

// answer validation from: https://www.calculator.net/payment-calculator.html
it('should calculate the monthly rate correctly', function () {
  expect(calculateMonthlyPayment(createInputs(10000, 5, 0.1))).toEqual("212.47");
  expect(calculateMonthlyPayment(createInputs(100000, 30, 0.05))).toEqual("536.82");
});

it('should calculate the monthly rate correctly with zeros', function () {
  expect(calculateMonthlyPayment(createInputs(0, 5, 0.1))).toEqual("0.00");
  expect(calculateMonthlyPayment(createInputs(5000, 5, 0))).toEqual("83.33");

  // Should throw an Error
  expect(() => calculateMonthlyPayment(createInputs(10000, 0, 0.1))).toThrowError();
  expect(() => calculateMonthlyPayment(createInputs(0, 0, 0))).toThrowError();
});


function checkDecimal(input) {
  const decPos = input.indexOf('.');
  if (decPos >= 0) {
    return (input.length - decPos) == 3;
  }
  return false;
}

it("should return a result with 2 decimal places", function() {
  expect(checkDecimal(calculateMonthlyPayment(createInputs(10000, 5, 0.1)))).toEqual(true);
  expect(checkDecimal(calculateMonthlyPayment(createInputs(1000000, 30, 0.06)))).toEqual(true);
  expect(checkDecimal(calculateMonthlyPayment(createInputs(0, 5, 0.1)))).toEqual(true);
});

/// etc
