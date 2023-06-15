/**
 * Write a function called findRotationCount which accepts an array of distinct
 * numbers sorted in increasing order. The array has been rotated 
 * counter-clockwise n number of times. Given such an array, find the value of n.
 * 
 * Constraints:
 * Time Complexity: O(log N)
 */
function findRotationCount(rotatedArr, left = 0, right = rotatedArr.length - 1) {
    if (left >= right) {
        return 0;
    } else if (left === right) {
        return left;
    }

    const middle = Math.floor((left + right) / 2);
    // look to left and right of midpoint for minimum
    if (middle > left && rotatedArr[middle] < rotatedArr[middle - 1]) {
        return middle;
    } else if (middle < right && rotatedArr[middle + 1] < rotatedArr[middle]) {
        return middle + 1;
    }

    // recurse left or right?
    if(rotatedArr[middle] < rotatedArr[right]) {
        return findRotationCount(rotatedArr, left, middle - 1)
    } else {
        return findRotationCount(rotatedArr, middle + 1, right);
    }

}

module.exports = findRotationCount