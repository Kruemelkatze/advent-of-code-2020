const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "9-input-test.txt" : "9-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const preamble = TEST ? 5 : 25;
const numbers = inputStr.split("\n").map(s => +s);

var sumBucket = new Set();
var sumDict = {};
var buckets = [];
for (let p = 0; p < preamble - 1; p++) {
    let pset = new Set();
    buckets[p] = pset;

    for (let pb = p + 1; pb < preamble; pb++) {
        let sum = numbers[p] + numbers[pb];
        pset.add(sum);
        sumDict[sum] = (sumDict[sum] || 0) + 1;
    }
}

var bucketIterator = 0;
var firstInvalid = null;
// fill bucket from preamble
for (let i = preamble; i < numbers.length; i++) {
    let n = numbers[i];
    let valid = sumDict[n];

    if (!valid) {
        firstInvalid = { i, n };
        break;
    }

    let changeSet = buckets[bucketIterator];
    bucketIterator = (bucketIterator + 1) % buckets.length;

    for (let e of changeSet) {
        if (sumDict[e] === 1) {
            delete sumDict[e];
        }
    }
    changeSet.clear();

    for (let j = i - preamble - 1; j < i; j++) {
        let sum = n + numbers[j];
        changeSet.add(sum);
        sumDict[sum] = (sumDict[sum] || 0) + 1;
    }
}

// PART 2
var combination = null;
var combinationSum = null;
if (firstInvalid) {
    combination = findSum(firstInvalid.n, 0, 0, firstInvalid.i);

    let min = Number.MAX_VALUE, max = Number.MIN_VALUE;
    for (let n of combination) {
        min = n < min ? n : min;
        max = n > max ? n : max;
    }

    combinationSum = min + max;
}


function findSum(target, initial, start, end) {
    for (let i = start; i < end; i++) {
        let v = numbers[i];
        if (initial + v < target) {
            let childResult = findSum(target, initial + v, i + 1, end);
            if (childResult) {
                childResult.push(v);
                return childResult;
            } else if (initial != 0) {
                break;
            }
        } else if (initial + v == target) {
            return [v];
        }
    }

    return null;
}

const t1 = performance.now();

console.log(`Searching took ${t1 - t0}ms`)

if (!firstInvalid) {
    console.log("No invalid found");
    return;
}
console.log(`First invalid: ${firstInvalid.n} on line ${firstInvalid.i + 1}`);

if (!combination) {
    console.log("No combination found.")
}
console.log(`Combination: ${combination.length} elements\n\tEncryption Weakness: ` + combinationSum);
console.dir(combination.reverse());
