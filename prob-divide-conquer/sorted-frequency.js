/**
 * Given a sorted array and a number, write a function called sortedFrequency 
 * that counts the occurrences of the number in the array.
 * 
 * Constraints:
 * Time Complexity: O(log N)
 */
function sortedFrequency(sortedArr, num) {
    let [left, right] = [0, sortedArr.length - 1];

    let startIdx = -1;
    // find start
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (sortedArr[middle] === num) {
            startIdx = middle;
            right = middle - 1;
        } else if (sortedArr[middle] < num) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    // if no start, the num isn't here
    if (startIdx === -1) {
        return -1;
    }

    // find end
    [left, right] = [0, sortedArr.length - 1];
    let endIdx = -1;
    while (left <= right) {
        const middle = Math.floor((left + right) / 2);
        if (sortedArr[middle] === num) {
            endIdx = middle;
            left = middle + 1;
        } else if (sortedArr[middle] < num) {
            left = middle + 1;
        } else {
            right = middle - 1;
        }
    }

    return (endIdx - startIdx) + 1;
}

module.exports = sortedFrequency