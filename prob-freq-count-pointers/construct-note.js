// add whatever parameters you deem necessary
function constructNote(message, letters) {
    const letterMap = new Map();
    for (const c of letters) {
        letterMap.set(c, letterMap.has(c) ? letterMap.get(c) + 1 : 1);
    }

    for (const c of message) {
        if (letterMap.has(c) && letterMap.get(c) > 0) {
            letterMap.set(c, letterMap.get(c) - 1);
        } else {
            return false;
        }
    }
    return true;
}

module.exports = constructNote;