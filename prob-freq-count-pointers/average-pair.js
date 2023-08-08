/**
 * Given a sorted array of integers and a target average, determine if there is
 * a pair of values in the array where the average of the pair equals the target
 * average.
 * 
 * There may be more than one pair that matches the average target.
 */
function averagePair(sorted, targetAvg) {
    let start = 0;
    let end = sorted.length - 1;

    while (start < end) {
        const avg = (sorted[start] + sorted[end]) / 2;
        if (avg == targetAvg) {
            return true;
        } else if (avg > targetAvg) {
            end--;
        } else {
            start++;
        }
    }

    return false;
}

module.exports = averagePair;