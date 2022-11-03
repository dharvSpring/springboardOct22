describe("Payments test (with setup and tear-down)", function() {
    beforeEach(function () {
      // initialization logic
      
    });

    //
    // appendPaymentTable
    //
    it('appendPaymentTable should append and update DOM', function() {
      let payment = {
        billAmt: '100',
        tipAmt: '15',
        tipPercent: 15,
      }

      appendPaymentTable(payment);
      expect(paymentTbody.childElementCount).toEqual(1);

      const paymentTDs = paymentTbody.querySelectorAll('tr > td');
      expect(paymentTDs.length).toEqual(3);
      expect(paymentTDs[0].innerText).toEqual('$' + payment.billAmt);
      expect(paymentTDs[1].innerText).toEqual('$' + payment.tipAmt);
      expect(paymentTDs[2].innerText).toEqual(payment.tipPercent + '%');

      payment = {
        billAmt: '200',
        tipAmt: '30',
        tipPercent: 15,
      }
      appendPaymentTable(payment);
      payment = {
        billAmt: '66.67',
        tipAmt: '13.33',
        tipPercent: 20,
      }
      appendPaymentTable(payment);
      payment = {
        billAmt: '10',
        tipAmt: '5',
        tipPercent: 50,
      }
      appendPaymentTable(payment);

      expect(paymentTbody.childElementCount).toEqual(4);
    });
    
    //
    // createCurPayment
    //
    it('createCurPayment should return payment from valid inputs', function() {
      billAmtInput.value = 100;
      tipAmtInput.value = 15;

      let correctResult = {
        billAmt: '100',
        tipAmt: '15',
        tipPercent: 15,
      }
      expect(createCurPayment()).toEqual(correctResult);

      billAmtInput.value = 66.67;
      tipAmtInput.value = 13.33;

      correctResult = {
        billAmt: '66.67',
        tipAmt: '13.33',
        tipPercent: 20,
      }
      expect(createCurPayment()).toEqual(correctResult);
    })

    it('createCurPayment should return undefined from invalid inputs', function() {
      billAmtInput.value = -10;
      tipAmtInput.value = 15;
      expect(createCurPayment()).toEqual(undefined);

      billAmtInput.value = '';
      tipAmtInput.value = 15;
      expect(createCurPayment()).toEqual(undefined);

      billAmtInput.value = 100;
      tipAmtInput.value = -1;
      expect(createCurPayment()).toEqual(undefined);

      billAmtInput.value = 100;
      tipAmtInput.value = '';
      expect(createCurPayment()).toEqual(undefined);

      billAmtInput.value = 'bill';
      tipAmtInput.value = 15;
      expect(createCurPayment()).toEqual(undefined);

      billAmtInput.value = 100;
      tipAmtInput.value = 'tip';
      expect(createCurPayment()).toEqual(undefined);
    })
    
    //
    // submitPaymentInfo
    //
    it('should add new payment to allPayments', function() {
      billAmtInput.value = 100;
      tipAmtInput.value = 15;

      const correctResult = {
        billAmt: '100',
        tipAmt: '15',
        tipPercent: 15,
      }

      submitPaymentInfo();
      expect(Object.keys(allPayments).length).toEqual(1);
      expect(allPayments.payment1).toEqual(correctResult);

      billAmtInput.value = 200;
      tipAmtInput.value = 30;
      submitPaymentInfo();
      expect(Object.keys(allPayments).length).toEqual(2);

      billAmtInput.value = 66.67;
      tipAmtInput.value = 13.33;
      submitPaymentInfo();
      expect(Object.keys(allPayments).length).toEqual(3);
    })

    it('should add not add invalid payment to allPayments', function() {
      billAmtInput.value = -1;
      tipAmtInput.value = '';

      submitPaymentInfo();
      expect(Object.keys(allPayments).length).toEqual(0);
    })

    //
    // updateSummary
    //
    function checkSummary(billTotal, tipTotal, tipAvg) {
      expect(summaryTds[0].innerText).toEqual('$' + billTotal);
      expect(summaryTds[1].innerText).toEqual('$' + tipTotal);
      expect(summaryTds[2].innerText).toEqual(tipAvg + '%');
    }

    
    it('summary should be correct as values are added', function() {
      updateSummary();
      checkSummary(0, 0, 0);

      billAmtInput.value = 100;
      tipAmtInput.value = 15;
      allPayments.payment1 = createCurPayment();
      updateSummary();
      checkSummary(100, 15, 15);

      billAmtInput.value = 200;
      tipAmtInput.value = 30;
      allPayments.payment2 = createCurPayment();
      updateSummary();
      checkSummary(300, 45, 15);

      billAmtInput.value = 66.67;
      tipAmtInput.value = 13.33;
      allPayments.payment3 = createCurPayment();
      updateSummary();
      checkSummary(366.67, 58.33, 17);
    });

    afterEach(function() {
      // teardown logic
      billAmtInput.value = '';
      tipAmtInput.value = '';

      paymentTbody.innerHTML = '';

      allPayments = {};
      paymentId = 0;

      updateSummary();
    });
  });
  