//
// Calculation Functions
//

function mean(nums) {
    const sum = nums.reduce((sum, n) => (sum + n), 0);
    return (sum / nums.length);
}


function median(nums) {
    const sorted = nums.sort();
    const midPoint = Math.floor(sorted.length / 2);
    if (sorted.length % 2 == 0) {
        const medLow = sorted[midPoint - 1];
        const medHigh = sorted[midPoint];
        return (medLow + medHigh) / 2;
    } else {
        return sorted[midPoint];
    }
}


function mode(nums) {
    const numCounts = new Map();
    for (n of nums) {
        numCounts.set(n, numCounts.has(n) ? numCounts.get(n) + 1 : 1);
    }
    
    modeEntry = Array.from(numCounts.entries()).reduce((mostEntry, curEntry) => {
        // take the first mode if there are multiple
        return mostEntry[1] < curEntry[1] ? curEntry : mostEntry;
    }, [0,0]);

    return modeEntry[0];
}


module.exports = {
    mean,
    median,
    mode,
};