/**
 * Given an array of integers, and a number, find the number of pairs of
 * integers in the array whose sum is equal to the second parameter.
 * 
 * You can assume that there will be no duplicate values in the array.
 */
function countPairs(nums, targetSum) {
    // O(N log N) time and O(1) space
    // return countPairsNlogN(nums, targetSum);

    // O(N) time and O(N) space
    return countPairN(nums, targetSum);
}

function countPairN(nums, targetSum) {
    const numSet = new Set(nums);
    let sumCount = 0;
    for (const n of nums) {
        numSet.delete(n);
        if (numSet.has(targetSum - n)) {
            sumCount++;
        }
    }

    return sumCount;
}

function countPairsNlogN(nums, targetSum) {
    if (nums.length === 0) {
        return 0;
    }
    nums.sort((a, b) => (a - b)); // get number order not str order

    let sumCount = 0;
    let [start, end] = [0, nums.length - 1];
    
    while (start < end) {
        const sum = nums[start] + nums[end];
        if (sum == targetSum) {
            sumCount++;
            // no duplicates so inc/dec both
            start++;
            end--;
        } else if (sum < targetSum) {
            start++;
        } else {
            end--;
        }
    }
    return sumCount;
}

module.exports = countPairs;