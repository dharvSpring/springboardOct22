/**
 * Write a function called separatePositive which accepts an array of non-zero integers.
 * Separate the positive integers to the left and the negative integers to the right.
 * The positive numbers and negative numbers need not be in sorted order.
 * 
 * The problem should be done in place (in other words, do not build a copy of the input array)
 */
function separatePositive(nums) {
    let start = 0;
    let end = nums.length - 1;

    while (start < end) {
        if (nums[start] < 0 && nums[end] > 0) {
            // swap!
            const tmp = nums[start];
            nums[start] = nums[end];
            nums[end] = tmp;

            start++;
            end--;
        } else {
            if (nums[start] > 0) {
                start++;
            } else {
                end--;
            }
        }
    }
    
    return nums;
}

module.exports = separatePositive;