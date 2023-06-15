/**
 * Given an array of 1s and 0s which has all 1s first followed by all 0s, write a function called countZeroes, which returns the number of zeroes in the array.
 * 
 * Constraints:
 * Time Complexity: O(log N)
 */
function countZeroes(arr) {
    let [left, right] = [0, arr.length - 1];

    // no 0s
    if (arr[arr.length - 1] === 1) {
        return 0;
    }

    // binary search for crossover point
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (arr[middle] === 1 && arr[middle + 1] === 0) {
            return arr.length - (middle + 1);
        } else if (arr[middle] === 1) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    // all 0s
    return arr.length;
}

module.exports = countZeroes