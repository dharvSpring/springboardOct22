describe("Helpers test (with setup and tear-down)", function() {

    let newTr;

    beforeEach(function () {
      // initialization logic
      newTr = document.createElement('tr');
      newTr.id = 'deleteMe';
      paymentTbody.appendChild(newTr);
    });
  
    //
    // sumPaymentTotal
    //
    function createPayment(billAmt, tipAmt) {
      return {
        billAmt: billAmt,
        tipAmt: tipAmt,
        tipPercent: calculateTipPercent(billAmt, tipAmt),
      }
    }

    function checkTotal(billTotal, tipTotal, tipPer) {
      expect(sumPaymentTotal('billAmt')).toEqual(billTotal);
      expect(sumPaymentTotal('tipAmt')).toEqual(tipTotal);
      expect(sumPaymentTotal('tipPercent')).toEqual(tipPer);
    }

    it('should calculate sumPayments', function () {
      checkTotal(0, 0, 0);

      allPayments.payment1 = createPayment(100, 15);
      checkTotal(100, 15, 15);

      allPayments.payment2 = createPayment(200, 30);
      checkTotal(300, 45, 30);

      allPayments.payment3 = createPayment(66.67, 13.33);
      checkTotal(366.67, 58.33, 50);
    });

    it('should calculate sumPayments with zeros', function () {
      allPayments.payment1 = createPayment(100, 0);
      checkTotal(100, 0, 0);

      // these should probably throw errors
      allPayments.payment1 = createPayment(0, 0);
      checkTotal(0, 0, NaN);
      
      allPayments.payment1 = createPayment(0, 1);
      checkTotal(0, 1, Infinity);
    });

    it('should calculate sumPayments with negatives', function () {
      // these should probably throw errors
      allPayments.payment1 = createPayment(-100, 15);
      checkTotal(-100, 15, -15);

      allPayments.payment1 = createPayment(100, -15);
      checkTotal(100, -15, -15);
    });

    //
    // calculateTipPercent
    //
    it('calculate tip percentage should be correct', function () {
      expect(calculateTipPercent(100, 15)).toEqual(15);
      expect(calculateTipPercent(150, 30)).toEqual(20);
      expect(calculateTipPercent(66.67, 30.50)).toEqual(46);
      expect(calculateTipPercent(100, 0)).toEqual(0);

      
    });

    it('calculate tip percentage with zeros', function () {
      // these should probably throw errors instead of returning NaN or Infinity
      expect(calculateTipPercent(0, 0)).toEqual(NaN);
      expect(calculateTipPercent(0, 1)).toEqual(Infinity);
    });

    //
    // appendTd
    //
    it('TD appended to DOM', function () {
      appendTd(newTr, 'Hello World');
      expect(newTr.childElementCount).toEqual(1);

      appendTd(newTr, 'Hola Mundo');
      appendTd(newTr, 'Bonjour le Monde');
      expect(newTr.childElementCount).toEqual(3);
    });

    it('TD appended to DOM with Empty String', function () {
      appendTd(newTr, '');
      expect(newTr.childElementCount).toEqual(1);

      // these should probably throw errors
      appendTd(newTr, null);
      appendTd(newTr);
      expect(newTr.childElementCount).toEqual(3);
    });
    
    //
    // appendDeleteBtn
    //
    it('Simple Append Delete btn', function () {
      appendDeleteBtn(newTr);
      expect(newTr.childElementCount).toEqual(1);
      expect(document.querySelectorAll('.deleteBtn').length).toEqual(1);
    });

    it('append delete with others', function () {
      appendTd(newTr, '100');
      appendTd(newTr, '15');
      appendTd(newTr, '15');
      expect(newTr.childElementCount).toEqual(3);

      appendDeleteBtn(newTr);
      expect(newTr.childElementCount).toEqual(4);
      expect(document.querySelectorAll('.deleteBtn').length).toEqual(1);
    })
    
  
    afterEach(function() {
      // teardown logic
      newTr.remove();

      allPayments = {};
      paymentId = 0;
    });
  });
  