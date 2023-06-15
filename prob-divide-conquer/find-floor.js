/**
 * Write a function called findFloor which accepts a sorted array and a value x,
 * and returns the floor of x in the array. The floor of x in an array is the 
 * largest element in the array which is smaller than or equal to x. If the floor
 * does not exist, return -1.
 * 
 * Constraints
 * Time Complexity: O(log N)
 */

function findFloor(sortedArr, x) {
    let [left, right] = [0, sortedArr.length - 1];

    let floor = -1;
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (sortedArr[middle] <= x) {
            floor = (floor <= sortedArr[middle]) ? sortedArr[middle] : floor;
            left = middle + 1;
        } else if (sortedArr[middle] > x) {
            right = middle - 1;
        }
    }

    return floor;
}

module.exports = findFloor