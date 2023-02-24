const ExpressError = require('./expressError');

//
// Utilities
//

function parseNums(query) {
    if (query.nums == null || query.nums.length == 0) {
        throw new ExpressError(`nums are required`, 400);
    }

    return Array.from(query.nums.split(',')).map((val) => {
        parsed = Number.parseFloat(val);
        if (Number.isNaN(parsed)) {
            throw new ExpressError(`${val} is not a number!`, 400);
        }
        return parsed;
    });
}


module.exports = {
    parseNums,
};