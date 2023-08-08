/**
 * Write a function called isSubsequence which takes in two strings and checks
 * whether the characters in the first string form a subsequence of the characters
 * in the second string. In other words, the function should check whether the
 * characters in the first string appear somewhere in the second string,
 * without their order changing.
 */
function isSubsequence(seq, str) {
    let seqIdx = 0
    let strIdx = 0;
    if (seq.length === 0) {
        return true;
    }

    while (strIdx < str.length) {
        // do str and seq match?
        if (str[strIdx] == seq[seqIdx]) {
            seqIdx++;
        }
        // have we completed the seq?
        if (seqIdx >= seq.length) {
            return true;
        }
        strIdx++;
    }
    
    return false;
}

module.exports = isSubsequence;