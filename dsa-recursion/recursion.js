/** product: calculate the product of an array of numbers. */

function product(nums, idx = 0) {
  if (idx >= nums.length) {
    return 1; // this fails if the nums array is length 0
  }

  return nums[idx] * product(nums, idx + 1);
}

/** longest: return the length of the longest word in an array of words. */

function longest(words, idx = 0) {
  if (idx >= words.length) {
    return 0;
  }

  const thisLength = words[idx].length;
  const futureLength = longest(words, idx + 1);
  return (thisLength > futureLength) ? thisLength : futureLength;
}

/** everyOther: return a string with every other letter. */

function everyOther(str, idx = 0) {
  if (idx >= str.length) {
    return "";
  }

  if (idx % 2 != 0) {
    return everyOther(str, idx + 1);
  }

  return str.charAt(idx) + everyOther(str, idx + 1);
}

/** isPalindrome: checks whether a string is a palindrome or not. */

function isPalindrome(str, left = 0, right = (str.length - 1)) {
  if (left >= right) {
    return true;
  } else if (str.charAt(left) != str.charAt(right)) {
    return false;
  }

  return true && isPalindrome(str, left + 1, right - 1);
}

/** findIndex: return the index of val in arr (or -1 if val is not present). */

function findIndex(arr, val, idx = 0) {
  if (idx >= arr.length) {
    return -1;
  } else if (arr[idx] == val) {
    return idx;
  }
  return findIndex(arr, val, idx + 1);
}

/** revString: return a copy of a string, but in reverse. */

function revString(str, idx = 0) {
  if (idx >= str.length) {
    return "";
  }
  return revString(str, idx + 1) + str.charAt(idx);
}

/** gatherStrings: given an object, return an array of all of the string values. */

function gatherStrings(obj) {
  const strArr = [];
  for (field of Object.keys(obj)) {
    const fieldVal = obj[field];
    if (typeof fieldVal == "string") {
      strArr.push(fieldVal);
    } else if(fieldVal instanceof Object) {
      const subStrings = gatherStrings(fieldVal);
      for (str of subStrings) {
        strArr.push(str);
      }
    }
  }
  return strArr;
}

/** binarySearch: given a sorted array of numbers, and a value,
 * return the index of that value (or -1 if val is not present). */

function binarySearch(arr, val, left = 0, right = arr.length) {
  if (left > right) {
    return -1;
  }

  const middle = Math.floor((left + right) / 2);
  const midVal = arr[middle];
  if (midVal == val) {
    return middle;
  } else if (val < midVal) {
    return binarySearch(arr, val, left, middle - 1);
  } else {
    return binarySearch(arr, val, middle + 1, right);
  }
}

module.exports = {
  product,
  longest,
  everyOther,
  isPalindrome,
  findIndex,
  revString,
  gatherStrings,
  binarySearch
};
