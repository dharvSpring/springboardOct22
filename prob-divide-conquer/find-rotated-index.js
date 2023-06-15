/**
 * Write a function called findRotatedIndex which accepts a rotated array of 
 * sorted numbers and an integer. The function should return the index of num 
 * in the array. If the value is not found, return -1.
 * 
 * Constraints:
 * Time Complexity: O(log N)
 */
function findRotatedIndex(rotatedArr, num) {
    const pivot = findPivot(rotatedArr);
    // is num in the first or second half of the rotated array?
    if (pivot > 0 && num >= rotatedArr[0] && num <= rotatedArr[pivot - 1]) {
        return binarySearch(rotatedArr, num, 0, pivot - 1);
    } else {
        return binarySearch(rotatedArr, num, pivot, rotatedArr.length - 1);
    }
}

/** find num in a sorted array */
function binarySearch(arr, num, left, right) {
    if (arr.length === 0
        || (num < arr[left] || num > arr[right])) {
        return -1;
    }

    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (arr[middle] === num) {
            return middle;
        } else if (num < arr[middle]) {
            right = middle - 1;
        } else {
            left = middle + 1;
        }
    }
    // not found
    return -1;
}

/** find the idx of the rotation */
function findPivot(arr) {
    if (arr.length === 1 || arr[0] < arr[arr.length - 1]) {
        return 0;
    }

    let [left, right] = [0, arr.length - 1];
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (arr[middle] > arr[middle + 1]) {
            return middle + 1;
        } else if (arr[left] <= arr[middle]) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }
}


module.exports = findRotatedIndex