const {parseNums} = require('./utilities');
const ExpressError = require('./expressError');

describe('Validation tests', () => {

    test('simple validation', () => {
        const query = {
            nums: '1,2,3'
        };

        expect(parseNums(query)).toEqual([1, 2, 3]);
    });
    
    test('error on empty nums', () => {
        const emptyQuery = {
            nums: '',
        };

        function emptyErr() {
            parseNums(emptyQuery);
        }

        expect(emptyErr).toThrow(ExpressError);
    });

    test('error on non numbers', () => {
        const invalidQuery = {
            nums: 'foo,2,3,4',
        };

        function invalidErr() {
            parseNums(invalidQuery);
        }

        expect(invalidErr).toThrow(ExpressError);
    });
});