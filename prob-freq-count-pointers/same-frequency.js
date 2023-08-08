/**
 * Given two positive integers, find out if the two numbers have the same frequency of digits.
 */
function sameFrequency(int1, int2) {
    const digitFreq = (strNum) => {
        const digitMap = new Map();
        for (const d of strNum) {
            digitMap.set(d, digitMap.has(d) ? digitMap.get(d) + 1 : 1);
        }
        return digitMap;
    }

    const strNum1 = "" + int1;
    const strNum2 = "" + int2;
    if (strNum1.length !== strNum2.length) {
        return false;
    }

    const digits1 = digitFreq(strNum1);
    const digits2 = digitFreq(strNum2);

    for (const [key, value] of digits1.entries()) {
        if (!(digits2.has(key) && digits2.get(key) == value)) {
            return false;
        }
    }

    return true;
}

module.exports = sameFrequency;