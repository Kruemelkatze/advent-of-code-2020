const TEST = false;

const fs = require("fs");
const { performance } = require('perf_hooks');

const file = TEST ? "9-input-test.txt" : "9-input.txt";
const inputStr = fs.readFileSync(file, "utf-8").replace(/\r/g, "")

const t0 = performance.now();

const preamble = TEST ? 5 : 25;
const numbers = inputStr.split("\n").map(s => +s);

var current = new Set(numbers.slice(0, preamble));

var firstInvalid;
for (let i = preamble; i < numbers.length; i++) {
    let n = numbers[i];
    let foundPairForNumber = false;

    for (let c of current) {
        if (c == 2 * n)
            continue;

        let diff = n - c;
        if (current.has(diff)) {
            foundPairForNumber = true;
            break;
        }
    }

    if (!foundPairForNumber) {
        firstInvalid = { i, n };
        break;
    }
    current.delete(numbers[i - preamble]);
    current.add(n);
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
