const calc = require('./calc');

describe('Calculation tests', () => {

    let numsOdd;
    let numsEven;
    beforeEach(() => {
        numsOdd = [3, 2, 1];
        numsEven = [1, 3, 2, 3, 1, 4];
    })

    test('mean test', () => {
        expect(calc.mean(numsOdd)).toEqual(2);
        expect(calc.mean(numsEven)).toEqual(expect.closeTo(2.33333, 5));
    });

    test('median test', () => {
        expect(calc.median(numsOdd)).toEqual(2);
        expect(calc.median(numsEven)).toEqual(2.5);
    });

    test('mode test', () => {
        expect(calc.mode(numsOdd)).toEqual(3);
        expect(calc.mode(numsEven)).toEqual(1);
    });
});
