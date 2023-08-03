function selectionSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        let lowIdx = i;
        for (let j = i; j < arr.length; j++) {
            if (arr[lowIdx] > arr[j]) {
                lowIdx = j;
            }
        }
        if (lowIdx != i) {
            const temp = arr[i];
            arr[i] = arr[lowIdx];
            arr[lowIdx] = temp;
        }
    }
    return arr;
}

module.exports = selectionSort;