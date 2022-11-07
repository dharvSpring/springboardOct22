//
// foreach, map, filter
//
function myForEach(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i], i, arr);
    }
}

myForEach([1,2,3], function(value, idx, arr) {
    console.log(`index: ${idx}`);
    console.log(value ** 2);
})


function myMap(arr, callback) {
    let retArr = new Array(arr.length);
    for (let i = 0; i < arr.length; i++) {
        retArr[i] = callback(arr[i], i, arr);
    }
    return retArr;
}

const nums = [1, 2, 3, 4, 5];
console.log(myMap(nums, function(n, i) {
    return n ** i;
}))


function myFilter(arr, callback) {
    let filteredArray = [];
    for (let i = 0; i < arr.length; i++) {
        if (callback(arr[i], i, arr)) {
            filteredArray.push(arr[i]);
        }
    }
    return filteredArray;
}

console.log(myFilter(nums, function(n, i) {
    return n < i;
}))

console.log(myFilter(nums, function(n, i) {
    return n < 3;
}))

console.log(myFilter(nums, function(n, i) {
    return n > 3;
}))

//
// some, every
//
function mySome(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        if(callback(arr[i], i, arr)) {
            return true;
        }
    }
    return false;
}

console.log("Any evens " + mySome(nums, function (n,i) {
    return n % 2 == 0;
}));

console.log("Any value smaller than index " + mySome(nums, function (n,i) {
    return n < i;
}));

console.log("Any string " + mySome(nums, function (n) {
    return typeof n === 'string';
}));

function myEvery(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        if(!callback(arr[i], i, arr)) {
            return false;
        }
    }
    return true;
}

console.log(myEvery(nums, function (n,i) {
    return n % 2 === 0;
}));

console.log(myEvery(nums, function (n,i) {
    return n > i;
}));

console.log(myEvery(nums, function (n) {
    return typeof n === 'number';
}));