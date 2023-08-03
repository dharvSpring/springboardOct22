function insertionSort(arr) {
    if (arr.length < 2) {
        return arr;
    }

    for (let i = 1; i < arr.length; i++) {
        let curVal = arr[i];

        let j; // j needs to stick around
        for (j = i - 1; (j >= 0 && arr[j] > curVal); j--) {
            arr[j + 1] = arr[j];
        }

        arr[j + 1] = curVal;
    }

    return arr;
}

module.exports = insertionSort;